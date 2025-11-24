import { ARABIC_LETTERS, type Letter } from './elifBaLetters';

export interface HarekeliLetter extends Letter {
    harekeId: number; // 1=Üstün, 2=Esre, 3=Ötre
    baseId: number;
}

// Unicode marks
const USTUN = '\u064E';
const ESRE = '\u0650';
const OTRE = '\u064F';

// Helper to generate list
const generateList = (harekeId: number, mark: string, suffix: string): HarekeliLetter[] => {
    return ARABIC_LETTERS.map(letter => ({
        ...letter,
        id: parseInt(`${harekeId}${letter.id.toString().padStart(2, '0')}`), // e.g. 101, 201, 301
        baseId: letter.id,
        harekeId,
        arabic: letter.arabic + mark,
        // Simple transliteration adjustment (can be refined)
        name: letter.name + ` (${suffix})`
    }));
};

export const USTUN_LETTERS = generateList(1, USTUN, 'Üstün');
export const ESRE_LETTERS = generateList(2, ESRE, 'Esre');
export const OTRE_LETTERS = generateList(3, OTRE, 'Ötre');

export const HAREKE_TYPES = [
    { id: 1, name: 'Üstün', description: 'Harfin üzerine konur ve ince harfleri "e", kalın harfleri "a" sesiyle okutur.', letters: USTUN_LETTERS },
    { id: 2, name: 'Esre', description: 'Harfin altına konur ve ince harfleri "i", kalın harfleri "ı-i" arası bir sesle okutur.', letters: ESRE_LETTERS },
    { id: 3, name: 'Ötre', description: 'Harfin üzerine konur ve ince harfleri "u-ü", kalın harfleri "u" sesiyle okutur.', letters: OTRE_LETTERS },
];

// Placeholder for audio files
// Format: { [uniqueId]: require(...) }
// IDs are: 101-129 (Üstün), 201-229 (Esre), 301-329 (Ötre)
export const HAREKE_AUDIO_FILES: { [key: number]: any } = {
    // Example:
    // 101: require('../../assets/audio/harekeler/ustun/1.mp3'),
};
