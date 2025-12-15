import { colors } from '@/constants/colors';
import { BookOpen, BookBookmark, HandPalm, Star } from 'phosphor-react-native';

export const namazDualari = [
    {
        id: 2001,
        title: 'Namazın Temel Duaları',
        description: 'Namaz Duaları',
        level: 1,
        unlocked: true,
        color: colors.primary,
        borderColor: colors.buttonOrangeBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/temel-dualar',
    },
    {
        id: 2002,
        title: 'Namazda Okunan Kısa Sureler',
        description: 'Kısa Sureler',
        level: 1,
        unlocked: true,
        color: colors.secondary,
        borderColor: colors.buttonBlueBorder,
        icon: BookBookmark,
        route: '/lessons/namazDualari/kisa-sureler',
    },
    {
        id: 2003,
        title: 'Tamamlayıcı ve İleri Düzey Namaz Metinleri',
        description: 'İleri Düzey',
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/ileri-duzey',
    },
    {
        id: 2004,
        title: 'Kısa Sureler (Ezber ve Pekiştirme)',
        description: 'Ezber ve Pekiştirme',
        level: 1,
        unlocked: true,
        color: colors.pink,
        borderColor: colors.buttonPinkBorder,
        icon: Star,
        route: '/lessons/namazDualari/ezber-pekistirme',
    },
];
