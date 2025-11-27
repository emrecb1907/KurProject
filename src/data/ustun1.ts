export interface Word {
    id: number;
    arabic: string;
    reading: string; // Transliteration or reading guide
    image: any; // PNG image
}

export const USTUN_1_WORDS: Word[] = [
    { id: 1, arabic: 'أَدَبَ', reading: 'E - De - Be', image: require('../../assets/images/lessons/KuranDers/Ustun1/1.png') },
    { id: 2, arabic: 'دَرَأَ', reading: 'De - Ra - E', image: require('../../assets/images/lessons/KuranDers/Ustun1/2.png') },
    { id: 3, arabic: 'دَرَكَ', reading: 'De - Ra - Ke', image: require('../../assets/images/lessons/KuranDers/Ustun1/3.png') },
    { id: 4, arabic: 'دَرَسَ', reading: 'De - Ra - Se', image: require('../../assets/images/lessons/KuranDers/Ustun1/4.png') },
    { id: 5, arabic: 'رَزَقَ', reading: 'Ra - Za - Ka', image: require('../../assets/images/lessons/KuranDers/Ustun1/5.png') },
    { id: 6, arabic: 'وَرَدَ', reading: 'Ve - Ra - De', image: require('../../assets/images/lessons/KuranDers/Ustun1/6.png') },
    { id: 7, arabic: 'وَرَعَ', reading: 'Ve - Ra - A', image: require('../../assets/images/lessons/KuranDers/Ustun1/7.png') },
    { id: 8, arabic: 'وَزَنَ', reading: 'Ve - Za - Ne', image: require('../../assets/images/lessons/KuranDers/Ustun1/8.png') },
    { id: 9, arabic: 'كَتَبَ', reading: 'Ke - Te - Be', image: require('../../assets/images/lessons/KuranDers/Ustun1/9.png') },
    { id: 10, arabic: 'ثَبَتَ', reading: 'Se - Be - Te', image: require('../../assets/images/lessons/KuranDers/Ustun1/10.png') },
    { id: 11, arabic: 'نَزَلَ', reading: 'Ne - Ze - Le', image: require('../../assets/images/lessons/KuranDers/Ustun1/11.png') },
    { id: 12, arabic: 'يَدَكَ', reading: 'Ye - De - Ke', image: require('../../assets/images/lessons/KuranDers/Ustun1/12.png') },
    { id: 13, arabic: 'حَسَدَ', reading: 'Ha - Se - De', image: require('../../assets/images/lessons/KuranDers/Ustun1/13.png') },
    { id: 14, arabic: 'سَجَدَ', reading: 'Se - Ce - De', image: require('../../assets/images/lessons/KuranDers/Ustun1/14.png') },
    { id: 15, arabic: 'شَرَعَ', reading: 'Şe - Ra - A', image: require('../../assets/images/lessons/KuranDers/Ustun1/15.png') },
    { id: 16, arabic: 'فَسَدَ', reading: 'Fe - Se - De', image: require('../../assets/images/lessons/KuranDers/Ustun1/16.png') },
    { id: 17, arabic: 'نَصَرَ', reading: 'Ne - Sa - Ra', image: require('../../assets/images/lessons/KuranDers/Ustun1/17.png') },
    { id: 18, arabic: 'عَرَضَ', reading: 'A - Ra - Da', image: require('../../assets/images/lessons/KuranDers/Ustun1/18.png') },
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
