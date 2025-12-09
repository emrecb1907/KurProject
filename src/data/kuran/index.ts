import { KuranLessonContent } from './types';

// Data Imports
import { ARABIC_LETTERS, LETTER_AUDIO_FILES } from '@/data/elifBaLetters'; // 101
import { COMBINED_HAREKE_LETTERS, HAREKE_AUDIO_FILES } from '@/data/harekeler'; // 102
import { LETTER_POSITIONS, LETTER_POSITION_AUDIO_FILES } from '@/data/letterPositions'; // 103
import { USTUN_1_WORDS, USTUN_1_AUDIO_FILES } from '@/data/ustun1'; // 104
import { USTUN_2_WORDS, USTUN_2_AUDIO_FILES } from '@/data/ustun2'; // 105
import { USTUN_3_WORDS, USTUN_3_AUDIO_FILES } from '@/data/ustun3'; // 106
import { ESRE_WORDS, ESRE_AUDIO_FILES } from '@/data/esre'; // 107
import { OTRE_WORDS, OTRE_AUDIO_FILES } from '@/data/otre'; // 108
import { IKI_USTUN_WORDS, IKI_USTUN_AUDIO_FILES } from '@/data/ikiUstun'; // 109
import { IKI_ESRE_WORDS, IKI_ESRE_AUDIO_FILES } from '@/data/ikiEsre'; // 110
import { IKI_OTRE_WORDS, IKI_OTRE_AUDIO_FILES } from '@/data/ikiOtre'; // 111
import { CEZM_WORDS, CEZM_AUDIO_FILES } from '@/data/cezm'; // 112
import { CEZMLI_OKUNUS_WORDS, CEZMLI_OKUNUS_AUDIO_FILES } from '@/data/cezmliOkunus'; // 113
import { ALISTIRMALAR1_WORDS, ALISTIRMALAR1_AUDIO_FILES } from '@/data/alistirmalar1'; // 114
import { ALISTIRMALAR2_WORDS, ALISTIRMALAR2_AUDIO_FILES } from '@/data/alistirmalar2'; // 115
import { ALISTIRMALAR3_WORDS, ALISTIRMALAR3_AUDIO_FILES } from '@/data/alistirmalar3'; // 116
import { HARFLERIN_UZATILARAK_OKUNUSU_WORDS, HARFLERIN_UZATILARAK_OKUNUSU_AUDIO_FILES } from '@/data/harflerinUzatilarakOkunusu'; // 117
import { MED_UZATMA_ELIF_WORDS, MED_UZATMA_ELIF_AUDIO_FILES } from '@/data/medUzatmaElif'; // 118
import { MED_UZATMA_VAV_WORDS, MED_UZATMA_VAV_AUDIO_FILES } from '@/data/medUzatmaVav'; // 119
import { MED_UZATMA_YA_WORDS, MED_UZATMA_YA_AUDIO_FILES } from '@/data/medUzatmaYa'; // 120
import { CEKER_WORDS, CEKER_AUDIO_FILES } from '@/data/ceker'; // 121
import { SEDDE_WORDS, SEDDE_AUDIO_FILES } from '@/data/sedde'; // 122
import { SEDDELI_OKUNUS_WORDS, SEDDELI_OKUNUS_AUDIO_FILES } from '@/data/seddeliOkunus'; // 123
import { VAV_VE_YA_SEKLI_ELIF_WORDS, VAV_VE_YA_SEKLI_ELIF_AUDIO_FILES } from '@/data/vavVeYaSekliElif'; // 124
import { ZAMIR_WORDS, ZAMIR_AUDIO_FILES } from '@/data/zamir'; // 125
import { EL_TAKISI_WORDS, EL_TAKISI_AUDIO_FILES } from '@/data/elTakisi'; // 126
import { OKUNMAYAN_ELIF_WORDS, OKUNMAYAN_ELIF_AUDIO_FILES } from '@/data/okunmayanElifveElifLam'; // 127
import { LAFZATULLAH_WORDS, LAFZATULLAH_AUDIO_FILES } from '@/data/lafzatullah'; // 128

