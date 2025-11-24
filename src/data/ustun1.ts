export interface Word {
    id: number;
    arabic: string;
    reading: string; // Transliteration or reading guide
}

export const USTUN_1_WORDS: Word[] = [
    { id: 1, arabic: 'أَدَبَ', reading: 'E - De - Be' },
    { id: 2, arabic: 'دَرَأَ', reading: 'De - Ra - E' },
    { id: 3, arabic: 'دَرَكَ', reading: 'De - Ra - Ke' },
    { id: 4, arabic: 'دَرَسَ', reading: 'De - Ra - Se' },
    { id: 5, arabic: 'رَزَقَ', reading: 'Ra - Za - Ka' },
    { id: 6, arabic: 'وَرَدَ', reading: 'Ve - Ra - De' },
    { id: 7, arabic: 'وَرَعَ', reading: 'Ve - Ra - A' },
    { id: 8, arabic: 'وَزَنَ', reading: 'Ve - Za - Ne' },
    { id: 9, arabic: 'كَتَبَ', reading: 'Ke - Te - Be' },
    { id: 10, arabic: 'ثَبَتَ', reading: 'Se - Be - Te' },
    { id: 11, arabic: 'نَزَلَ', reading: 'Ne - Ze - Le' },
    { id: 12, arabic: 'يَدَكَ', reading: 'Ye - De - Ke' },
    { id: 13, arabic: 'حَسَدَ', reading: 'Ha - Se - De' },
    { id: 14, arabic: 'سَجَدَ', reading: 'Se - Ce - De' },
    { id: 15, arabic: 'شَرَعَ', reading: 'Şe - Ra - A' },
    { id: 16, arabic: 'فَسَدَ', reading: 'Fe - Se - De' },
    { id: 17, arabic: 'نَصَرَ', reading: 'Ne - Sa - Ra' },
    { id: 18, arabic: 'عَرَضَ', reading: 'A - Ra - Da' },
];

// Audio files mapping
// Format: { [id]: require(...) }
// Files are named ID-2.mp3 (e.g., 1-2.mp3 for ID 1)
export const USTUN_1_AUDIO_FILES: { [key: number]: any } = {
    1: require('../../assets/audio/letters/Ustun-1/1-2.mp3'),
    2: require('../../assets/audio/letters/Ustun-1/2-2.mp3'),
    3: require('../../assets/audio/letters/Ustun-1/3-2.mp3'),
    4: require('../../assets/audio/letters/Ustun-1/4-2.mp3'),
    5: require('../../assets/audio/letters/Ustun-1/5-2.mp3'),
    6: require('../../assets/audio/letters/Ustun-1/6-2.mp3'),
    7: require('../../assets/audio/letters/Ustun-1/7-2.mp3'),
    8: require('../../assets/audio/letters/Ustun-1/8-2.mp3'),
    9: require('../../assets/audio/letters/Ustun-1/9-2.mp3'),
    10: require('../../assets/audio/letters/Ustun-1/10-2.mp3'),
    11: require('../../assets/audio/letters/Ustun-1/11-2.mp3'),
    12: require('../../assets/audio/letters/Ustun-1/12-2.mp3'),
    13: require('../../assets/audio/letters/Ustun-1/13-2.mp3'),
    14: require('../../assets/audio/letters/Ustun-1/14-2.mp3'),
    15: require('../../assets/audio/letters/Ustun-1/15-2.mp3'),
    16: require('../../assets/audio/letters/Ustun-1/16-2.mp3'),
    17: require('../../assets/audio/letters/Ustun-1/17-2.mp3'),
    18: require('../../assets/audio/letters/Ustun-1/18-2.mp3'),
};
