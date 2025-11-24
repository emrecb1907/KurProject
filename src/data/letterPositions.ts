export interface LetterPosition {
    id: number;
    arabic: string;
    description: string; // Description of the letter position
}

export const LETTER_POSITIONS: LetterPosition[] = [
    { id: 1, arabic: 'ا ـــ ـــ ا', description: 'Elif - Baş, Orta, Son' },
    { id: 2, arabic: 'ب ـبـ ـب', description: 'Be - Baş, Orta, Son' },
    { id: 3, arabic: 'ت ـتـ ـت', description: 'Te - Baş, Orta, Son' },
    { id: 4, arabic: 'ث ـثـ ـث', description: 'Se - Baş, Orta, Son' },
    { id: 5, arabic: 'ج ـجـ ـج', description: 'Cim - Baş, Orta, Son' },
];

// Audio files mapping
// Format: { [id]: require(...) }
export const LETTER_POSITION_AUDIO_FILES: { [key: number]: any } = {
    // Audio files will be added later
    // 1: require('../../assets/audio/letters/positions/1.mp3'),
};