export const getLessonData = (lessonId: number): KuranLessonContent[] => {
    switch (lessonId) {
        // 101: Elif-Ba (Text)
        case 101:
            return ARABIC_LETTERS.map(l => ({
                id: l.id,
                type: 'text',
                text: l.arabic,
                subText: l.name,
                transliteration: l.trans,
                audio: LETTER_AUDIO_FILES[l.id]
            }));

        // 102: Harekeler (Text with forms)
        case 102:
            return COMBINED_HAREKE_LETTERS.map(l => ({
                id: l.id,
                type: 'text',
                text: l.name, // Primary text logic depends on view, but mapping name here
                subText: l.name,
                audio: HAREKE_AUDIO_FILES[l.id],
                forms: l.forms // Special property for Lesson 102
            }));

        // 103: Harflerin Konumu (Image)
        case 103:
            return LETTER_POSITIONS.map(p => ({
                id: p.id,
                type: 'image',
                image: p.image,
                audio: LETTER_POSITION_AUDIO_FILES[p.id]
            }));

        // 104-128: Standard Image Lessons
        case 104: return mapImageLesson(USTUN_1_WORDS, USTUN_1_AUDIO_FILES);
        case 105: return mapImageLesson(USTUN_2_WORDS, USTUN_2_AUDIO_FILES);
        case 106: return mapImageLesson(USTUN_3_WORDS, USTUN_3_AUDIO_FILES);
        case 107: return mapImageLesson(ESRE_WORDS, ESRE_AUDIO_FILES);
        case 108: return mapImageLesson(OTRE_WORDS, OTRE_AUDIO_FILES);
        case 109: return mapImageLesson(IKI_USTUN_WORDS, IKI_USTUN_AUDIO_FILES);
        case 110: return mapImageLesson(IKI_ESRE_WORDS, IKI_ESRE_AUDIO_FILES);
        case 111: return mapImageLesson(IKI_OTRE_WORDS, IKI_OTRE_AUDIO_FILES);
        case 112: return mapImageLesson(CEZM_WORDS, CEZM_AUDIO_FILES);
        case 113: return mapImageLesson(CEZMLI_OKUNUS_WORDS, CEZMLI_OKUNUS_AUDIO_FILES);
        case 114: return mapImageLesson(ALISTIRMALAR1_WORDS, ALISTIRMALAR1_AUDIO_FILES);
        case 115: return mapImageLesson(ALISTIRMALAR2_WORDS, ALISTIRMALAR2_AUDIO_FILES);
        case 116: return mapImageLesson(ALISTIRMALAR3_WORDS, ALISTIRMALAR3_AUDIO_FILES);
        case 117: return mapImageLesson(HARFLERIN_UZATILARAK_OKUNUSU_WORDS, HARFLERIN_UZATILARAK_OKUNUSU_AUDIO_FILES);
        case 118: return mapImageLesson(MED_UZATMA_ELIF_WORDS, MED_UZATMA_ELIF_AUDIO_FILES);
        case 119: return mapImageLesson(MED_UZATMA_VAV_WORDS, MED_UZATMA_VAV_AUDIO_FILES);
        case 120: return mapImageLesson(MED_UZATMA_YA_WORDS, MED_UZATMA_YA_AUDIO_FILES);
        case 121: return mapImageLesson(CEKER_WORDS, CEKER_AUDIO_FILES);
        case 122: return mapImageLesson(SEDDE_WORDS, SEDDE_AUDIO_FILES);
        case 123: return mapImageLesson(SEDDELI_OKUNUS_WORDS, SEDDELI_OKUNUS_AUDIO_FILES);
        case 124: return mapImageLesson(VAV_VE_YA_SEKLI_ELIF_WORDS, VAV_VE_YA_SEKLI_ELIF_AUDIO_FILES);
        case 125: return mapImageLesson(ZAMIR_WORDS, ZAMIR_AUDIO_FILES);
        case 126: return mapImageLesson(EL_TAKISI_WORDS, EL_TAKISI_AUDIO_FILES);
        case 127: return mapImageLesson(OKUNMAYAN_ELIF_WORDS, OKUNMAYAN_ELIF_AUDIO_FILES);
        case 128: return mapImageLesson(LAFZATULLAH_WORDS, LAFZATULLAH_AUDIO_FILES);

        default:
            return [];
    }
};

// Helper to map standard image-based word content
function mapImageLesson(words: any[], audioFiles: any): KuranLessonContent[] {
    return words.map(w => ({
        id: w.id,
        type: 'image',
        image: w.image,
        text: w.arabic || '', // Arabic text if available (usually caption)
        subText: w.reading || '', // Reading/Transliteration if available
        audio: audioFiles[w.id]
    }));
}
