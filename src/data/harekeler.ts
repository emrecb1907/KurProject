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
    { id: 28, name: 'Lam Elif', forms: { ustun: 'لاَ', esre: 'لاِ', otre: 'لاُ' } },
    { id: 29, name: 'Ye', forms: { ustun: 'يَ', esre: 'يِ', otre: 'يُ' } },
];

// Audio files for harekeler - placeholder for now
// You can add audio files later in assets/audio/letters/Harekeler/
export const HAREKE_AUDIO_FILES: { [key: number]: any } = {
    // Audio files can be added here when available
    // Example: 1: require('../../assets/audio/letters/Harekeler/1.mp3'),
};
