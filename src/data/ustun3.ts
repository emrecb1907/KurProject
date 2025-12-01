export interface Word {
    id: number;
    arabic: string;
    reading: string; // Transliteration or reading guide
    image: any; // PNG image
}

export const USTUN_3_WORDS: Word[] = [
    { id: 1, arabic: 'Kelime 1', reading: 'Okunuş 1', image: require('../../assets/images/lessons/KuranDers/Ustun3/1.png') },
    { id: 2, arabic: 'Kelime 2', reading: 'Okunuş 2', image: require('../../assets/images/lessons/KuranDers/Ustun3/2.png') },
    { id: 3, arabic: 'Kelime 3', reading: 'Okunuş 3', image: require('../../assets/images/lessons/KuranDers/Ustun3/3.png') },
    { id: 4, arabic: 'Kelime 4', reading: 'Okunuş 4', image: require('../../assets/images/lessons/KuranDers/Ustun3/4.png') },
    { id: 5, arabic: 'Kelime 5', reading: 'Okunuş 5', image: require('../../assets/images/lessons/KuranDers/Ustun3/5.png') },
    { id: 6, arabic: 'Kelime 6', reading: 'Okunuş 6', image: require('../../assets/images/lessons/KuranDers/Ustun3/6.png') },
    { id: 7, arabic: 'Kelime 7', reading: 'Okunuş 7', image: require('../../assets/images/lessons/KuranDers/Ustun3/7.png') },
    { id: 8, arabic: 'Kelime 8', reading: 'Okunuş 8', image: require('../../assets/images/lessons/KuranDers/Ustun3/8.png') },
    { id: 9, arabic: 'Kelime 9', reading: 'Okunuş 9', image: require('../../assets/images/lessons/KuranDers/Ustun3/9.png') },
    { id: 10, arabic: 'Kelime 10', reading: 'Okunuş 10', image: require('../../assets/images/lessons/KuranDers/Ustun3/10.png') },
    { id: 11, arabic: 'Kelime 11', reading: 'Okunuş 11', image: require('../../assets/images/lessons/KuranDers/Ustun3/11.png') },
    { id: 12, arabic: 'Kelime 12', reading: 'Okunuş 12', image: require('../../assets/images/lessons/KuranDers/Ustun3/12.png') },
    { id: 13, arabic: 'Kelime 13', reading: 'Okunuş 13', image: require('../../assets/images/lessons/KuranDers/Ustun3/13.png') },
    { id: 14, arabic: 'Kelime 14', reading: 'Okunuş 14', image: require('../../assets/images/lessons/KuranDers/Ustun3/14.png') },
];

// Audio files mapping
// Format: { [id]: require(...) }
export const USTUN_3_AUDIO_FILES: { [key: number]: any } = {
    1: require('../../assets/audio/letters/Ustun3/1.mp3'),
    2: require('../../assets/audio/letters/Ustun3/2.mp3'),
    3: require('../../assets/audio/letters/Ustun3/3.mp3'),
    4: require('../../assets/audio/letters/Ustun3/4.mp3'),
    5: require('../../assets/audio/letters/Ustun3/5.mp3'),
    6: require('../../assets/audio/letters/Ustun3/6.mp3'),
    7: require('../../assets/audio/letters/Ustun3/7.mp3'),
    8: require('../../assets/audio/letters/Ustun3/8.mp3'),
    9: require('../../assets/audio/letters/Ustun3/9.mp3'),
    10: require('../../assets/audio/letters/Ustun3/10.mp3'),
    11: require('../../assets/audio/letters/Ustun3/11.mp3'),
    12: require('../../assets/audio/letters/Ustun3/12.mp3'),
    13: require('../../assets/audio/letters/Ustun3/13.mp3'),
    14: require('../../assets/audio/letters/Ustun3/14.mp3'),
};
