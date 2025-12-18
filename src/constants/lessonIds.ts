/**
 * Lesson IDs for progress calculation
 * Using ID lists instead of importing full data objects saves memory
 */

// Kur'an Öğrenimi (Elif-Ba) - IDs: 101-128
export const KURAN_LESSON_IDS = [
    '101', '102', '103', '104', '105', '106', '107', '108', '109', '110',
    '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
    '121', '122', '123', '124', '125', '126', '127', '128'
];

// Namaz Duaları - IDs: 201-206 (Temel), 211-218 (Kısa Sureler), 221-227 (İleri), 231-236 (Ezberleme)
export const NAMAZ_TEMEL_DUALAR_IDS = ['201', '202', '203', '204', '205', '206'];
export const NAMAZ_KISA_SURELER_IDS = ['211', '212', '213', '214', '215', '216', '217', '218'];
export const NAMAZ_ILERI_DUZEY_IDS = ['221', '222', '223', '224', '225', '226', '227'];
export const NAMAZ_EZBER_PEKISTIRME_IDS = ['231', '232', '233', '234', '235', '236'];

export const NAMAZ_DUALARI_IDS = [
    ...NAMAZ_TEMEL_DUALAR_IDS,
    ...NAMAZ_KISA_SURELER_IDS,
    ...NAMAZ_ILERI_DUZEY_IDS,
    ...NAMAZ_EZBER_PEKISTIRME_IDS
];

// Namaz Bilgisi - IDs: 301-313
export const NAMAZ_BILGISI_IDS = [
    '301', '302', '303', '304', '305', '306', '307', '308', '309', '310',
    '311', '312', '313'
];

// İslam Tarihi - IDs: 401-413
export const ISLAM_TARIHI_IDS = [
    '401', '402', '403', '404', '405', '406', '407', '408', '409', '410',
    '411', '412', '413'
];

// Abdest ve Temizlik - IDs: 501-510
export const ABDEST_VE_TEMIZLIK_IDS = [
    '501', '502', '503', '504', '505', '506', '507', '508', '509', '510'
];
