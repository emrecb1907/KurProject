import { LessonContent } from './types';

const lessonsMap: Record<string, { tr: LessonContent; en: LessonContent }> = {
    '401': {
        tr: require('../../../assets/lessons/islam-tarihi/cahiliye-donemi/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/cahiliye-donemi/en.json'),
    },
    '402': {
        tr: require('../../../assets/lessons/islam-tarihi/peygamberlik-oncesi/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/peygamberlik-oncesi/en.json'),
    },
    '403': {
        tr: require('../../../assets/lessons/islam-tarihi/peygamberlik-donemi/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/peygamberlik-donemi/en.json'),
    },
    '404': {
        tr: require('../../../assets/lessons/islam-tarihi/hulefa-i-rasidin/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/hulefa-i-rasidin/en.json'),
    },
    '405': {
        tr: require('../../../assets/lessons/islam-tarihi/emeviler/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/emeviler/en.json'),
    },
    '406': {
        tr: require('../../../assets/lessons/islam-tarihi/abbasiler/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/abbasiler/en.json'),
    },
    '407': {
        tr: require('../../../assets/lessons/islam-tarihi/endulus/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/endulus/en.json'),
    },
    '408': {
        tr: require('../../../assets/lessons/islam-tarihi/bolgesel-devletler/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/bolgesel-devletler/en.json'),
    },
    '409': {
        tr: require('../../../assets/lessons/islam-tarihi/hacli-seferleri/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/hacli-seferleri/en.json'),
    },
    '410': {
        tr: require('../../../assets/lessons/islam-tarihi/mogol-istilalari/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/mogol-istilalari/en.json'),
    },
    '411': {
        tr: require('../../../assets/lessons/islam-tarihi/gec-donem/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/gec-donem/en.json'),
    },
    '412': {
        tr: require('../../../assets/lessons/islam-tarihi/modern-cag/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/modern-cag/en.json'),
    },
    '413': {
        tr: require('../../../assets/lessons/islam-tarihi/islam-medeniyeti/tr.json'),
        en: require('../../../assets/lessons/islam-tarihi/islam-medeniyeti/en.json'),
    },
};

export const getLessonContent = (id: string, language: string = 'tr'): LessonContent | null => {
    const lesson = lessonsMap[id];
    if (!lesson) return null;

    // Normalize language code (e.g., 'tr-TR' -> 'tr')
    const langCode = language.split('-')[0].toLowerCase() === 'en' ? 'en' : 'tr';

    return lesson[langCode];
};
