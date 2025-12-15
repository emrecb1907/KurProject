import { colors } from '@/constants/colors';
import { BookOpen } from 'phosphor-react-native';

export const namazEzberPekistirme = [
    {
        id: 219,
        title: 'Mâûn Suresi',
        description: 'Mâûn Suresi',
        level: 1,
        unlocked: true,
        color: colors.primary,
        borderColor: colors.buttonOrangeBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/219',
        content: {
            info: {
                tr: "Mâûn Suresi, ibadetin samimiyetini ve sosyal sorumluluğu hatırlatan kısa bir suredir.",
                en: "Surah Al-Māʿūn emphasizes sincerity in worship and responsibility toward others."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nأَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ\nفَذٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ\nوَلَا يَحُضُّ عَلٰى طَعَامِ الْمِسْكِينِ\nفَوَيْلٌ لِلْمُصَلِّينَ\nالَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ\nالَّذِينَ هُمْ يُرَاءُونَ\nوَيَمْنَعُونَ الْمَاعُونَ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nEraeytellezî yükezzibu biddîn.\nFezâlikellezî yedü‘‘ul yetîm.\nVe lâ yehuddu alâ ta‘âmi’l miskîn.\nFeveylün lil-musallîn.\nEllezîne hüm an salâtihim sâhûn.\nEllezîne hüm yürâûn.\nVe yemne‘ûnel mâ‘ûn.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nAraʾayta alladhī yukadhdhibu bid-dīn.\nFa dhālika alladhī yadʿuʿu l-yatīm.\nWa lā yaḥuḍḍu ʿalā ṭaʿāmi l-miskīn.\nFa waylun lil-muṣallīn.\nAlladhīna hum ʿan ṣalātihim sāhūn.\nAlladhīna hum yurāʾūn.\nWa yamnaʿūna l-māʿūn."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nDini yalanlayanı gördün mü?\nİşte o, yetimi itip kakar.\nYoksulu doyurmaya teşvik etmez.\nYazıklar olsun o namaz kılanlara ki,\nnamazlarını ciddiye almazlar.\nOnlar gösteriş yaparlar\nve en küçük yardımı bile esirgerler.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nHave you seen the one who denies the religion?\nThat is the one who repels the orphan\nand does not encourage feeding the poor.\nSo woe to those who pray\nbut are heedless of their prayer—\nthose who make a show of it\nand withhold even small acts of kindness."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/MAUN.m4a'),
    },
    {
        id: 220,
        title: 'Kureyş Suresi',
        description: 'Kureyş Suresi',
        level: 1,
        unlocked: true,
        color: colors.secondary,
        borderColor: colors.buttonBlueBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/220',
        content: {
            info: {
                tr: "Kureyş Suresi, Allah'ın Kureyş kabilesine verdiği nimetleri hatırlatır ve yalnızca O'na kulluk edilmesi gerektiğini vurgular.",
                en: "Surah Quraysh reminds of Allah's favors upon the Quraysh tribe and emphasizes worshipping Allah alone."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nلِإِيلَافِ قُرَيْشٍ\nإِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ\nفَلْيَعْبُدُوا رَبَّ هٰذَا الْبَيْتِ\nالَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ\nوَآمَنَهُمْ مِنْ خَوْفٍ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nLi îlâfi Kureyş.\nÎlâfihim rihlete'ş-şitâi ve's-sayf.\nFelya'budû rabbe hâzel beyt.\nEllezî et'amehüm min cû'.\nVe âmenehüm min havf.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nLi-īlāfi Quraysh.\nĪlāfihim riḥlata sh-shitāʾi waṣ-ṣayf.\nFalyaʿbudū rabba hādhā l-bayt.\nAlladhī aṭʿamahum min jūʿ.\nWa āmanahum min khawf."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nKureyş'in emniyet içinde yaşaması,\nkış ve yaz yolculuklarına alışmaları sebebiyle,\nbu evin Rabbine kulluk etsinler.\nO Rab ki, onları açlıktan doyurmuş\nve korkudan emin kılmıştır.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nFor the security of Quraysh,\ntheir security during the winter and summer journeys,\nlet them worship the Lord of this House.\nHe is the One who fed them against hunger\nand secured them from fear."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/KUREYS.m4a'),
    },
    {
        id: 221,
        title: 'Fil Suresi',
        description: 'Fil Suresi',
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/221',
        content: {
            info: {
                tr: "Fil Suresi, Allah'ın Kâbe'yi koruduğunu ve O'nun kudretinin her şeyin üzerinde olduğunu anlatan bir suredir.",
                en: "Surah Al-Fīl recounts how Allah protected the Kaaba and demonstrates His supreme power."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nأَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ\nأَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ\nوَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ\nتَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ\nفَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nElem tera keyfe fe'ale rabbüke bi ashâbil fîl.\nElem yec'al keydehüm fî tadlîl.\nVe ersele aleyhim tayran ebâbîl.\nTermîhim bihicâratin min siccîl.\nFece'alehüm ke'asfin me'kûl.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nAlam tara kayfa faʿala rabbuka bi-aṣḥābi l-fīl.\nAlam yajʿal kaydahum fī taḍlīl.\nWa arsalā ʿalayhim ṭayran abābīl.\nTarmīhim biḥijāratin min sijjīl.\nFajaʿalahum kaʿaṣfin maʾkūl."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nRabbinin fil sahiplerine ne yaptığını görmedin mi?\nOnların planlarını boşa çıkarmadı mı?\nÜzerlerine sürü sürü kuşlar gönderdi.\nOnlara pişmiş çamurdan taşlar attılar.\nBöylece onları yenmiş ekin yaprağı gibi yaptı.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nHave you not seen how your Lord dealt with the companions of the elephant?\nDid He not make their plot go astray?\nAnd He sent against them flocks of birds,\nstriking them with stones of baked clay.\nThus He made them like chewed straw."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/FIL.m4a'),
    },
    {
        id: 222,
        title: 'Tebbet (Mesed) Suresi',
        description: 'Tebbet (Mesed) Suresi',
        level: 1,
        unlocked: true,
        color: colors.pink,
        borderColor: colors.buttonPinkBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/222',
        content: {
            info: {
                tr: "Tebbet Suresi, Allah'a ve Peygamberine karşı çıkanların akıbetini haber veren kısa bir suredir.",
                en: "Surah Al-Masad describes the fate of those who oppose Allah and His Messenger."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nتَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ\nمَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ\nسَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ\nوَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ\nفِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nTebbet yedâ ebî lehebin ve tebb.\nMâ ağnâ anhu mâlühû ve mâ keseb.\nSe yaslâ nâran zâte leheb.\nVemraetühû hammâletel hatab.\nFî cîdihâ hablün min mesed.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nTabbat yadā Abī Lahabin wa tabb.\nMā aghnā ʿanhu māluhu wa mā kasab.\nSayaslā nāran dhāta lahab.\nWamraʾatuhu ḥammālata l-ḥaṭab.\nFī jīdihā ḥablun min masad."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nEbû Leheb'in elleri kurusun; zaten kurudu.\nMalı ve kazandıkları ona fayda vermedi.\nO, alevli bir ateşe girecektir.\nKarısı da odun taşıyıcı olarak,\nboynunda bükülmüş bir ip olduğu hâlde.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nMay the hands of Abū Lahab be ruined—and ruined he is.\nHis wealth and what he earned did not benefit him.\nHe will enter a blazing Fire,\nand so will his wife, the carrier of firewood,\naround her neck a rope of twisted fiber."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/TEBBET.m4a'),
    },
    {
        id: 223,
        title: 'Hümeze Suresi',
        description: 'Hümeze Suresi',
        level: 1,
        unlocked: true,
        color: colors.warning,
        borderColor: colors.warningDark,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/223',
        content: {
            info: {
                tr: "Hümeze Suresi, insanları küçümseyen, mal biriktirip onunla övünen kimseleri uyaran kısa bir suredir.",
                en: "Surah Al-Humazah warns against arrogance, mockery, and those who hoard wealth and boast about it."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nوَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ\nالَّذِي جَمَعَ مَالًا وَعَدَّدَهُ\nيَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ\nكَلَّا لَيُنْبَذَنَّ فِي الْحُطَمَةِ\nوَمَا أَدْرَاكَ مَا الْحُطَمَةُ\nنَارُ اللّٰهِ الْمُوقَدَةُ\nالَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ\nإِنَّهَا عَلَيْهِمْ مُؤْصَدَةٌ\nفِي عَمَدٍ مُمَدَّدَةٍ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nVeylün likülli hümezetin lümeze.\nEllezî cema'a mâlen ve addedeh.\nYahsebü enne mâlehû ahledeh.\nKellâ leyünbezenne fil hutame.\nVe mâ edrâke mel hutame.\nNârullâhil mûkade.\nElletî tattali'u alel ef'ide.\nİnnehâ aleyhim mû'sade.\nFî amedin mümaddede.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nWaylun likulli humazatin lumazah.\nAlladhī jamaʿa mālan wa ʿaddadah.\nYaḥsabu anna mālahū akhladah.\nKallā layunbadhanna fil-ḥuṭamah.\nWa mā adrāka mā l-ḥuṭamah.\nNāru llāhi l-mūqadah.\nAllatī taṭṭaliʿu ʿalal-afʾidah.\nInnahā ʿalayhim muʾṣadah.\nFī ʿamadin mumaddadah."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nYazıklar olsun her ayıplayıp çekiştiren kimseye!\nMal biriktiren ve onu durmadan sayana.\nMalının kendisini ebedî kılacağını sanır.\nHayır! O, mutlaka Hutame'ye atılacaktır.\nHutame'nin ne olduğunu sen nereden bileceksin?\nO, Allah'ın tutuşturulmuş ateşidir.\nKalplerin üzerine kadar tırmanır.\nO ateş onların üzerine kapatılacaktır,\nuzatılmış direkler arasında.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nWoe to every backbiter and slanderer,\nwho collects wealth and counts it repeatedly,\nthinking that his wealth will make him immortal.\nNo! He will surely be thrown into the Crusher.\nAnd what can make you know what the Crusher is?\nIt is the kindled Fire of Allah,\nwhich rises over the hearts.\nIndeed, it will be closed over them\nin extended columns."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/HUMEZE.m4a'),
    },
    {
        id: 224,
        title: 'Tekâsür Suresi',
        description: 'Tekâsür Suresi',
        level: 1,
        unlocked: true,
        color: colors.primaryLight,
        borderColor: colors.buttonOrangeBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/224',
        content: {
            info: {
                tr: "Tekâsür Suresi, dünya malı ve çokluk yarışıyla oyalanmanın insanı asıl sorumluluklardan uzaklaştırdığını hatırlatır.",
                en: "Surah At-Takāthur warns against being distracted by rivalry in worldly accumulation and reminds of accountability."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nأَلْهَاكُمُ التَّكَاثُرُ\nحَتَّىٰ زُرْتُمُ الْمَقَابِرَ\nكَلَّا سَوْفَ تَعْلَمُونَ\nثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ\nكَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ\nلَتَرَوُنَّ الْجَحِيمَ\nثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ\nثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nElhâkümü't-tekâsür.\nHattâ zürtümül mekâbir.\nKellâ sevfe ta'lemûn.\nSümme kellâ sevfe ta'lemûn.\nKellâ lev ta'lemûne ilmel yakîn.\nLe teravünnel cehîm.\nSümme le teravünnehâ aynel yakîn.\nSümme le tü'selünne yevmeizin anin na'îm.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nAlhākumu t-takāthur.\nḤattā zurtumu l-maqābir.\nKallā sawfa taʿlamūn.\nThumma kallā sawfa taʿlamūn.\nKallā law taʿlamūna ʿilma l-yaqīn.\nLa tarawunna l-jaḥīm.\nThumma la tarawunnahā ʿayna l-yaqīn.\nThumma la tusʾalunna yawmaʾidhin ʿani n-naʿīm."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nÇokluk yarışı sizi oyaladı.\nTa ki kabirleri ziyaret edinceye kadar.\nHayır! Yakında bileceksiniz.\nYine hayır! Yakında bileceksiniz.\nEğer kesin bir bilgiyle bilseydiniz,\ncehennemi mutlaka görürdünüz.\nSonra onu gözle görür gibi göreceksiniz.\nSonra o gün, size verilen nimetlerden mutlaka hesaba çekileceksiniz.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nCompetition for increase distracts you,\nuntil you visit the graves.\nNo! You will soon know.\nAgain, no! You will soon know.\nIf only you knew with certainty,\nyou would surely see the Hellfire.\nThen you will surely see it with the eye of certainty.\nThen, on that Day, you will surely be questioned about the blessings."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/TEKASUR.m4a'),
    },
    {
        id: 225,
        title: 'Kâria Suresi',
        description: 'Kâria Suresi',
        level: 1,
        unlocked: true,
        color: colors.primary,
        borderColor: colors.buttonOrangeBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/225',
        content: {
            info: {
                tr: "Kâria Suresi, kıyamet gününün dehşetini ve amellerin tartılmasını hatırlatan bir suredir.",
                en: "Surah Al-Qāriʿah describes the severity of the Day of Judgment and the weighing of deeds."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nالْقَارِعَةُ\nمَا الْقَارِعَةُ\nوَمَا أَدْرَاكَ مَا الْقَارِعَةُ\nيَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ\nوَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنْفُوشِ\nفَأَمَّا مَنْ ثَقُلَتْ مَوَازِينُهُ\nفَهُوَ فِي عِيشَةٍ رَاضِيَةٍ\nوَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ\nفَأُمُّهُ هَاوِيَةٌ\nوَمَا أَدْرَاكَ مَا هِيَهْ\nنَارٌ حَامِيَةٌ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nEl-kâriah.\nMel-kâriah.\nVe mâ edrâke mel-kâriah.\nYevme yekûnun nâsü kelferâşil mebsûs.\nVe tekûnul cibâlü kel-ihnil menfûş.\nFe emmâ men sekulat mevâzînüh.\nFe hüve fî ‘îşetin râdıyeh.\nVe emmâ men haffet mevâzînüh.\nFe ümmühû hâviyeh.\nVe mâ edrâke mâ hiyeh.\nNârun hâmiyeh.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nAl-Qāriʿah.\nMā l-Qāriʿah.\nWa mā adrāka mā l-Qāriʿah.\nYawma yakūnu n-nāsu kal-farāshi l-mabthūth.\nWa takūnu l-jibālu kal-ʿihni l-manfūsh.\nFa-ammā man thaqulat mawāzīnuh.\nFahuwa fī ʿīshatin rāḍiyah.\nWa ammā man khaffat mawāzīnuh.\nFa-ummuhū hāwiyah.\nWa mā adrāka mā hiyah.\nNārun ḥāmiyah."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nÇarpan felaket!\nNedir o çarpan felaket?\nO çarpan felaketin ne olduğunu sen nereden bileceksin?\nO gün insanlar, etrafa saçılmış pervaneler gibi olacaktır.\nDağlar ise atılmış renkli yün gibi olacaktır.\nO gün kimin tartıları ağır gelirse,\no hoşnut bir hayat içinde olacaktır.\nAma kimin tartıları hafif gelirse,\nonun varacağı yer Hâviye'dir.\nHâviye'nin ne olduğunu sen nereden bileceksin?\nO, kızgın bir ateştir.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nThe Striking Calamity!\nWhat is the Striking Calamity?\nAnd what can make you know what the Striking Calamity is?\nOn that Day, people will be like scattered moths,\nand the mountains will be like fluffed wool.\nThen as for one whose scales are heavy,\nhe will be in a life of contentment.\nBut as for one whose scales are light,\nhis refuge will be the Abyss.\nAnd what can make you know what that is?\nIt is a blazing Fire."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/KARIA.m4a'),
    },
    {
        id: 226,
        title: 'Asr Suresi',
        description: 'Asr Suresi',
        level: 1,
        unlocked: true,
        color: colors.secondary,
        borderColor: colors.buttonBlueBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/226',
        content: {
            info: {
                tr: "Asr Suresi, insanın hüsranda olduğunu; kurtuluşun iman, salih amel, hakkı ve sabrı tavsiye etmekle mümkün olduğunu bildirir.",
                en: "Surah Al-ʿAṣr declares that humanity is in loss, except those who believe, do righteous deeds, and encourage truth and patience."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nوَالْعَصْرِ\nإِنَّ الْإِنْسَانَ لَفِي خُسْرٍ\nإِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ\nوَتَوَاصَوْا بِالْحَقِّ\nوَتَوَاصَوْا بِالصَّبْرِ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nVel asr.\nİnnel insâne lefî husr.\nİllellezîne âmenû ve amilûs sâlihât.\nVe tevâsav bil hakk.\nVe tevâsav bis sabr.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nWal-ʿaṣr.\nInnal-insāna lafī khusr.\nIllā alladhīna āmanū wa ʿamilū ṣ-ṣāliḥāt.\nWa tawāṣaw bil-ḥaqq.\nWa tawāṣaw biṣ-ṣabr."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nAsra yemin olsun ki,\ninsan gerçekten ziyan içindedir.\nAncak iman edenler, salih amel işleyenler,\nbirbirlerine hakkı ve sabrı tavsiye edenler müstesna.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nBy time,\nindeed, mankind is in loss,\nexcept for those who believe, do righteous deeds,\nand encourage one another to truth and to patience."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/ASIR.m4a'),
    },
    {
        id: 227,
        title: 'Tîn Suresi',
        description: 'Tîn Suresi',
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/227',
        content: {
            info: {
                tr: "Tîn Suresi, insanın en güzel şekilde yaratıldığını ve iman ile salih amelin değerini vurgular.",
                en: "Surah At-Tīn emphasizes that humans are created in the best form and highlights the value of faith and righteous deeds."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nوَالتِّينِ وَالزَّيْتُونِ\nوَطُورِ سِينِينَ\nوَهٰذَا الْبَلَدِ الْأَمِينِ\nلَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ\nثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ\nإِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ\nفَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ\nفَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ\nأَلَيْسَ اللّٰهُ بِأَحْكَمِ الْحَاكِمِينَ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nVet-tîni vez-zeytûn.\nVe tûri sînîn.\nVe hâzel beledil emîn.\nLekad halaknâl insâne fî ahseni takvîm.\nSümme radednâhü esfele sâfilîn.\nİllellezîne âmenû ve amilûs sâlihât.\nFe lehüm ecrun ğayru memnûn.\nFe mâ yükezzibüke ba‘dü biddîn.\nE leyse’llâhü bi-ahkemil hâkimîn.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nWa t-tīni wa z-zaytūn.\nWa ṭūri sīnīn.\nWa hādhā l-baladi l-amīn.\nLaqad khalaqnā l-insāna fī aḥsani taqwīm.\nThumma radadnāhu asfala sāfilīn.\nIllā alladhīna āmanū wa ʿamilū ṣ-ṣāliḥāt.\nFalahum ajrun ghayru mamnūn.\nFa mā yukadhdhibuka baʿdu bid-dīn.\nA-laysa llāhu bi-aḥkami l-ḥākimīn."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nİncire ve zeytine andolsun,\nSînâ Dağı'na\nve bu güvenli şehre.\nBiz insanı en güzel biçimde yarattık.\nSonra onu aşağıların aşağısına çevirdik.\nAncak iman edip salih amel işleyenler müstesna;\nonlar için kesintisiz bir mükâfat vardır.\nO hâlde dinden sonra seni yalanlamaya ne sevk eder?\nAllah hüküm verenlerin en adili değil midir?",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nBy the fig and the olive,\nand by Mount Sinai,\nand by this secure city.\nWe have certainly created man in the best form.\nThen We return him to the lowest of the low,\nexcept those who believe and do righteous deeds—\nfor them is an unfailing reward.\nSo what makes you deny the Judgment after this?\nIs not Allah the most just of judges?"
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/TIN.m4a'),
    },
    {
        id: 228,
        title: 'Duhâ Suresi',
        description: 'Duhâ Suresi',
        level: 1,
        unlocked: true,
        color: colors.pink,
        borderColor: colors.buttonPinkBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/228',
        content: {
            info: {
                tr: "Duhâ Suresi, Allah'ın Peygamberini teselli ettiğini ve O'nun rahmetinin kesintisiz olduğunu bildiren bir suredir.",
                en: "Surah Aḍ-Ḍuḥā reassures the Prophet of Allah's constant care and enduring mercy."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nوَالضُّحَىٰ\nوَاللَّيْلِ إِذَا سَجَىٰ\nمَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ\nوَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ\nوَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ\nأَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ\nوَوَجَدَكَ ضَالًّا فَهَدَىٰ\nوَوَجَدَكَ عَائِلًا فَأَغْنَىٰ\nفَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ\nوَأَمَّا السَّائِلَ فَلَا تَنْهَرْ\nوَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nVed-duhâ.\nVel-leyli izâ secâ.\nMâ vedde‘ake rabbüke ve mâ kalâ.\nVe lel âhiretü hayrün leke minel ûlâ.\nVe lesevfe yu‘tîke rabbüke fe terdâ.\nElem yecidke yetîmen fe âvâ.\nVe vecedeke dâllen fe hedâ.\nVe vecedeke âilen fe ağnâ.\nFe emmâl yetîme fe lâ takher.\nVe emmâs sâile fe lâ tenher.\nVe emmâ bini‘meti rabbike fe haddis.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nWa ḍ-ḍuḥā.\nWa l-layli idhā sajā.\nMā waddaʿaka rabbuka wa mā qalā.\nWa lal-ākhiratu khayrun laka mina l-ūlā.\nWa la-sawfa yuʿṭīka rabbuka fa tarḍā.\nAlam yajidka yatīman fa āwā.\nWa wajadaka ḍāllan fa hadā.\nWa wajadaka ʿāʾilan fa aghnā.\nFa ammā l-yatīma fa lā taqhar.\nWa ammā s-sāʾila fa lā tanhar.\nWa ammā biniʿmati rabbika fa ḥaddith."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nKuşluk vaktine andolsun,\nkaranlığı çöktüğünde geceye andolsun ki,\nRabbin seni terk etmedi ve sana darılmadı.\nŞüphesiz ahiret senin için dünyadan daha hayırlıdır.\nRabbin sana verecek ve sen razı olacaksın.\nO seni yetim bulup barındırmadı mı?\nSeni yolunu ararken bulup doğru yola iletmedi mi?\nSeni ihtiyaç içinde bulup zenginleştirmedi mi?\nÖyleyse yetimi incitme,\nisteyeni azarlama\nve Rabbinin nimetini anlat.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nBy the morning brightness,\nand by the night when it grows still,\nyour Lord has neither forsaken you nor hated you.\nAnd the Hereafter will be better for you than the present life.\nYour Lord will soon give you, and you will be satisfied.\nDid He not find you an orphan and give you shelter?\nDid He not find you searching and guide you?\nDid He not find you in need and enrich you?\nSo do not oppress the orphan,\ndo not repel the one who asks,\nand proclaim the favor of your Lord."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/DUHA.m4a'),
    },
    {
        id: 229,
        title: 'İnşirâh (Şerh) Suresi',
        description: 'İnşirâh (Şerh) Suresi',
        level: 1,
        unlocked: true,
        color: colors.warning,
        borderColor: colors.warningDark,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/229',
        content: {
            info: {
                tr: "İnşirâh Suresi, zorluklarla birlikte kolaylığın da var olduğunu hatırlatan ve gönül ferahlığı veren bir suredir.",
                en: "Surah Ash-Sharḥ reminds that ease accompanies hardship and brings reassurance to the heart."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nأَلَمْ نَشْرَحْ لَكَ صَدْرَكَ\nوَوَضَعْنَا عَنْكَ وِزْرَكَ\nالَّذِي أَنْقَضَ ظَهْرَكَ\nوَرَفَعْنَا لَكَ ذِكْرَكَ\nفَإِنَّ مَعَ الْعُسْرِ يُسْرًا\nإِنَّ مَعَ الْعُسْرِ يُسْرًا\nفَإِذَا فَرَغْتَ فَانْصَبْ\nوَإِلَىٰ رَبِّكَ فَارْغَبْ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nElem neşrah leke sadrak.\nVe vada‘nâ anke vizrak.\nEllezî enkada zahrak.\nVe refa‘nâ leke zikrak.\nFe inne me‘al ‘usrî yusrâ.\nİnne me‘al ‘usrî yusrâ.\nFe izâ ferağte fensab.\nVe ilâ rabbike ferğab.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nAlam nashraḥ laka ṣadrak.\nWa waḍaʿnā ʿanka wizrak.\nAlladhī anqaḍa ẓahrak.\nWa rafaʿnā laka dhikrak.\nFa inna maʿa l-ʿusri yusrā.\nInna maʿa l-ʿusri yusrā.\nFa idhā faraghta fanṣab.\nWa ilā rabbika farghab."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nBiz senin göğsünü açıp genişletmedik mi?\nYükünü senden kaldırmadık mı?\nO yük ki belini bükmüştü.\nSenin şanını yüceltmedik mi?\nŞüphesiz zorlukla beraber bir kolaylık vardır.\nGerçekten, zorlukla beraber bir kolaylık vardır.\nÖyleyse bir işi bitirdiğinde hemen diğerine koyul\nve yalnız Rabbine yönel.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nDid We not expand your chest for you?\nAnd remove from you your burden\nthat weighed heavily upon your back?\nAnd raise high for you your mention?\nIndeed, with hardship comes ease.\nIndeed, with hardship comes ease.\nSo when you have finished, devote yourself,\nand turn to your Lord alone."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/INSIRAH.m4a'),
    },
    {
        id: 230,
        title: 'Zilzâl Suresi',
        description: 'Zilzâl Suresi',
        level: 1,
        unlocked: true,
        color: colors.primaryLight,
        borderColor: colors.buttonOrangeBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/230',
        content: {
            info: {
                tr: "Zilzâl Suresi, kıyamet günü yerin sarsılışını ve yapılan her şeyin karşılığının görüleceğini bildirir.",
                en: "Surah Az-Zalzalah describes the earthquake of the Day of Judgment and the weighing of deeds."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nإِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا\nوَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا\nوَقَالَ الْإِنْسَانُ مَا لَهَا\nيَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا\nبِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا\nيَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا\nلِيُرَوْا أَعْمَالَهُمْ\nفَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ\nوَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nİzâ zülziletil ardu zilzâlehâ.\nVe ahracetil ardu ethkâlehâ.\nVe kâlel insânu mâ lehâ.\nYevmeizin tuhaddisü ahbârehâ.\nBi enne rabbeke evhâ lehâ.\nYevmeizin yasdurun nâsü eşâtel liyürav a‘mâlehüm.\nFemen ya‘mel miskâle zerretin hayran yerah.\nVe men ya‘mel miskâle zerretin şerran yerah.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nIdhā zulzilati l-arḍu zilzālahā.\nWa akhrajati l-arḍu athqālahā.\nWa qāla l-insānu mā lahā.\nYawmaʾidhin tuḥaddithu akhbārahā.\nBi-anna rabbaka awḥā lahā.\nYawmaʾidhin yaṣduru n-nāsu ashtātan liyuraw aʿmālahum.\nFa-man yaʿmal mithqāla dharratin khayran yarah.\nWa man yaʿmal mithqāla dharratin sharran yarah."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nYer, o şiddetli sarsıntısıyla sarsıldığında,\nyer içindekileri dışarı çıkardığında,\ninsan, “Buna ne oluyor?” dediğinde,\no gün yer, haberlerini anlatacaktır.\nÇünkü Rabbin ona bunu vahyetmiştir.\nO gün insanlar, yaptıklarının kendilerine gösterilmesi için\nbölük bölük ortaya çıkacaklardır.\nKim zerre kadar hayır yapmışsa onu görür.\nKim de zerre kadar şer yapmışsa onu görür.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nWhen the earth is shaken with its final earthquake,\nand the earth brings forth its burdens,\nand man says, “What is wrong with it?”\nThat Day, it will report its news,\nbecause your Lord has inspired it.\nThat Day, people will come forward in scattered groups\nto be shown their deeds.\nSo whoever does an atom’s weight of good will see it,\nand whoever does an atom’s weight of evil will see it."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/ZILZAL.m4a'),
    },
    {
        id: 231,
        title: 'Beyyine Suresi',
        description: 'Beyyine Suresi',
        level: 1,
        unlocked: true,
        color: colors.primary,
        borderColor: colors.buttonOrangeBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/231',
        content: {
            info: {
                tr: "Beyyine Suresi, apaçık delilin gelişiyle birlikte hak ile bâtılın ayrıldığını ve samimi kulluğun esaslarını bildirir.",
                en: "Surah Al-Bayyinah explains that with the coming of clear proof, truth is distinguished from falsehood and sincere worship is defined."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nلَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنْفَكِّينَ\nحَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ\nرَسُولٌ مِنَ اللّٰهِ يَتْلُو صُحُفًا مُطَهَّرَةً\nفِيهَا كُتُبٌ قَيِّمَةٌ\nوَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ\nإِلَّا مِنْ بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ\nوَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللّٰهَ مُخْلِصِينَ لَهُ الدِّينَ\nحُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ\nوَذٰلِكَ دِينُ الْقَيِّمَةِ\nإِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ\nفِي نَارِ جَهَنَّمَ خَالِدِينَ فِيهَا\nأُولٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ\nإِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ\nأُولٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ\nجَزَاؤُهُمْ عِنْدَ رَبِّهِمْ جَنَّاتُ عَدْنٍ\nتَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا أَبَدًا\nرَضِيَ اللّٰهُ عَنْهُمْ وَرَضُوا عَنْهُ\nذٰلِكَ لِمَنْ خَشِيَ رَبَّهُ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nLem yekünillezîne keferû min ehlil kitâbi vel müşrikîne münfekkîn.\nHattâ te’tiyehümül beyyineh.\nResûlün minallâhi yetlû suhufen mutahharah.\nFîhâ kütübün kayyimeh.\nVe mâ teferrekallezîne ûtül kitâbe.\nİllâ min ba‘di mâ câethümül beyyineh.\nVe mâ umirû illâ liya‘budullâhe muhlisîne lehüddîn.\nHunefâe ve yukîmûs salâte ve yü’tüz zekâte.\nVe zâlike dînül kayyimeh.\nİnnel lezîne keferû min ehlil kitâbi vel müşrikîne.\nFî nâri cehenneme hâlidîne fîhâ.\nUlâike hüm şerrül beriyyeh.\nİnnel lezîne âmenû ve amilûs sâlihât.\nUlâike hüm hayrül beriyyeh.\nCezâühüm inde rabbihim cennâtü adnin.\nTecrî min tahtihâl enhâr.\nHâlidîne fîhâ ebedâ.\nRadiyallâhü anhüm ve radû anh.\nZâlike limen haşiye rabbeh.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nLam yakuni lladhīna kafarū min ahli l-kitābi wal-mushrikīna munfakkīn.\nḤattā taʾtiyahumu l-bayyinah.\nRasūlun mina llāhi yatlū ṣuḥufan muṭahharah.\nFīhā kutubun qayyimah.\nWa mā tafarraqa lladhīna ūtū l-kitāba.\nIllā min baʿdi mā jāʾathumu l-bayyinah.\nWa mā umirū illā liyaʿbudū llāha mukhliṣīna lahu d-dīn.\nḤunafāʾa wa yuqīmū ṣ-ṣalāta wa yuʾtū z-zakāh.\nWa dhālika dīnu l-qayyimah.\nInna lladhīna kafarū min ahli l-kitābi wal-mushrikīna.\nFī nāri jahannama khālidīna fīhā.\nUlāʾika hum sharru l-bariyyah.\nInna lladhīna āmanū wa ʿamilū ṣ-ṣāliḥāt.\nUlāʾika hum khayru l-bariyyah.\nJazāʾuhum ʿinda rabbihim jannātu ʿadnin.\nTajrī min taḥtihā l-anhār.\nKhālidīna fīhā abadan.\nRaḍiya llāhu ʿanhum wa raḍū ʿanh.\nDhālika liman khashiya rabbah."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nKitap ehli ve müşriklerden inkâr edenler, kendilerine apaçık delil gelinceye kadar ayrılığa düşmemişlerdi.\nAllah'tan gelen, tertemiz sayfalar okuyan bir peygamber…\nBu sayfalarda dosdoğru hükümler vardır.\nKendilerine kitap verilenler, ancak kendilerine apaçık delil geldikten sonra ayrılığa düştüler.\nOysa onlara, dini yalnız Allah'a has kılarak, dosdoğru bir inançla O'na kulluk etmeleri, namazı kılmaları ve zekâtı vermeleri emredilmişti.\nİşte doğru din budur.\nKitap ehli ve müşriklerden inkâr edenler, cehennem ateşinde ebedî kalacaklardır; onlar yaratılmışların en kötüleridir.\nİman edip salih amel işleyenler ise yaratılmışların en hayırlılarıdır.\nOnların mükâfatı, Rableri katında, altlarından ırmaklar akan Adn cennetleridir; orada ebedî kalacaklardır.\nAllah onlardan razı olmuş, onlar da Allah'tan razı olmuşlardır.\nBu, Rabbinden korkanlar içindir.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nThose who disbelieved among the People of the Book and the polytheists were not to depart from disbelief until the clear proof came to them—\na Messenger from Allah, reciting purified scriptures,\nwithin which are upright writings.\nNor did those who were given the Scripture become divided until after the clear proof had come to them.\nAnd they were not commanded except to worship Allah, being sincere to Him in religion, inclining to truth, and to establish prayer and give zakah.\nThat is the correct religion.\nIndeed, those who disbelieve among the People of the Book and the polytheists will be in the Fire of Hell, abiding therein forever; they are the worst of creation.\nBut those who believe and do righteous deeds are the best of creation.\nTheir reward with their Lord will be Gardens of Eternity beneath which rivers flow, wherein they will abide forever.\nAllah is pleased with them, and they are pleased with Him.\nThat is for whoever fears his Lord."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/BEYYINE.m4a'),
    },
    {
        id: 232,
        title: 'Kadir Suresi',
        description: 'Kadir Suresi',
        level: 1,
        unlocked: true,
        color: colors.secondary,
        borderColor: colors.buttonBlueBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/232',
        content: {
            info: {
                tr: "Kadir Suresi, Kur'an'ın indirildiği Kadir Gecesi'nin değerini ve bu gecenin bin aydan hayırlı olduğunu bildirir.",
                en: "Surah Al-Qadr highlights the virtue of the Night of Decree, during which the Qur'an was revealed, and states that it is better than a thousand months."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nإِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ\nوَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ\nلَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ\nتَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا\nبِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ\nسَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nİnnâ enzelnâhü fî leyletil kadr.\nVe mâ edrâke mâ leyletül kadr.\nLeyletül kadr hayrun min elfi şehr.\nTenezzelül melâiketü ver-rûhu fîhâ.\nBi izni rabbihim min külli emr.\nSelâmün hiye hattâ matle‘il fecr.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nInnā anzalnāhu fī laylati l-qadr.\nWa mā adrāka mā laylatu l-qadr.\nLaylatu l-qadr khayrun min alfi shahr.\nTanazzalu l-malāʾikatu wa r-rūḥu fīhā.\nBiʾidhni rabbihim min kulli amr.\nSalāmun hiya ḥattā maṭlaʿi l-fajr."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nŞüphesiz Biz onu Kadir Gecesi'nde indirdik.\nKadir Gecesi'nin ne olduğunu sen nereden bileceksin?\nKadir Gecesi bin aydan daha hayırlıdır.\nMelekler ve Ruh, Rablerinin izniyle o gecede her iş için inerler.\nO gece, tan yerinin ağarmasına kadar bir esenliktir.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nIndeed, We sent it down during the Night of Decree.\nAnd what can make you know what the Night of Decree is?\nThe Night of Decree is better than a thousand months.\nThe angels and the Spirit descend therein by permission of their Lord for every matter.\nPeace it is until the emergence of dawn."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/KADIR.m4a'),
    },
    {
        id: 233,
        title: 'Alak Suresi',
        description: 'Alak Suresi',
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/233',
        content: {
            info: {
                tr: "Alak Suresi, ilk vahyin indirildiği sure olarak bilinir; ilmin, okumanın ve insanın yaratılışının önemini vurgular.",
                en: "Surah Al-ʿAlaq is known as the first revealed chapter, emphasizing knowledge, reading, and human creation."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nاقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ\nخَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ\nاقْرَأْ وَرَبُّكَ الْأَكْرَمُ\nالَّذِي عَلَّمَ بِالْقَلَمِ\nعَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ\nكَلَّا إِنَّ الْإِنْسَانَ لَيَطْغَىٰ\nأَنْ رَآهُ اسْتَغْنَىٰ\nإِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ\nأَرَأَيْتَ الَّذِي يَنْهَىٰ\nعَبْدًا إِذَا صَلَّىٰ\nأَرَأَيْتَ إِنْ كَانَ عَلَى الْهُدَىٰ\nأَوْ أَمَرَ بِالتَّقْوَىٰ\nأَرَأَيْتَ إِنْ كَذَّبَ وَتَوَلَّىٰ\nأَلَمْ يَعْلَمْ بِأَنَّ اللّٰهَ يَرَىٰ\nكَلَّا لَئِنْ لَمْ يَنْتَهِ\nلَنَسْفَعًا بِالنَّاصِيَةِ\nنَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ\nفَلْيَدْعُ نَادِيَهُ\nسَنَدْعُ الزَّبَانِيَةَ\nكَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِبْ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nİkra’ bismi rabbikellezî halak.\nHalakal insâne min alak.\nİkra’ ve rabbükel ekrem.\nEllezî alleme bil kalem.\nAlleme’l insâne mâ lem ya‘lem.\nKellâ innel insâne le yatğâ.\nEn raâhüstağnâ.\nİnne ilâ rabbiker ruc‘â.\nEraeytellezî yenhâ.\nAbden izâ sallâ.\nEraeyte in kâne alel hudâ.\nEv emere bit takvâ.\nEraeyte in kezzebe ve tevellâ.\nElem ya‘lem bi ennallâhe yerâ.\nKellâ le in lem yenteh.\nLe nesfe‘an bin nâsiyeh.\nNâsiyetin kâzibetin hâti’eh.\nFelyed‘u nâdiyeh.\nSened‘uz zebâniyeh.\nKellâ lâ tütı‘hü vescüd vakterib.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nIqraʾ bismi rabbika alladhī khalaq.\nKhalaqa l-insāna min ʿalaq.\nIqraʾ wa rabbuka l-akram.\nAlladhī ʿallama bil-qalam.\nʿAllama l-insāna mā lam yaʿlam.\nKallā inna l-insāna la-yaṭghā.\nAn raʾāhu stagh-nā.\nInna ilā rabbika r-rujʿā.\nAraʾayta lladhī yanhā.\nʿAbdan idhā ṣallā.\nAraʾayta in kāna ʿalā l-hudā.\nAw amara bit-taqwā.\nAraʾayta in kadhdhaba wa tawallā.\nAlam yaʿlam bi-anna llāha yarā.\nKallā laʾin lam yantahi.\nLa-nasfaʿan bi n-nāṣiyah.\nNāṣiyatin kādhibatin khāṭiʾah.\nFal-yadʿu nādiyah.\nSa-nadʿu z-zabāniyah.\nKallā lā tuṭiʿhu wa-sjud wa-qtarib."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nYaratan Rabbinin adıyla oku!\nO, insanı bir alaktan yarattı.\nOku! Senin Rabbin en cömert olandır.\nKalemle öğreten O'dur.\nİnsana bilmediğini öğretendir.\nHayır! İnsan kendini yeterli gördüğünde azgınlaşır.\nOysa dönüş mutlaka Rabbinedir.\nNamaz kılan bir kulunu engelleyeni gördün mü?\nYa o doğru yolda ise\nveya takvâyı emrediyorsa?\nYa yalanlayıp yüz çeviriyorsa?\nAllah'ın gördüğünü bilmiyor mu?\nHayır! Vazgeçmezse onu perçeminden yakalayacağız;\nyalancı ve günahkâr perçeminden!\nHaydi çağırsın taraftarlarını,\nBiz de zebânileri çağıracağız.\nHayır! Ona uyma; secde et ve Rabbine yaklaş.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nRead in the name of your Lord who created—\ncreated man from a clinging substance.\nRead, and your Lord is the Most Generous,\nwho taught by the pen,\ntaught man what he did not know.\nNo! Man transgresses\nwhen he sees himself self-sufficient.\nIndeed, to your Lord is the return.\nHave you seen the one who forbids\na servant when he prays?\nHave you seen if he is upon guidance\nor enjoins righteousness?\nHave you seen if he denies and turns away?\nDoes he not know that Allah sees?\nNo! If he does not desist, We will surely seize him by the forelock—\na lying, sinful forelock.\nThen let him call his associates;\nWe will call the guards of Hell.\nNo! Do not obey him. Prostrate and draw near."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/ALAK.m4a'),
    },
    {
        id: 234,
        title: 'Adiyât Suresi',
        description: 'Adiyât Suresi',
        level: 1,
        unlocked: true,
        color: colors.pink,
        borderColor: colors.buttonPinkBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/234',
        content: {
            info: {
                tr: "Âdiyât Suresi, insanın nankörlüğünü hatırlatır ve Allah'ın her şeyi bildiğini vurgular.",
                en: "Surah Al-ʿĀdiyāt highlights human ingratitude and emphasizes that Allah is fully aware of all deeds."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nوَالْعَادِيَاتِ ضَبْحًا\nفَالْمُورِيَاتِ قَدْحًا\nفَالْمُغِيرَاتِ صُبْحًا\nفَأَثَرْنَ بِهِ نَقْعًا\nفَوَسَطْنَ بِهِ جَمْعًا\nإِنَّ الْإِنْسَانَ لِرَبِّهِ لَكَنُودٌ\nوَإِنَّهُ عَلَىٰ ذٰلِكَ لَشَهِيدٌ\nوَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ\nأَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ\nوَحُصِّلَ مَا فِي الصُّدُورِ\nإِنَّ رَبَّهُمْ بِهِمْ يَوْمَئِذٍ لَخَبِيرٌ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nVel âdiyâti dabhan.\nFel mûriyâti kadhan.\nFel mugîrâti subhan.\nFe eser’ne bihî nak‘an.\nFe vesatne bihî cem‘an.\nİnnel insâne lirabbihî lekenûd.\nVe innehû alâ zâlike leşehîd.\nVe innehû lihubbil hayri leşedîd.\nEfelâ ya‘lemü izâ bu‘sira mâ fil kubûr.\nVe hussile mâ fis sudûr.\nİnne rabbehüm bihim yevmeizin lehabîr.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nWal-ʿādiyāti ḍabḥā.\nFal-mūriyāti qadḥā.\nFal-mughīrāti ṣubḥā.\nFa-atharna bihī naqʿā.\nFa-wasaṭna bihī jamʿā.\nInna l-insāna li-rabbihī la-kanūd.\nWa innahu ʿalā dhālika la-shahīd.\nWa innahu li-ḥubbi l-khayri la-shadīd.\nAfalā yaʿlamu idhā buʿthira mā fī l-qubūr.\nWa ḥuṣṣila mā fī ṣ-ṣudūr.\nInna rabbahum bihim yawmaʾidhin la-khabīr."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nSoluyarak koşanlara,\nkıvılcımlar çıkaranlara,\nsabah vakti baskın yapanlara,\ntozu dumana katanlara\nve onunla topluluğun ortasına dalanlara andolsun ki;\ninsan Rabbine karşı gerçekten çok nankördür.\nŞüphesiz buna kendisi de şahittir.\nVe o, mala olan sevgisinde çok aşırıdır.\nKabirlerde olanlar dışarı çıkarıldığında\nve kalplerde olanlar ortaya döküldüğünde,\nişte o gün Rablerinin, onlardan tamamen haberdar olduğu bilinmez mi?",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nBy the charging horses, panting,\nstriking sparks of fire,\nraiding at dawn,\nraising clouds of dust,\nand penetrating into the midst of the enemy—\nindeed, mankind is ungrateful to his Lord.\nAnd indeed, he is himself a witness to that.\nAnd indeed, he is intense in love of wealth.\nDoes he not know that when what is in the graves is scattered\nand what is in the hearts is brought forth,\ntheir Lord, that Day, will be fully aware of them?"
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/ADIYAT.m4a'),
    },
];
