import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { adapty, AdaptyProfile, AdaptyPaywall, AdaptyPaywallProduct } from 'react-native-adapty';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

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
            logLevel: __DEV__ ? 'verbose' : 'error',
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

    // Profil ve paywall bilgilerini yükle (SDK modül seviyesinde aktive edildi)
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

                // Profil bilgisini al
                await refreshProfile();

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
            console.log('🔄 Adapty: Profil güncellendi (listener)');
            setProfile(profile);

            // Premium durumunu güncelle
            const accessLevel = profile.accessLevels?.[PREMIUM_ACCESS_LEVEL];
            const hasPremium = accessLevel?.isActive ?? false;
            setIsPremium(hasPremium);
            console.log('👤 Yeni Premium durumu:', hasPremium);
        });

        return () => {
            unsubscribe.remove();
        };
    }, []);

    // Profil bilgisini yenile
    const refreshProfile = useCallback(async () => {
        try {
            const userProfile = await adapty.getProfile();
            setProfile(userProfile);

            // Premium erişim durumunu kontrol et
            const accessLevel = userProfile.accessLevels?.[PREMIUM_ACCESS_LEVEL];
            const hasPremium = accessLevel?.isActive ?? false;

            setIsPremium(hasPremium);
            console.log('👤 Profil güncellendi, Premium:', hasPremium);

        } catch (error) {
            console.error('❌ Profil yükleme hatası:', error);
        }
    }, []);

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
    const { isPremium, isLoading, purchase, restore, products, refreshProfile } = useAdapty();
    return { isPremium, isLoading, purchase, restore, products, refreshProfile };
}
