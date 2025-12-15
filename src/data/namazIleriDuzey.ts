import { colors } from '@/constants/colors';
import { BookOpen, HandPalm } from 'phosphor-react-native';

export const namazIleriDuzey = [
    {
        id: 213,
        title: 'Amentü Duası',
        description: 'Amentü Duası',
        level: 1,
        unlocked: true,
        color: colors.primary,
        borderColor: colors.buttonOrangeBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/213',
        content: {
            info: {
                tr: "Amentü Duası, İslam'ın temel iman esaslarını özetleyen inanç bildirimidir.",
                en: "The Āmantu Supplication summarizes the core articles of faith in Islam."
            },
            arabic: "آمَنْتُ بِاللّٰهِ\nوَمَلَائِكَتِهِ\nوَكُتُبِهِ\nوَرُسُلِهِ\nوَالْيَوْمِ الْآخِرِ\nوَبِالْقَدَرِ خَيْرِهِ وَشَرِّهِ مِنَ اللّٰهِ تَعَالٰى\nوَالْبَعْثُ بَعْدَ الْمَوْتِ حَقٌّ\nأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ\nوَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
            transliteration: {
                tr: "Âmentü billâhi,\nve melâiketihî,\nve kütübihî,\nve rusülihî,\nvel yevmil âhiri,\nve bil kaderi hayrihî ve şerrihî minallâhi teâlâ.\nVel ba'sü ba'del mevt hakkun.\nEşhedü en lâ ilâhe illallâh.\nVe eşhedü enne Muhammeden abdühû ve resûlüh.",
                en: "Āmantu billāhi,\nwa malāʾikatihī,\nwa kutubihī,\nwa rusulihī,\nwal-yawmi l-ākhir,\nwa bil-qadari khayrihī wa sharrihī minallāhi taʿālā.\nWal-baʿthu baʿda l-mawti ḥaqq.\nAshhadu an lā ilāha illallāh.\nWa ashhadu anna Muḥammadan ʿabduhū wa rasūluh."
            },
            meaning: {
                tr: "Allah'a, meleklerine, kitaplarına, peygamberlerine,\nahiret gününe ve kadere; hayrın ve şerrin Allah'tan olduğuna inandım.\nÖldükten sonra dirilmek haktır.\nŞahitlik ederim ki Allah'tan başka ilâh yoktur.\nYine şahitlik ederim ki Muhammed, O'nun kulu ve elçisidir.",
                en: "I believe in Allah,\nHis angels, His books, His messengers,\nthe Last Day, and in destiny—both its good and its bad—from Allah the Exalted.\nResurrection after death is true.\nI bear witness that there is no deity worthy of worship except Allah,\nand I bear witness that Muhammad is His servant and His Messenger."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/AMENTU_DUASI.m4a'),
    },
    {
        id: 214,
        title: 'Ayetel Kürsî',
        description: 'Ayetel Kürsî',
        level: 1,
        unlocked: true,
        color: colors.secondary,
        borderColor: colors.buttonBlueBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/214',
        content: {
            info: {
                tr: "Ayetel Kürsî, Allah'ın kudretini ve ilmini anlatan bir ayettir ve namazdan sonra okunması tavsiye edilir.",
                en: "Āyat Al-Kursī describes Allah's supreme authority and knowledge and is commonly recited after Salah."
            },
            arabic: "اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ\nلَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ\nلَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ\nمَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ\nيَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ\nوَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ\nوَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ\nوَلَا يَئُودُهُ حِفْظُهُمَا\nوَهُوَ الْعَلِيُّ الْعَظِيمُ",
            transliteration: {
                tr: "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm.\nLâ te'huzühû sinetün ve lâ nevm.\nLehû mâ fissemâvâti ve mâ fil ard.\nMen zellezî yeşfe'u indehû illâ biiznih.\nYa'lemü mâ beyne eydîhim ve mâ halfehüm.\nVe lâ yühîtûne bişey'in min ilmihî illâ bimâ şâe.\nVesia kürsiyyühüs semâvâti vel ard.\nVe lâ yeûdühû hifzuhümâ.\nVe hüvel aliyyül azîm.",
                en: "Allāhu lā ilāha illā huwa l-ḥayyul-qayyūm.\nLā taʾkhudhuhu sinatun wa lā nawm.\nLahu mā fis-samāwāti wa mā fil-arḍ.\nMan dha lladhī yashfaʿu ʿindahu illā biʾidhnih.\nYaʿlamu mā bayna aydīhim wa mā khalfahum.\nWa lā yuḥīṭūna bishayʾin min ʿilmihī illā bimā shāʾ.\nWasiʿa kursiyyuhus-samāwāti wal-arḍ.\nWa lā yaʾūduhu ḥifẓuhumā.\nWa huwa l-ʿaliyyu l-ʿaẓīm."
            },
            meaning: {
                tr: "Allah, O'ndan başka ilâh yoktur; diridir, her şeyin varlığı O'na bağlıdır.\nO'nu ne uyuklama tutar ne de uyku.\nGöklerde ve yerde ne varsa O'nundur.\nİzni olmadan katında kim şefaat edebilir?\nOnların önlerindekini de arkalarındakini de bilir.\nOnlar, O'nun ilminden ancak dilediği kadarını kavrayabilir.\nKürsîsi gökleri ve yeri kaplamıştır.\nBunların korunması O'na ağır gelmez.\nO, yücedir, büyüktür.",
                en: "Allah—there is no deity worthy of worship except Him, the Ever-Living, the Sustainer of all.\nNeither drowsiness nor sleep overtakes Him.\nTo Him belongs whatever is in the heavens and whatever is on the earth.\nWho is it that can intercede with Him except by His permission?\nHe knows what is before them and what is behind them.\nThey encompass nothing of His knowledge except what He wills.\nHis Kursī extends over the heavens and the earth,\nand their preservation does not burden Him.\nHe is the Most High, the Most Great."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/AYETELKURSI.m4a'),
    },
    {
        id: 215,
        title: 'Kunut Duası (1)',
        description: 'Kunut Duası (1)',
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/215',
        content: {
            info: {
                tr: "Kunut Duası (1), vitir namazında kunut sırasında okunan bir duadır.",
                en: "Qunūt Supplication (1) is recited during the qunūt position in the Witr prayer."
            },
            arabic: "اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ\nوَنَسْتَغْفِرُكَ\nوَنَسْتَهْدِيكَ\nوَنُؤْمِنُ بِكَ\nوَنَتُوبُ إِلَيْكَ\nوَنَتَوَكَّلُ عَلَيْكَ\nوَنُثْنِي عَلَيْكَ الْخَيْرَ\nكُلَّهُ نَشْكُرُكَ\nوَلَا نَكْفُرُكَ\nوَنَخْلَعُ وَنَتْرُكُ\nمَنْ يَفْجُرُكَ",
            transliteration: {
                tr: "Allâhümme innâ neste'înüke,\nve nesteğfirüke,\nve nestehdîke,\nve nü'minü bike,\nve netûbü ileyk,\nve netevekkelü aleyk.\nVe nüsnî aleykel hayra külleh.\nNeşküruke ve lâ nekfürük.\nVe nahlau ve netruku\nmen yefcuruk.",
                en: "Allāhumma innā nastaʿīnuka,\nwa nastaghfiruka,\nwa nastahdīka,\nwa nuʾminu bika,\nwa natūbu ilayk,\nwa natawakkalu ʿalayk.\nWa nuthnī ʿalaykal-khayra kullah.\nNashkuruka wa lā nakfuruk.\nWa nakhlaʿu wa natruku\nman yafjuruk."
            },
            meaning: {
                tr: "Allah'ım! Senden yardım isteriz,\nSenden bağışlanma dileriz,\nSenden doğru yolu isteriz.\nSana iman eder, Sana yönelir\nve Sana tevekkül ederiz.\nSeni hayırla överiz;\nSana şükreder, nankörlük etmeyiz.\nSana isyan edeni terk eder ve ondan uzak dururuz.",
                en: "O Allah, we seek Your help,\nwe seek Your forgiveness,\nand we ask You for guidance.\nWe believe in You, turn to You in repentance,\nand place our trust in You.\nWe praise You with all goodness;\nwe are grateful to You and do not deny You.\nWe abandon and turn away from whoever disobeys You."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/KUNUT_DUASI_1.m4a'),
    },
    {
        id: 216,
        title: 'Kunut Duası (2)',
        description: 'Kunut Duası (2)',
        level: 1,
        unlocked: true,
        color: colors.pink,
        borderColor: colors.buttonPinkBorder,
        icon: HandPalm,
        route: '/lessons/namazDualari/lesson/216',
        content: {
            info: {
                tr: "Kunut Duası (2), vitir namazında ikinci kunut duası olarak okunan metindir.",
                en: "Qunūt Supplication (2) is the second supplication recited during the qunūt in the Witr prayer."
            },
            arabic: "اللّٰهُمَّ إِيَّاكَ نَعْبُدُ\nوَلَكَ نُصَلِّي وَنَسْجُدُ\nوَإِلَيْكَ نَسْعَى وَنَحْفِدُ\nنَرْجُو رَحْمَتَكَ\nوَنَخْشَى عَذَابَكَ\nإِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
            transliteration: {
                tr: "Allâhümme iyyâke na'büdü,\nve leke nusallî ve nescüdü.\nVe ileyke nes'â ve nahfidü.\nNercû rahmetek.\nVe nahşâ azâbek.\nİnne azâbeke bil küffâri mülhik.",
                en: "Allāhumma iyyāka naʿbudu,\nwa laka nuṣallī wa nasjudu.\nWa ilayka nasʿā wa naḥfidu.\nNarjū raḥmatak.\nWa nakhshā ʿadhābak.\nInna ʿadhābaka bil-kuffāri mulḥiq."
            },
            meaning: {
                tr: "Allah'ım! Yalnız Sana ibadet ederiz,\nyalnız Senin için namaz kılar ve secde ederiz.\nYalnız Sana yönelir ve Sana koşarız.\nRahmetini umar,\nazabından korkarız.\nŞüphesiz Senin azabın kâfirleri kuşatacaktır.",
                en: "O Allah, You alone we worship;\nfor You alone we pray and prostrate.\nTo You alone we strive and hasten.\nWe hope for Your mercy\nand fear Your punishment.\nIndeed, Your punishment will surely reach the disbelievers."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/KUNUT_DUASI_2.m4a'),
    },
    {
        id: 217,
        title: 'Âmenerrasûlü',
        description: 'Âmenerrasûlü',
        level: 1,
        unlocked: true,
        color: colors.warning,
        borderColor: colors.warningDark,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/217',
        content: {
            info: {
                tr: "Âmenerrasûlü, Bakara Suresi'nin son iki ayetini kapsar ve iman esaslarını vurgulayan önemli bir metindir.",
                en: "Āmanar-Rasūlu includes the last two verses of Surah Al-Baqarah and emphasizes the core principles of faith."
            },
            arabic: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ\nكُلٌّ آمَنَ بِاللّٰهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ\nلَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ\nوَقَالُوا سَمِعْنَا وَأَطَعْنَا\nغُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ\n\nلَا يُكَلِّفُ اللّٰهُ نَفْسًا إِلَّا وُسْعَهَا\nلَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ\nرَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا\nرَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا\nكَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا\nرَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ\nوَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا\nأَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
            transliteration: {
                tr: "Âmener resûlü bimâ ünzile ileyhi mir rabbihî vel mü'minûn.\nKüllün âmene billâhi ve melâiketihî ve kütübihî ve rusülih.\nLâ nüferriku beyne ehadin mir rusülih.\nVe kâlû semi'nâ ve ata'nâ.\nĞufrâneke rabbenâ ve ileykel masîr.\n\nLâ yükellifullâhü nefsen illâ vus'ahâ.\nLehâ mâ kesebet ve aleyhâ mektesebet.\nRabbenâ lâ tüâhiznâ in nesînâ ev ahta'nâ.\nRabbenâ ve lâ tahmil aleynâ isran.\nKemâ hameltehû alellezîne min kablinâ.\nRabbenâ ve lâ tuhammilnâ mâ lâ tâkate lenâ bih.\nVa'fu annâ, vağfir lenâ, verhamnâ.\nEnte mevlânâ fensurnâ alel kavmil kâfirîn.",
                en: "Āmanar-rasūlu bimā unzila ilayhi mir rabbihī wal-muʾminūn.\nKullun āmana billāhi wa malāʾikatihī wa kutubihī wa rusulih.\nLā nufarriqu bayna aḥadin mir rusulih.\nWa qālū samiʿnā wa aṭaʿnā.\nGhufrānaka rabbanā wa ilaykal-maṣīr.\n\nLā yukallifullāhu nafsan illā wusʿahā.\nLahā mā kasabat wa ʿalayhā māk-tasabat.\nRabbanā lā tuʾākhidhnā in nasīnā aw akhṭaʾnā.\nRabbanā wa lā taḥmil ʿalaynā iṣran.\nKamā ḥamaltahu ʿalal-ladhīna min qablinā.\nRabbanā wa lā tuḥammilnā mā lā ṭāqata lanā bih.\nWaʿfu ʿannā, waghfir lanā, warḥamnā.\nAnta mawlānā fanṣurnā ʿalal-qawmi l-kāfirīn."
            },
            meaning: {
                tr: "Peygamber, Rabbinden kendisine indirilene iman etti; müminler de iman ettiler.\nHepsi Allah'a, meleklerine, kitaplarına ve peygamberlerine iman ettiler.\nO'nun peygamberlerinden hiçbirini diğerinden ayırt etmeyiz, dediler.\n\"İşittik ve itaat ettik. Bağışlamanı dileriz Rabbimiz; dönüş Sanadır.\"\n\nAllah hiç kimseye gücünün yettiğinden fazlasını yüklemez.\nKişinin kazandığı iyilik kendi lehine, işlediği kötülük kendi aleyhinedir.\nRabbimiz! Unutur ya da yanılırsak bizi sorumlu tutma.\nRabbimiz! Bizden öncekilere yüklediğin gibi bize ağır yük yükleme.\nRabbimiz! Gücümüzün yetmeyeceği şeyleri bize yükleme.\nBizi affet, bağışla, bize merhamet et.\nSen bizim Mevlâmızsın; inkârcılara karşı bize yardım et.",
                en: "The Messenger has believed in what was revealed to him from his Lord, and so have the believers.\nAll of them believe in Allah, His angels, His books, and His messengers.\nThey say, \"We make no distinction between any of His messengers. We hear and we obey.\nGrant us Your forgiveness, our Lord; to You is the final return.\"\n\nAllah does not burden any soul beyond its capacity.\nEach will have the good it has earned and bear the consequence of what it has done.\nOur Lord, do not hold us accountable if we forget or make a mistake.\nOur Lord, do not place upon us a burden like that which You placed upon those before us.\nOur Lord, do not burden us with what we cannot bear.\nPardon us, forgive us, and have mercy upon us.\nYou are our Protector, so grant us victory over the disbelieving people."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/AMENERRASULU.m4a'),
    },
    {
        id: 218,
        title: 'Bakara Suresi (İlk Sayfa)',
        description: 'Bakara Suresi (İlk Sayfa)',
        level: 1,
        unlocked: true,
        color: colors.primaryLight,
        borderColor: colors.buttonOrangeBorder,
        icon: BookOpen,
        route: '/lessons/namazDualari/lesson/218',
        content: {
            info: {
                tr: "Bakara Suresi'nin ilk ayetleri, Kur'an'ın hidayet rehberi olduğunu ve müminlerin temel özelliklerini açıklar.",
                en: "The opening verses of Surah Al-Baqarah present the Qur'an as guidance and describe the core qualities of believers."
            },
            arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\nالم\nذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ\nالَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ\nوَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ\nأُولٰئِكَ عَلٰى هُدًى مِنْ رَبِّهِمْ وَأُولٰئِكَ هُمُ الْمُفْلِحُونَ",
            transliteration: {
                tr: "Bismillâhirrahmânirrahîm.\n\nElif lâm mîm.\nZâlikel kitâbu lâ raybe fîh, hüden lil-müttakîn.\nEllezîne yü'minûne bil-ğaybi ve yukîmûnes-salâte ve mimmâ razaknâhüm yünfikûn.\nVellezîne yü'minûne bimâ ünzile ileyke ve mâ ünzile min kablike ve bil-âhireti hüm yûkinûn.\nUlâike alâ hüden mir rabbihim ve ulâike hümül müflihûn.",
                en: "Bismillāhir-Raḥmānir-Raḥīm.\n\nAlif Lām Mīm.\nDhālika l-kitābu lā rayba fīh, hudan lil-muttaqīn.\nAlladhīna yuʾminūna bil-ghaybi wa yuqīmūna ṣ-ṣalāta wa mimmā razaqnāhum yunfiqūn.\nWa alladhīna yuʾminūna bimā unzila ilayka wa mā unzila min qablika wa bil-ākhirati hum yūqinūn.\nUlāʾika ʿalā hudan mir rabbihim wa ulāʾika humul-mufliḥūn."
            },
            meaning: {
                tr: "Rahmân ve Rahîm olan Allah'ın adıyla.\n\nElif, Lâm, Mîm.\nBu kitap, kendisinde asla şüphe olmayan bir hidayet rehberidir; takvâ sahipleri içindir.\nOnlar gayba iman eder, namazı dosdoğru kılar ve kendilerine verdiklerimizden infak ederler.\nSana indirilene ve senden önce indirilene iman ederler; ahirete de kesin olarak inanırlar.\nİşte onlar Rablerinden bir hidayet üzeredirler ve kurtuluşa erenler de onlardır.",
                en: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nAlif, Lām, Mīm.\nThis is the Book in which there is no doubt—a guidance for the God-conscious.\nThose who believe in the unseen, establish prayer, and spend from what We have provided them.\nThose who believe in what has been revealed to you and what was revealed before you, and who have certainty in the Hereafter.\nThey are upon guidance from their Lord, and they are the successful."
            }
        },
        audio: require('../../assets/audio/verses/namazDualari/BAKARA_ILK.m4a'),
    },
];
