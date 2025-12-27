-- ═══════════════════════════════════════════════════════════════════════════
-- consume_energy: Enerji tüketimi ve session oluşturma (Auth Secure)
-- ═══════════════════════════════════════════════════════════════════════════
-- Güvenlik Güncellemeleri:
-- 1. auth.uid() kontrolü eklendi
-- 2. Server-side session ID generation
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION consume_energy(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sync_result json;
    v_current_energy INT;
    v_session_id TEXT;
BEGIN
    -- 🔐 AUTH KONTROLU
    IF p_user_id != auth.uid() THEN
        RETURN json_build_object('success', false, 'error', 'UNAUTHORIZED');
    END IF;

    -- Önce hak edişleri ver (Sync)
    v_sync_result := public.sync_user_energy(p_user_id);
    v_current_energy := (v_sync_result->>'current_energy')::INT;
    
    -- Kontrol et
    IF v_current_energy > 0 THEN
        -- Enerjiyi düş
        UPDATE public.user_energy
        SET current_energy = current_energy - 1,
            last_energy_update = CASE 
                WHEN current_energy = 6 THEN now() 
                ELSE last_energy_update 
            END
        WHERE user_id = p_user_id
        RETURNING current_energy INTO v_current_energy;
        
        -- 🔐 SESSION OLUŞTUR (Server-side)
        v_session_id := encode(gen_random_bytes(16), 'hex') || '_' || extract(epoch from now())::text;
        
        INSERT INTO public.user_sessions (user_id, session_id, created_at, updated_at)
        VALUES (p_user_id, v_session_id, now(), now())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            session_id = EXCLUDED.session_id,
            updated_at = now();
        
        -- Session ID ile birlikte dön
        RETURN json_build_object(
            'success', true, 
            'current_energy', v_current_energy,
            'session_id', v_session_id
        );
    ELSE
        RETURN json_build_object('success', false, 'error', 'Yetersiz Enerji');
    END IF;
END;
$$;
