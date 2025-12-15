import { colors } from '@/constants/colors';
import { BookOpen, HandPalm } from 'phosphor-react-native';

export const namazTemelDualar = [
    {
        id: 201,
        title: 'Sübhaneke Duası',
        description: 'Sübhaneke Duası',
        level: 1,
        unlocked: true,
        color: colors.primary,
        borderColor: colors.buttonOrangeBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/201',
        content: {
            info: {
                tr: "Sübhaneke Duası, namazda iftitah tekbirinden sonra okunur.",
                en: "The Subḥānakah Supplication is recited after the opening takbīr at the beginning of Salah."
            },
            arabic: "اللّٰهُ أَكْبَرُ\n\nسُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ\nوَتَبَارَكَ اسْمُكَ\nوَتَعَالَى جَدُّكَ\nوَجَلَّ ثَنَاؤُكَ\nوَلَا إِلٰهَ غَيْرُكَ",
            transliteration: {
                tr: "Allâhü ekber.\n\nSübhâneke allâhümme ve bihamdik,\nve tebârekes-mük,\nve teâlâ ceddük,\nve celle senâük,\nve lâ ilâhe ğayrük.",
                en: "Allāhu akbar.\n\nSubḥānak Allāhumma wa biḥamdik,\nwa tabāraka-smuk,\nwa taʿālā jadduk,\nwa jalla thanāʾuk,\nwa lā ilāha ghayruk."
            },
            meaning: {
                tr: "Allah en büyüktür.\n\nAllah’ım! Seni her türlü eksiklikten tenzih ederim ve Sana hamd ederim.\nAdın yücedir, şanın uludur, övgün pek yücedir.\nSenden başka ilâh yoktur.",
                en: "Allah is the Greatest.\n\nO Allah, You are free from all imperfections, and all praise belongs to You.\nBlessed is Your Name, exalted is Your Majesty, and Your praise is most sublime.\nThere is no deity worthy of worship except You."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/SUBHANEKE.m4a'),
    },
    {
        id: 202,
        title: 'Fâtiha Suresi',
        description: 'Fâtiha Suresi',
        level: 1,
        unlocked: true,
        color: colors.secondary,
        borderColor: colors.buttonBlueBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/202',
        content: {
            info: {
                tr: "Fâtiha Suresi, namazın her rekâtında okunması farz olan suredir.",
                en: "Surah Al-Fātiḥah is an essential part of Salah and must be recited in every rakʿah."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nالرَّحْمٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ\nغَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nElhamdü lillâhi rabbil âlemîn.\nErrahmânirrahîm.\nMâliki yevmiddîn.\nİyyâke na‘büdü ve iyyâke neste‘în.\nİhdinessırâtal müstakîm.\nSırâtallezîne en‘amte aleyhim.\nĞayril mağdûbi aleyhim ve leddâllîn.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nAl-ḥamdu lillāhi rabbil-ʿālamīn.\nAr-Raḥmānir-Raḥīm.\nMāliki yawmi d-dīn.\nIyyāka naʿbudu wa iyyāka nastaʿīn.\nIhdinā ṣ-ṣirāṭal-mustaqīm.\nṢirāṭal-ladhīna anʿamta ʿalayhim.\nGhayril-maghḍūbi ʿalayhim wa laḍ-ḍāllīn."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah’ın adıyla.\n\nHamd, âlemlerin Rabbi olan Allah’a aittir.\nO, Rahmân’dır ve Rahîm’dir.\nHesap gününün sahibidir.\nYalnız Sana kulluk eder, yalnız Senden yardım dileriz.\nBizi dosdoğru yola ilet.\nNimet verdiklerinin yoluna;\ngazaba uğrayanların ve sapmışların yoluna değil.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nAll praise belongs to Allah, the Lord of all worlds.\nThe Most Gracious, the Most Merciful.\nMaster of the Day of Judgment.\nYou alone we worship, and You alone we ask for help.\nGuide us to the straight path.\nThe path of those You have favored;\nnot of those who incurred Your wrath, nor of those who went astray."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/FATIHA.m4a'),
    },
    {
        id: 203,
        title: 'Ettehiyyatü Duası',
        description: 'Ettehiyyatü Duası',
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/203',
        content: {
            info: {
                tr: "Ettehiyyatü Duası, namazda oturuşta (ka‘de) okunan temel ibadet metnidir.",
                en: "The At-Tahiyyāt Supplication is recited while sitting during Salah."
            },
            arabic: "التَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللّٰهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ\nوَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
            transliteration: {
                tr: "Ettehiyyâtü lillâhi vessalavâtü vettayyibât.\nEsselâmü aleyke eyyühennebiyyü ve rahmetullâhi ve berekâtüh.\nEsselâmü aleynâ ve alâ ibâdillâhissâlihîn.\nEşhedü en lâ ilâhe illallâh.\nVe eşhedü enne Muhammeden abdühû ve resûlüh.",
                en: "At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt.\nAs-salāmu ʿalayka ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh.\nAs-salāmu ʿalaynā wa ʿalā ʿibādillāhiṣ-ṣāliḥīn.\nAshhadu an lā ilāha illallāh.\nWa ashhadu anna Muḥammadan ʿabduhū wa rasūluh."
            },
            meaning: {
                tr: "Bütün selamlar, dualar ve güzel sözler Allah’a aittir.\nEy Peygamber! Allah’ın selamı, rahmeti ve bereketi senin üzerine olsun.\nSelam bize ve Allah’ın salih kullarının üzerine olsun.\nŞahitlik ederim ki Allah’tan başka ilâh yoktur.\nYine şahitlik ederim ki Muhammed, O’nun kulu ve elçisidir.",
                en: "All greetings, prayers, and good words belong to Allah.\nPeace be upon you, O Prophet, and the mercy of Allah and His blessings.\nPeace be upon us and upon the righteous servants of Allah.\nI bear witness that there is no deity worthy of worship except Allah.\nAnd I bear witness that Muhammad is His servant and His Messenger."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/ETTEHIYYATU.m4a'),
    },
    {
        id: 204,
        title: 'Allahümme Salli Duası',
        description: 'Allahümme Salli Duası',
        level: 1,
        unlocked: true,
        color: colors.pink,
        borderColor: colors.buttonPinkBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/204',
        content: {
            info: {
                tr: "Allahümme Salli Duası, namazda oturuşta Ettehiyyatü’den sonra okunan salavat duasıdır.",
                en: "The Allāhumma Ṣalli Supplication is a salutation recited while sitting in Salah after At-Tahiyyāt."
            },
            arabic: "اللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ\nوَعَلٰى اٰلِ مُحَمَّدٍ\nكَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيمَ\nوَعَلٰى اٰلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ",
            transliteration: {
                tr: "Allâhümme salli alâ Muhammedin\nve alâ âli Muhammed.\nKemâ salleyte alâ İbrâhîme\nve alâ âli İbrâhîm.\nİnneke hamîdün mecîd.",
                en: "Allāhumma ṣalli ʿalā Muḥammadin\nwa ʿalā āli Muḥammad.\nKamā ṣallayta ʿalā Ibrāhīma\nwa ʿalā āli Ibrāhīm.\nInnaka ḥamīdun majīd."
            },
            meaning: {
                tr: "Allah’ım! Muhammed’e ve Muhammed’in ailesine rahmet eyle.\nİbrahim’e ve İbrahim’in ailesine rahmet ettiğin gibi.\nŞüphesiz Sen övülmeye layık ve yücesin.",
                en: "O Allah, send blessings upon Muhammad and upon the family of Muhammad,\nas You sent blessings upon Abraham and the family of Abraham.\nIndeed, You are Praiseworthy and Most Glorious."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/ALLAHUMME_SALLI.m4a'),
    },
    {
        id: 205,
        title: 'Allahümme Barik Duası',
        description: 'Allahümme Barik Duası',
        level: 1,
        unlocked: true,
        color: colors.warning,
        borderColor: colors.warningDark,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/205',
        content: {
            info: {
                tr: "Allahümme Barik Duası, namazda oturuşta Allahümme Salli’den sonra okunan bereket duasıdır.",
                en: "The Allāhumma Bārik Supplication is a prayer for blessings recited after Allāhumma Ṣalli while sitting in Salah."
            },
            arabic: "اللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ\nوَعَلٰى اٰلِ مُحَمَّدٍ\nكَمَا بَارَكْتَ عَلٰى إِبْرَاهِيمَ\nوَعَلٰى اٰلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ",
            transliteration: {
                tr: "Allâhümme bârik alâ Muhammedin\nve alâ âli Muhammed.\nKemâ bârekte alâ İbrâhîme\nve alâ âli İbrâhîm.\nİnneke hamîdün mecîd.",
                en: "Allāhumma bārik ʿalā Muḥammadin\nwa ʿalā āli Muḥammad.\nKamā bārakta ʿalā Ibrāhīma\nwa ʿalā āli Ibrāhīm.\nInnaka ḥamīdun majīd."
            },
            meaning: {
                tr: "Allah’ım! Muhammed’e ve Muhammed’in ailesine bereket ver.\nİbrahim’e ve İbrahim’in ailesine bereket verdiğin gibi.\nŞüphesiz Sen övülmeye layık ve yücesin.",
                en: "O Allah, grant blessings upon Muhammad and upon the family of Muhammad,\nas You granted blessings upon Abraham and the family of Abraham.\nIndeed, You are Praiseworthy and Most Glorious."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/ALLAHUMME_BARIK.m4a'),
    },
    {
        id: 206,
        title: 'Rabbena Atina Duası',
        description: 'Rabbena Atina Duası',
        level: 1,
        unlocked: true,
        color: colors.primaryLight,
        borderColor: colors.buttonOrangeBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/206',
        content: {
            info: {
                tr: "Rabbena Atina Duası, namazın sonunda okunan ve dünya ile ahiret için hayır istenen bir duadır.",
                en: "The Rabbana Ātinā Supplication is recited at the end of Salah, asking for goodness in this life and the Hereafter."
            },
            arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً\nوَفِي الْآخِرَةِ حَسَنَةً\nوَقِنَا عَذَابَ النَّارِ",
            transliteration: {
                tr: "Rabbena âtinâ fid-dünyâ haseneten,\nve fil âhireti haseneten,\nve kinâ azâben-nâr.",
                en: "Rabbana ātinā fid-dunyā ḥasanah,\nwa fil-ākhirati ḥasanah,\nwa qinā ʿadhāban-nār."
            },
            meaning: {
                tr: "Rabbimiz! Bize dünyada iyilik ver,\nahirette de iyilik ver\nve bizi ateş azabından koru.",
                en: "Our Lord, grant us goodness in this world\nand goodness in the Hereafter,\nand protect us from the punishment of the Fire."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/RABBENA_ATINA.m4a'),
    },
];
