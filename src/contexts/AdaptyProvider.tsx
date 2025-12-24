import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { adapty, AdaptyProfile, AdaptyPaywall, AdaptyPaywallProduct } from 'react-native-adapty';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { useAuth } from '@/store';
import { supabase } from '@/lib/supabase/client';

// Adapty SDK Key - .env dosyasından okunuyor
const ADAPTY_SDK_KEY = process.env.EXPO_PUBLIC_ADAPTY_SDK_KEY || '';

// Access level identifier - premium access'i kontrol etmek için
const PREMIUM_ACCESS_LEVEL = 'premium';

// SDK aktivasyonu flag'i - çoklu aktivasyonu önlemek için
let isAdaptyActivated = false;

// SDK aktivasyonunu modül seviyesinde yap (React component dışında)
// Adapty docs: "place activation before the React component"
const activateAdapty = async () => {
    if (isAdaptyActivated || !ADAPTY_SDK_KEY) {
        if (!ADAPTY_SDK_KEY) {
            console.warn('⚠️ ADAPTY_SDK_KEY bulunamadı');
        }
        return;
    }

    try {
        console.log('🚀 Adapty SDK aktive ediliyor...');
        console.log('📱 SDK Key:', ADAPTY_SDK_KEY.substring(0, 20) + '...');

        // Simulator kontrolü
        const isSimulator = !Device.isDevice;

        await adapty.activate(ADAPTY_SDK_KEY, {
            logLevel: __DEV__ ? 'warn' : 'error',
            // Fast Refresh hatalarını önle
            __ignoreActivationOnFastRefresh: __DEV__,
            // Simulator'da gereksiz StoreKit promptlarını engelle
            __debugDeferActivation: isSimulator,
        });

        isAdaptyActivated = true;
        console.log('✅ Adapty SDK başarıyla aktive edildi');
    } catch (error) {
        console.error('❌ Adapty SDK aktivasyon hatası:', error);
    }
};

// Sadece native ortamda (iOS/Android) aktive et
if (Platform.OS === 'ios' || Platform.OS === 'android') {
    activateAdapty();
}

interface AdaptyContextType {
    isPremium: boolean;
    isLoading: boolean;
    profile: AdaptyProfile | null;
    paywall: AdaptyPaywall | null;
    products: AdaptyPaywallProduct[];
    purchase: (product: AdaptyPaywallProduct) => Promise<'success' | 'cancelled' | 'conflict' | 'pending'>;
    restore: () => Promise<boolean>;
    refreshProfile: () => Promise<void>;
    resetPremiumState: () => void;
}

const AdaptyContext = createContext<AdaptyContextType | undefined>(undefined);

interface AdaptyProviderProps {
    children: ReactNode;
}

