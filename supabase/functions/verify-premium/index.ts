import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { user_id, customer_user_id } = await req.json()

        if (!user_id || !customer_user_id) {
            return new Response(
                JSON.stringify({ error: 'user_id and customer_user_id required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`🔍 Verifying premium for user: ${user_id}, adapty: ${customer_user_id}`)

        // 1. Adapty API'den GERÇEK durumu sorgula
        const adaptyApiKey = Deno.env.get('ADAPTY_SECRET_API_KEY')

        if (!adaptyApiKey) {
            console.error('ADAPTY_SECRET_API_KEY not found in environment')
            return new Response(
                JSON.stringify({ error: 'API key not configured', isPremium: false }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const adaptyResponse = await fetch(
            `https://api.adapty.io/api/v2/server-side-api/profile/`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Api-Key ${adaptyApiKey}`,
                    'adapty-customer-user-id': customer_user_id,
                    'adapty-platform': 'iOS',
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!adaptyResponse.ok) {
            console.error('Adapty API error:', adaptyResponse.status, await adaptyResponse.text())
            return new Response(
                JSON.stringify({ error: 'Adapty API error', isPremium: false }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const adaptyData = await adaptyResponse.json()

        // Debug: Tam response'u logla
        console.log('📊 Adapty FULL response:', JSON.stringify(adaptyData))

        // API V2 format: access_levels bir ARRAY, access_level_id ile bulunuyor
        const accessLevelsArray = adaptyData.data?.access_levels || []

        // "premium" access level'ı bul
        const premiumAccess = accessLevelsArray.find(
            (al: any) => al.access_level_id === 'premium'
        ) || null

        console.log('📊 Premium Access:', JSON.stringify(premiumAccess))

        // Premium durumunu belirle (expires_at > now ise aktif)
        const expiresAt = premiumAccess?.expires_at ?? null
        const now = new Date()
        const expiresDate = expiresAt ? new Date(expiresAt) : null
        const isPremium = expiresDate ? expiresDate > now : false

        // Diğer bilgileri çıkar
        const productId = premiumAccess?.store_product_id ?? null
        const store = premiumAccess?.store ?? null
        const startedAt = premiumAccess?.purchased_at ?? null

        // renewal_cancelled_at varsa iptal edilmiş demek (willRenew = false)
        const cancelledAt = premiumAccess?.renewal_cancelled_at ?? null
        const willRenew = cancelledAt === null && isPremium

        console.log(`✅ Premium status: ${isPremium}, expires: ${expiresAt}, willRenew: ${willRenew}`)

        // 3. Supabase'e yaz (Service Role ile)
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        // UPSERT - kayıt yoksa ekle, varsa güncelle
        const { error: upsertError } = await supabase
            .from('user_premium')
            .upsert({
                user_id: user_id,
                is_active: isPremium,
                expires_at: expiresAt,
                product_id: productId,
                store: store,
                adapty_profile_id: customer_user_id,
                started_at: startedAt,
                will_renew: willRenew,
                cancelled_at: cancelledAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            })

        if (upsertError) {
            console.error('DB upsert error:', upsertError)
        } else {
            console.log('💾 Premium status synced to database')
        }

        // 4. Sonucu döndür
        return new Response(
            JSON.stringify({
                isPremium,
                expiresAt,
                productId,
                willRenew,
                synced: !upsertError
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message, isPremium: false }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
