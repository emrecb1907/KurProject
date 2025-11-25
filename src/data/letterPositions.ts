import { LETTER_AUDIO_FILES } from './elifBaLetters';

export interface LetterPosition {
    id: number;
    letterId: number;
    arabic: string;
    description: string;
    position: 'isolated' | 'initial' | 'medial' | 'final';
}

export const LETTER_POSITIONS: LetterPosition[] = [
    // Elif (1)
    { id: 1, letterId: 1, arabic: 'أ', description: 'Elif - Yalın', position: 'isolated' },
    { id: 2, letterId: 1, arabic: 'أ', description: 'Elif - Başta', position: 'initial' },
    { id: 3, letterId: 1, arabic: 'ـئـ', description: 'Elif - Ortada', position: 'medial' },
    { id: 4, letterId: 1, arabic: 'ـأ', description: 'Elif - Sonda', position: 'final' },

    // Be (2)
    { id: 5, letterId: 2, arabic: 'ب', description: 'Be - Yalın', position: 'isolated' },
    { id: 6, letterId: 2, arabic: 'بـ', description: 'Be - Başta', position: 'initial' },
    { id: 7, letterId: 2, arabic: 'ـبـ', description: 'Be - Ortada', position: 'medial' },
    { id: 8, letterId: 2, arabic: 'ـب', description: 'Be - Sonda', position: 'final' },

    // Te (3)
    { id: 9, letterId: 3, arabic: 'ت', description: 'Te - Yalın', position: 'isolated' },
    { id: 10, letterId: 3, arabic: 'تـ', description: 'Te - Başta', position: 'initial' },
    { id: 11, letterId: 3, arabic: 'ـتـ', description: 'Te - Ortada', position: 'medial' },
    { id: 12, letterId: 3, arabic: 'ـت', description: 'Te - Sonda', position: 'final' },

    // Se (4)
    { id: 13, letterId: 4, arabic: 'ث', description: 'Se - Yalın', position: 'isolated' },
    { id: 14, letterId: 4, arabic: 'ثـ', description: 'Se - Başta', position: 'initial' },
    { id: 15, letterId: 4, arabic: 'ـثـ', description: 'Se - Ortada', position: 'medial' },
    { id: 16, letterId: 4, arabic: 'ـث', description: 'Se - Sonda', position: 'final' },

    // Cim (5)
    { id: 17, letterId: 5, arabic: 'ج', description: 'Cim - Yalın', position: 'isolated' },
    { id: 18, letterId: 5, arabic: 'جـ', description: 'Cim - Başta', position: 'initial' },
    { id: 19, letterId: 5, arabic: 'ـجـ', description: 'Cim - Ortada', position: 'medial' },
    { id: 20, letterId: 5, arabic: 'ـج', description: 'Cim - Sonda', position: 'final' },
];

// Map position IDs to the corresponding letter audio
export const LETTER_POSITION_AUDIO_FILES: { [key: number]: any } = {};

LETTER_POSITIONS.forEach(pos => {
    if (LETTER_AUDIO_FILES[pos.letterId]) {
        LETTER_POSITION_AUDIO_FILES[pos.id] = LETTER_AUDIO_FILES[pos.letterId];
    }
});