export function AdaptyProvider({ children }: AdaptyProviderProps) {
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<AdaptyProfile | null>(null);
    const [paywall, setPaywall] = useState<AdaptyPaywall | null>(null);
    const [products, setProducts] = useState<AdaptyPaywallProduct[]>([]);

    // Auth state'i izle (logout/login durumunu takip etmek için)
    const { user } = useAuth();
    const prevUserIdRef = useRef<string | null>(null);

    // Paywall ve ürünleri yükle (SDK modül seviyesinde aktive edildi)
    // NOT: refreshProfile() burada çağrılmaz, user değişikliği useEffect'i halleder
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // SDK key yoksa skip et
                if (!ADAPTY_SDK_KEY) {
                    setIsLoading(false);
                    return;
                }

                // Kısa bir gecikme - SDK aktivasyonunun tamamlanması için
                await new Promise(resolve => setTimeout(resolve, 500));

                // Paywall ve ürünleri yükle
                await loadPaywallAndProducts();

            } catch (error) {
                console.error('❌ Adapty veri yükleme hatası:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // 🔄 Profil değişikliklerini dinle (identify, purchase, logout sonrası)
    useEffect(() => {
        if (!ADAPTY_SDK_KEY) return;

        // Adapty profil güncellemelerini dinle
        const unsubscribe = adapty.addEventListener('onLatestProfileLoad', (profile) => {
            setProfile(profile);

            // Premium durumunu güncelle
            const accessLevel = profile.accessLevels?.[PREMIUM_ACCESS_LEVEL];
            const hasPremium = accessLevel?.isActive ?? false;
            setIsPremium(hasPremium);
        });

        return () => {
            unsubscribe.remove();
        };
    }, []);

    // 🔄 User değişikliğini izle (login/logout sonrası premium state'i güncelle)
    useEffect(() => {
        const currentUserId = user?.id || null;
        const prevUserId = prevUserIdRef.current;

        // İlk render'ı atla
        if (prevUserId === undefined) {
            prevUserIdRef.current = currentUserId;
            return;
        }

        // User değişti mi?
        if (currentUserId !== prevUserId) {
            console.log('🔄 Adapty: User değişti:', prevUserId, '→', currentUserId);

            if (currentUserId === null) {
                // Logout oldu - premium state'i sıfırla
                console.log('🔄 Adapty: Logout algılandı, premium state sıfırlanıyor...');
                setIsPremium(false);
                setProfile(null);
            } else {
                // Yeni user ile giriş yapıldı - profili yenile
                console.log('🔄 Adapty: Yeni user algılandı, profil yenileniyor...');
                // Kısa gecikme - adapty.identify() için bekle
                setTimeout(() => {
                    refreshProfile();
                }, 1000);
            }

            prevUserIdRef.current = currentUserId;
        }
    }, [user?.id]);

    // 🔄 Premium durumunu Supabase Edge Function ile DB'ye senkronize et
    const syncPremiumToDatabase = useCallback(async (userId: string, customerUserId: string) => {
        try {
            console.log('🔄 Supabase Edge Function çağrılıyor...');

            const { data, error } = await supabase.functions.invoke('verify-premium', {
                body: {
                    user_id: userId,
                    customer_user_id: customerUserId
                }
            });

            if (error) {
                console.error('❌ Premium sync hatası:', error);
            } else {
                console.log('✅ Premium DB\'ye senkronize edildi:', data);
            }
        } catch (error) {
            console.error('❌ Premium sync başarısız:', error);
        }
    }, []);

    // Profil bilgisini yenile
    const refreshProfile = useCallback(async () => {
        try {
            const userProfile = await adapty.getProfile();
            setProfile(userProfile);

            // Debug: Profil detaylarını logla
            console.log('📊 Adapty Profil Detayları:');
            console.log('   - Profile ID:', userProfile.profileId);
            console.log('   - Customer User ID:', userProfile.customerUserId);
            console.log('   - Logged-in User ID:', user?.id);
            console.log('   - Access Levels:', JSON.stringify(userProfile.accessLevels));

            // Premium erişim durumunu kontrol et
            const accessLevel = userProfile.accessLevels?.[PREMIUM_ACCESS_LEVEL];
            const hasPremium = accessLevel?.isActive ?? false;

            // ÖNEMLI: customerUserId kontrol et - eğer farklıysa premium değil!
            const profileOwnerId = userProfile.customerUserId;
            const currentUserId = user?.id;

            if (hasPremium && profileOwnerId && currentUserId && profileOwnerId !== currentUserId) {
                console.log('⚠️ Premium başka kullanıcıya ait! Profil:', profileOwnerId, 'Mevcut:', currentUserId);
                setIsPremium(false);
            } else {
                setIsPremium(hasPremium);
            }

            console.log('👤 Profil güncellendi, Premium:', hasPremium);

            // 🔄 Premium durumunu Supabase'e senkronize et (Edge Function ile)
            if (currentUserId && profileOwnerId) {
                syncPremiumToDatabase(currentUserId, profileOwnerId);
            }

        } catch (error) {
            console.error('❌ Profil yükleme hatası:', error);
        }
    }, [user?.id]);

    // Paywall ve ürünleri yükle
    const loadPaywallAndProducts = useCallback(async () => {
        try {
            // "default" placement'ından paywall'ı al
            // Adapty dashboard'da farklı bir placement kullanıyorsanız değiştirin
            const paywallData = await adapty.getPaywall('default');
            setPaywall(paywallData);

            // Paywall'daki ürünleri al
            const paywallProducts = await adapty.getPaywallProducts(paywallData);
            setProducts(paywallProducts);

            console.log('📦 Paywall yüklendi, ürün sayısı:', paywallProducts.length);

        } catch (error) {
            console.error('❌ Paywall yükleme hatası:', error);
            // Paywall bulunamazsa hata vermeden devam et
        }
    }, []);

    // Satın alma işlemi
    // Dönüş: 'success' | 'cancelled' | 'conflict' | 'pending'
    const purchase = useCallback(async (product: AdaptyPaywallProduct): Promise<'success' | 'cancelled' | 'conflict' | 'pending'> => {
        try {
            console.log('💳 Satın alma başlatılıyor:', product.vendorProductId);

            const result = await adapty.makePurchase(product);

            // Adapty v3: Purchase result type kontrolü
            if (result.type === 'user_cancelled') {
                console.log('ℹ️ Kullanıcı satın almayı iptal etti');
                return 'cancelled';
            }

            if (result.type === 'pending') {
                console.log('⏳ Satın alma beklemede');
                return 'pending';
            }

            // Başarılı satın alma - profili yeniden yükle
            const userProfile = await adapty.getProfile();
            setProfile(userProfile);

            // Premium durumunu kontrol et
            const accessLevel = userProfile.accessLevels?.[PREMIUM_ACCESS_LEVEL];
            const hasPremium = accessLevel?.isActive ?? false;
            setIsPremium(hasPremium);

            console.log('✅ Satın alma başarılı, Premium:', hasPremium);

            // Premium aktif değilse = abonelik başka hesaba bağlı
            return hasPremium ? 'success' : 'conflict';

        } catch (error: any) {
            console.error('❌ Satın alma hatası:', error);
            throw error;
        }
    }, []);

    // Premium state'i sıfırla (logout sonrası çağrılır)
    const resetPremiumState = useCallback(() => {
        console.log('🔄 Adapty: Premium state sıfırlanıyor...');
        setIsPremium(false);
        setProfile(null);
    }, []);

    // Satın alma geri yükleme
    const restore = useCallback(async (): Promise<boolean> => {
        try {
            console.log('🔄 Satın almalar geri yükleniyor...');

            const result = await adapty.restorePurchases();

            // Profili güncelle
            setProfile(result);

            // Premium durumunu kontrol et
            const accessLevel = result.accessLevels?.[PREMIUM_ACCESS_LEVEL];
            const hasPremium = accessLevel?.isActive ?? false;
            setIsPremium(hasPremium);

            console.log('✅ Geri yükleme tamamlandı, Premium:', hasPremium);
            return hasPremium;

        } catch (error) {
            console.error('❌ Geri yükleme hatası:', error);
            throw error;
        }
    }, []);

    return (
        <AdaptyContext.Provider
            value={{
                isPremium,
                isLoading,
                profile,
                paywall,
                products,
                purchase,
                restore,
                refreshProfile,
                resetPremiumState,
            }}
        >
            {children}
        </AdaptyContext.Provider>
    );
}

// Hook
export function useAdapty() {
    const context = useContext(AdaptyContext);
    if (context === undefined) {
        throw new Error('useAdapty must be used within an AdaptyProvider');
    }
    return context;
}

// Kısayol hook - sadece premium durumu için
export function usePremium() {
    const { isPremium, isLoading, purchase, restore, products, refreshProfile, profile } = useAdapty();
    return { isPremium, isLoading, purchase, restore, products, refreshProfile, profile };
}
