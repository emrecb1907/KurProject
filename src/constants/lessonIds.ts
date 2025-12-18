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

// Namaz Duaları - IDs: 201-234
export const NAMAZ_TEMEL_DUALAR_IDS = ['201', '202', '203', '204', '205', '206'];
export const NAMAZ_KISA_SURELER_IDS = ['207', '208', '209', '210', '211', '212'];
export const NAMAZ_ILERI_DUZEY_IDS = ['213', '214', '215', '216', '217', '218'];
export const NAMAZ_EZBER_PEKISTIRME_IDS = ['219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234'];

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

// Siyer (Peygamberimizin Hayatı) - IDs: 601+
export const SIYER_IDS = [
    '601', '602', '603', '604', '605', '606', '607', '608', '609', '610'
];

// İman Esasları (Articles of Faith) - IDs: 701+
export const IMAN_ESASLARI_IDS = [
    '701', '702', '703', '704', '705', '706', '707'
];

// Oruç Bilgisi (Fasting Knowledge) - IDs: 801+
export const ORUC_BILGISI_IDS = [
    '801', '802', '803', '804', '805', '806', '807', '808', '809', '810', '811'
];

// Peygamberler Tarihi (History of Prophets) - IDs: 901+
export const PEYGAMBERLER_TARIHI_IDS = [
    '901', '902', '903', '904', '905', '906', '907', '908', '909', '910', '911'
];

// Ahlak & Adap Bilgisi (Morals & Manners) - IDs: 1001+
export const AHLAK_ADAP_IDS = [
    '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008'
];
