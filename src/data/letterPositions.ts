import { LETTER_AUDIO_FILES } from './elifBaLetters';

export interface LetterPosition {
    id: number;
    letterId: number;
    image: any;
    scale?: number;
}

export const LETTER_POSITIONS: LetterPosition[] = [
    { id: 1, letterId: 1, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/1.png') },
    { id: 2, letterId: 2, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/2.png') },
    { id: 3, letterId: 3, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/3.png') },
    { id: 4, letterId: 4, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/4.png') },
    { id: 5, letterId: 5, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/5.png') },
    { id: 6, letterId: 6, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/6.png') },
    { id: 7, letterId: 7, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/7.png') },
    { id: 8, letterId: 8, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/8.png') },
    { id: 9, letterId: 9, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/9.png') },
    { id: 10, letterId: 10, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/10.png') },
    { id: 11, letterId: 11, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/11.png') },
    { id: 12, letterId: 12, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/12.png') },
    { id: 13, letterId: 13, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/13.png') },
    { id: 14, letterId: 14, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/14.png') },
    { id: 15, letterId: 15, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/15.png') },
    { id: 16, letterId: 16, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/16.png') },
    { id: 17, letterId: 17, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/17.png') },
    { id: 18, letterId: 18, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/18.png') },
    { id: 19, letterId: 19, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/19.png') },
    { id: 20, letterId: 20, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/20.png'), scale: 1.25 },
    { id: 21, letterId: 21, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/21.png'), scale: 1.25 },
    { id: 22, letterId: 22, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/22.png') },
    { id: 23, letterId: 23, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/23.png') },
    { id: 24, letterId: 24, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/24.png') },
    { id: 25, letterId: 25, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/25.png'), scale: 1.25 },
    { id: 26, letterId: 26, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/26.png'), scale: 1.25 },
    { id: 27, letterId: 27, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/27.png') },
    { id: 28, letterId: 29, image: require('../../assets/images/lessons/KuranDers/HarflerinKonumu/28.png') }, // Mapping 28.png to Ye (29) assuming Lam Elif (28) is skipped or 28.png is Ye
];

// Map position IDs to the corresponding letter audio
export const LETTER_POSITION_AUDIO_FILES: { [key: number]: any } = {};

LETTER_POSITIONS.forEach(pos => {
    if (LETTER_AUDIO_FILES[pos.letterId]) {
        LETTER_POSITION_AUDIO_FILES[pos.id] = LETTER_AUDIO_FILES[pos.letterId];
    }
});
