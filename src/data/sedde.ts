export interface Word {
    id: number;
    arabic: string;
    reading: string; // Transliteration or reading guide
    image: any; // PNG image
}

export const SEDDE_WORDS: Word[] = [
    { id: 1, arabic: 'Kelime 1', reading: 'Okunuş 1', image: require('@assets/images/lessons/KuranDers/sedde/1.png') },
    { id: 2, arabic: 'Kelime 2', reading: 'Okunuş 2', image: require('@assets/images/lessons/KuranDers/sedde/2.png') },
    { id: 3, arabic: 'Kelime 3', reading: 'Okunuş 3', image: require('@assets/images/lessons/KuranDers/sedde/3.png') },
    { id: 4, arabic: 'Kelime 4', reading: 'Okunuş 4', image: require('@assets/images/lessons/KuranDers/sedde/4.png') },
    { id: 5, arabic: 'Kelime 5', reading: 'Okunuş 5', image: require('@assets/images/lessons/KuranDers/sedde/5.png') },
    { id: 6, arabic: 'Kelime 6', reading: 'Okunuş 6', image: require('@assets/images/lessons/KuranDers/sedde/6.png') },
    { id: 7, arabic: 'Kelime 7', reading: 'Okunuş 7', image: require('@assets/images/lessons/KuranDers/sedde/7.png') },
    { id: 8, arabic: 'Kelime 8', reading: 'Okunuş 8', image: require('@assets/images/lessons/KuranDers/sedde/8.png') },
    { id: 9, arabic: 'Kelime 9', reading: 'Okunuş 9', image: require('@assets/images/lessons/KuranDers/sedde/9.png') },
    { id: 10, arabic: 'Kelime 10', reading: 'Okunuş 10', image: require('@assets/images/lessons/KuranDers/sedde/10.png') },
    { id: 11, arabic: 'Kelime 11', reading: 'Okunuş 11', image: require('@assets/images/lessons/KuranDers/sedde/11.png') },
    { id: 12, arabic: 'Kelime 12', reading: 'Okunuş 12', image: require('@assets/images/lessons/KuranDers/sedde/12.png') },
    { id: 13, arabic: 'Kelime 13', reading: 'Okunuş 13', image: require('@assets/images/lessons/KuranDers/sedde/13.png') },
    { id: 14, arabic: 'Kelime 14', reading: 'Okunuş 14', image: require('@assets/images/lessons/KuranDers/sedde/14.png') },
    { id: 15, arabic: 'Kelime 15', reading: 'Okunuş 15', image: require('@assets/images/lessons/KuranDers/sedde/15.png') },
    { id: 16, arabic: 'Kelime 16', reading: 'Okunuş 16', image: require('@assets/images/lessons/KuranDers/sedde/16.png') },
    { id: 17, arabic: 'Kelime 17', reading: 'Okunuş 17', image: require('@assets/images/lessons/KuranDers/sedde/17.png') },
    { id: 18, arabic: 'Kelime 18', reading: 'Okunuş 18', image: require('@assets/images/lessons/KuranDers/sedde/18.png') },
    { id: 19, arabic: 'Kelime 19', reading: 'Okunuş 19', image: require('@assets/images/lessons/KuranDers/sedde/19.png') },
    { id: 20, arabic: 'Kelime 20', reading: 'Okunuş 20', image: require('@assets/images/lessons/KuranDers/sedde/20.png') },
    { id: 21, arabic: 'Kelime 21', reading: 'Okunuş 21', image: require('@assets/images/lessons/KuranDers/sedde/21.png') },
    { id: 22, arabic: 'Kelime 22', reading: 'Okunuş 22', image: require('@assets/images/lessons/KuranDers/sedde/22.png') },
    { id: 23, arabic: 'Kelime 23', reading: 'Okunuş 23', image: require('@assets/images/lessons/KuranDers/sedde/23.png') },
    { id: 24, arabic: 'Kelime 24', reading: 'Okunuş 24', image: require('@assets/images/lessons/KuranDers/sedde/24.png') },
    { id: 25, arabic: 'Kelime 25', reading: 'Okunuş 25', image: require('@assets/images/lessons/KuranDers/sedde/25.png') },
    { id: 26, arabic: 'Kelime 26', reading: 'Okunuş 26', image: require('@assets/images/lessons/KuranDers/sedde/26.png') },
    { id: 27, arabic: 'Kelime 27', reading: 'Okunuş 27', image: require('@assets/images/lessons/KuranDers/sedde/27.png') },
    { id: 28, arabic: 'Kelime 28', reading: 'Okunuş 28', image: require('@assets/images/lessons/KuranDers/sedde/28.png') },
];

// Audio files mapping
// Format: { [id]: require(...) }
export const SEDDE_AUDIO_FILES: { [key: number]: any } = {
    1: require('@assets/audio/letters/sedde/1.mp3'),
    2: require('@assets/audio/letters/sedde/2.mp3'),
    3: require('@assets/audio/letters/sedde/3.mp3'),
    4: require('@assets/audio/letters/sedde/4.mp3'),
    5: require('@assets/audio/letters/sedde/5.mp3'),
    6: require('@assets/audio/letters/sedde/6.mp3'),
    7: require('@assets/audio/letters/sedde/7.mp3'),
    8: require('@assets/audio/letters/sedde/8.mp3'),
    9: require('@assets/audio/letters/sedde/9.mp3'),
    10: require('@assets/audio/letters/sedde/10.mp3'),
    11: require('@assets/audio/letters/sedde/11.mp3'),
    12: require('@assets/audio/letters/sedde/12.mp3'),
    13: require('@assets/audio/letters/sedde/13.mp3'),
    14: require('@assets/audio/letters/sedde/14.mp3'),
    15: require('@assets/audio/letters/sedde/15.mp3'),
    16: require('@assets/audio/letters/sedde/16.mp3'),
    17: require('@assets/audio/letters/sedde/17.mp3'),
    18: require('@assets/audio/letters/sedde/18.mp3'),
    19: require('@assets/audio/letters/sedde/19.mp3'),
    20: require('@assets/audio/letters/sedde/20.mp3'),
    21: require('@assets/audio/letters/sedde/21.mp3'),
    22: require('@assets/audio/letters/sedde/22.mp3'),
    23: require('@assets/audio/letters/sedde/23.mp3'),
    24: require('@assets/audio/letters/sedde/24.mp3'),
    25: require('@assets/audio/letters/sedde/25.mp3'),
    26: require('@assets/audio/letters/sedde/26.mp3'),
    27: require('@assets/audio/letters/sedde/27.mp3'),
    28: require('@assets/audio/letters/sedde/28.mp3'),
};
