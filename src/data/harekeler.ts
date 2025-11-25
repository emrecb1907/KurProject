export interface CombinedHarekeLetter {
    id: number;
    name: string;
    forms: {
        ustun: string;  // Üstün (fetha)
        esre: string;   // Esre (kesra)
        otre: string;   // Ötre (damma)
    };
}

export const COMBINED_HAREKE_LETTERS: CombinedHarekeLetter[] = [
    { id: 1, name: 'Elif', forms: { ustun: 'اَ', esre: 'اِ', otre: 'اُ' } },
    { id: 2, name: 'Be', forms: { ustun: 'بَ', esre: 'بِ', otre: 'بُ' } },
    { id: 3, name: 'Te', forms: { ustun: 'تَ', esre: 'تِ', otre: 'تُ' } },
    { id: 4, name: 'Se', forms: { ustun: 'ثَ', esre: 'ثِ', otre: 'ثُ' } },
    { id: 5, name: 'Cim', forms: { ustun: 'جَ', esre: 'جِ', otre: 'جُ' } },
    { id: 6, name: 'Ha', forms: { ustun: 'حَ', esre: 'حِ', otre: 'حُ' } },
    { id: 7, name: 'Hı', forms: { ustun: 'خَ', esre: 'خِ', otre: 'خُ' } },
    { id: 8, name: 'Dal', forms: { ustun: 'دَ', esre: 'دِ', otre: 'دُ' } },
    { id: 9, name: 'Zel', forms: { ustun: 'ذَ', esre: 'ذِ', otre: 'ذُ' } },
    { id: 10, name: 'Ra', forms: { ustun: 'رَ', esre: 'رِ', otre: 'رُ' } },
    { id: 11, name: 'Ze', forms: { ustun: 'زَ', esre: 'زِ', otre: 'زُ' } },
    { id: 12, name: 'Sin', forms: { ustun: 'سَ', esre: 'سِ', otre: 'سُ' } },
    { id: 13, name: 'Şın', forms: { ustun: 'شَ', esre: 'شِ', otre: 'شُ' } },
    { id: 14, name: 'Sad', forms: { ustun: 'صَ', esre: 'صِ', otre: 'صُ' } },
    { id: 15, name: 'Dad', forms: { ustun: 'ضَ', esre: 'ضِ', otre: 'ضُ' } },
    { id: 16, name: 'Tı', forms: { ustun: 'طَ', esre: 'طِ', otre: 'طُ' } },
    { id: 17, name: 'Zı', forms: { ustun: 'ظَ', esre: 'ظِ', otre: 'ظُ' } },
    { id: 18, name: 'Ayn', forms: { ustun: 'عَ', esre: 'عِ', otre: 'عُ' } },
    { id: 19, name: 'Gayn', forms: { ustun: 'غَ', esre: 'غِ', otre: 'غُ' } },
    { id: 20, name: 'Fe', forms: { ustun: 'فَ', esre: 'فِ', otre: 'فُ' } },
    { id: 21, name: 'Kaf', forms: { ustun: 'قَ', esre: 'قِ', otre: 'قُ' } },
    { id: 22, name: 'Kef', forms: { ustun: 'كَ', esre: 'كِ', otre: 'كُ' } },
    { id: 23, name: 'Lam', forms: { ustun: 'لَ', esre: 'لِ', otre: 'لُ' } },
    { id: 24, name: 'Mim', forms: { ustun: 'مَ', esre: 'مِ', otre: 'مُ' } },
    { id: 25, name: 'Nun', forms: { ustun: 'نَ', esre: 'نِ', otre: 'نُ' } },
    { id: 26, name: 'Vav', forms: { ustun: 'وَ', esre: 'وِ', otre: 'وُ' } },
    { id: 27, name: 'He', forms: { ustun: 'هَ', esre: 'هِ', otre: 'هُ' } },
    { id: 28, name: 'Ye', forms: { ustun: 'يَ', esre: 'يِ', otre: 'يُ' } },
];

// Audio files for harekeler
export const HAREKE_AUDIO_FILES: { [key: number]: any } = {
    1: require('../../assets/audio/letters/Harekeler/1-1.mp3'),
    2: require('../../assets/audio/letters/Harekeler/2-1.mp3'),
    3: require('../../assets/audio/letters/Harekeler/3-1.mp3'),
    4: require('../../assets/audio/letters/Harekeler/4-1.mp3'),
    5: require('../../assets/audio/letters/Harekeler/5-1.mp3'),
    6: require('../../assets/audio/letters/Harekeler/6-1.mp3'),
    7: require('../../assets/audio/letters/Harekeler/7-1.mp3'),
    8: require('../../assets/audio/letters/Harekeler/8-1.mp3'),
    9: require('../../assets/audio/letters/Harekeler/9-1.mp3'),
    10: require('../../assets/audio/letters/Harekeler/10-1.mp3'),
    11: require('../../assets/audio/letters/Harekeler/11-1.mp3'),
    12: require('../../assets/audio/letters/Harekeler/12-1.mp3'),
    13: require('../../assets/audio/letters/Harekeler/13-1.mp3'),
    14: require('../../assets/audio/letters/Harekeler/14-1.mp3'),
    15: require('../../assets/audio/letters/Harekeler/15-1.mp3'),
    16: require('../../assets/audio/letters/Harekeler/16-1.mp3'),
    17: require('../../assets/audio/letters/Harekeler/17-1.mp3'),
    18: require('../../assets/audio/letters/Harekeler/18-1.mp3'),
    19: require('../../assets/audio/letters/Harekeler/19-1.mp3'),
    20: require('../../assets/audio/letters/Harekeler/20-1.mp3'),
    21: require('../../assets/audio/letters/Harekeler/21-1.mp3'),
    22: require('../../assets/audio/letters/Harekeler/22-1.mp3'),
    23: require('../../assets/audio/letters/Harekeler/23-1.mp3'),
    24: require('../../assets/audio/letters/Harekeler/24-1.mp3'),
    25: require('../../assets/audio/letters/Harekeler/25-1.mp3'),
    26: require('../../assets/audio/letters/Harekeler/26-1.mp3'),
    27: require('../../assets/audio/letters/Harekeler/27-1.mp3'),
    28: require('../../assets/audio/letters/Harekeler/28-1.mp3'),
};
