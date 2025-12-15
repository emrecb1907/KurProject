import { colors } from '@/constants/colors';
import { BookOpen, BookBookmark } from 'phosphor-react-native';

export const namazKisaSureler = [
    {
        id: 207,
        title: 'İhlâs Suresi',
        description: 'İhlâs Suresi',
        level: 1,
        unlocked: true,
        color: colors.primary,
        borderColor: colors.buttonOrangeBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/207',
        content: {
            info: {
                tr: "İhlâs Suresi, Allah’ın birliğini ve eşsizliğini anlatan kısa bir suredir ve namazda sıkça okunur.",
                en: "Surah Al-Ikhlāṣ is a short chapter that affirms the oneness and uniqueness of Allah and is frequently recited in Salah."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nقُلْ هُوَ اللّٰهُ أَحَدٌ\nاللّٰهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nKul hüvallâhü ehad.\nAllâhüssamed.\nLem yelid ve lem yûled.\nVe lem yekün lehû küfüven ehad.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nQul huwa Allāhu aḥad.\nAllāhuṣ-ṣamad.\nLam yalid wa lam yūlad.\nWa lam yakun lahu kufuwan aḥad."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah’ın adıyla.\n\nDe ki: O Allah birdir.\nAllah her şeyin kendisine muhtaç olduğu varlıktır.\nO, doğurmamış ve doğurulmamıştır.\nHiçbir şey O’na denk değildir.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nSay: He is Allah, the One.\nAllah, the Eternal Refuge.\nHe neither begets nor is born.\nAnd there is none comparable to Him."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/IHLAS.m4a'),
    },
    {
        id: 208,
        title: 'Felak Suresi',
        description: 'Felak Suresi',
        level: 1,
        unlocked: true,
        color: colors.secondary,
        borderColor: colors.buttonBlueBorder,
        icon: BookBookmark,
        route: '/lessons/namazDualari/lesson/208',
        content: {
            info: {
                tr: "Felak Suresi, her türlü kötülükten Allah’a sığınmayı öğreten kısa bir suredir ve namazda okunur.",
                en: "Surah Al-Falaq teaches seeking refuge in Allah from all forms of evil and is recited in Salah."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nمِنْ شَرِّ مَا خَلَقَ\nوَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ\nوَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ\nوَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nKul e‘ûzü birabbil felak.\nMin şerri mâ halak.\nVe min şerri ğâsikın izâ vekab.\nVe min şerrin neffâsâti fil ‘ukad.\nVe min şerri hâsidin izâ hased.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nQul aʿūdhu birabbi l-falaq.\nMin sharri mā khalaq.\nWa min sharri ghāsiqin idhā waqab.\nWa min sharrin-naffāthāti fil-ʿuqad.\nWa min sharri ḥāsidin idhā ḥasad."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah’ın adıyla.\n\nDe ki: Yarattıklarının şerrinden,\nkaranlığı çöktüğünde gecenin şerrinden,\ndüğümlere üfleyenlerin şerrinden\nve haset ettiği zaman hasetçinin şerrinden,\nsabahın Rabbine sığınırım.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nSay: I seek refuge in the Lord of the daybreak\nfrom the evil of what He has created,\nfrom the evil of the darkness when it settles,\nfrom the evil of those who blow on knots,\nand from the evil of an envier when he envies."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/FELAK.m4a'),
    },
    {
        id: 209,
        title: 'Nâs Suresi',
        description: 'Nâs Suresi',
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/209',
        content: {
            info: {
                tr: "Nâs Suresi, insanı vesvese ve gizli kötülüklerden Allah'a sığınmaya yönlendiren bir suredir.",
                en: "Surah An-Nās teaches seeking refuge in Allah from hidden evil and whisperings."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ\nمَلِكِ النَّاسِ\nإِلٰهِ النَّاسِ\nمِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\nالَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\nمِنَ الْجِنَّةِ وَالنَّاسِ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nKul e'ûzü birabbin-nâs.\nMelikin-nâs.\nİlâhin-nâs.\nMin şerril vesvâsil hannâs.\nEllezî yüvesvisü fî sudûrin-nâs.\nMinel cinneti ven-nâs.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nQul aʿūdhu birabbin-nās.\nMalikin-nās.\nIlāhin-nās.\nMin sharri l-waswāsi l-khannās.\nAlladhī yuwaswisu fī ṣudūri n-nās.\nMina l-jinnati wa n-nās."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nDe ki: İnsanların Rabbine,\ninsanların hükümdarına,\ninsanların ilâhına,\nsinsice vesvese verenin şerrinden,\ninsanların gönüllerine vesvese sokanın,\ncinlerden ve insanlardan olanın şerrinden sığınırım.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nSay: I seek refuge in the Lord of mankind,\nthe King of mankind,\nthe God of mankind,\nfrom the evil of the retreating whisperer,\nwho whispers into the hearts of mankind,\nfrom among jinn and mankind."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/NAS.m4a'),
    },
    {
        id: 210,
        title: 'Kevser Suresi',
        description: 'Kevser Suresi',
        level: 1,
        unlocked: true,
        color: colors.pink,
        borderColor: colors.buttonPinkBorder,
        icon: BookBookmark,
        route: '/lessons/namazDualari/lesson/210',
        content: {
            info: {
                tr: "Kevser Suresi, Allah'ın Peygamberine verdiği nimetleri hatırlatan ve şükür bilincini vurgulayan kısa bir suredir.",
                en: "Surah Al-Kawthar highlights Allah's blessings upon the Prophet and emphasizes gratitude and devotion."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nإِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ\nفَصَلِّ لِرَبِّكَ وَانْحَرْ\nإِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nİnnâ a'tay-nâkel kevser.\nFe salli lirabbike venhar.\nİnne şâni'eke hüvel ebter.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nInnā aʿṭaynāka l-kawthar.\nFa ṣalli lirabbika wanḥar.\nInna shāniʾaka huwa l-abtar."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nŞüphesiz biz sana Kevser'i verdik.\nÖyleyse Rabbin için namaz kıl ve kurban kes.\nSana kin tutan kimse asıl soyu kesik olandır.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nIndeed, We have granted you Al-Kawthar.\nSo pray to your Lord and offer sacrifice.\nIndeed, the one who hates you is the one cut off."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/KEVSER.m4a'),
    },
    {
        id: 211,
        title: 'Kâfirûn Suresi',
        description: 'Kâfirûn Suresi',
        level: 1,
        unlocked: true,
        color: colors.warning,
        borderColor: colors.warningDark,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/211',
        content: {
            info: {
                tr: "Kâfirûn Suresi, inançta kararlılığı ve ibadetin yalnızca Allah'a yapılacağını vurgulayan bir suredir.",
                en: "Surah Al-Kāfirūn emphasizes steadfastness in faith and that worship is devoted solely to Allah."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nقُلْ يَا أَيُّهَا الْكَافِرُونَ\nلَا أَعْبُدُ مَا تَعْبُدُونَ\nوَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ\nوَلَا أَنَا عَابِدٌ مَا عَبَدْتُّمْ\nوَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ\nلَكُمْ دِينُكُمْ وَلِيَ دِينِ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nKul yâ eyyühel kâfirûn.\nLâ a'büdü mâ ta'büdûn.\nVe lâ entüm âbidûne mâ a'büd.\nVe lâ ene âbidün mâ abedtüm.\nVe lâ entüm âbidûne mâ a'büd.\nLeküm dînüküm ve liye dîn.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nQul yā ayyuhal-kāfirūn.\nLā aʿbudu mā taʿbudūn.\nWa lā antum ʿābidūna mā aʿbud.\nWa lā anā ʿābidun mā ʿabadtum.\nWa lā antum ʿābidūna mā aʿbud.\nLakum dīnukum wa liya dīn."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nDe ki: Ey kâfirler!\nBen sizin taptıklarınıza tapmam.\nSiz de benim taptığıma tapmazsınız.\nBen sizin taptıklarınıza tapacak değilim.\nSiz de benim taptığıma tapacak değilsiniz.\nSizin dininiz size, benim dinim banadır.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nSay: O disbelievers,\nI do not worship what you worship.\nNor do you worship what I worship.\nNor will I worship what you worship.\nNor will you worship what I worship.\nFor you is your religion, and for me is mine."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/KAFIRUN.m4a'),
    },
    {
        id: 212,
        title: 'Nasr Suresi',
        description: 'Nasr Suresi',
        level: 1,
        unlocked: true,
        color: colors.primaryLight,
        borderColor: colors.buttonOrangeBorder,
        icon: BookBookmark,
        route: '/lessons/namazDualari/lesson/212',
        content: {
            info: {
                tr: "Nasr Suresi, Allah'ın yardımının ve zaferinin geldiğini haber veren ve şükür bilincini öğreten bir suredir.",
                en: "Surah An-Naṣr announces Allah's help and victory and teaches gratitude and seeking forgiveness."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nإِذَا جَاءَ نَصْرُ اللّٰهِ وَالْفَتْحُ\nوَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللّٰهِ أَفْوَاجًا\nفَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ\nإِنَّهُ كَانَ تَوَّابًا",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nİzâ câe nasrullâhi vel-feth.\nVe raeyten-nâse yedhulûne fî dînillâhi efvâcâ.\nFe sebbih bihamdi rabbike vestagfirh.\nİnnehu kâne tevvâbâ.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nIdhā jāʾa naṣrullāhi wal-fatḥ.\nWa raʾayta n-nāsa yadkhulūna fī dīnillāhi afwājā.\nFa sabbiḥ biḥamdi rabbika wastaghfirh.\nInnahu kāna tawwābā."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nAllah'ın yardımı ve zaferi geldiğinde,\ninsanların bölük bölük Allah'ın dinine girdiklerini gördüğünde,\nRabbini hamd ile tesbih et ve O'ndan bağışlanma dile.\nŞüphesiz O, tövbeleri çokça kabul edendir.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nWhen the help of Allah and the victory come,\nand you see people entering the religion of Allah in crowds,\nthen glorify your Lord with praise and seek His forgiveness.\nIndeed, He is ever Accepting of repentance."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/NASR.m4a'),
    },
];
