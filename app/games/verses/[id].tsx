import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';

export default function VersesGamePlayScreen() {
  const { id } = useLocalSearchParams();

  // Mock questions - 20 total, 10 will be randomly selected
  const allMockQuestions: GameQuestion[] = [
    {
      id: '1',
      question: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ __',
      questionLatin: 'Bismillahir-Rahmanir-__',
      correctAnswer: 'الرَّحِيمِ',
      correctAnswerLatin: 'Rahim',
      options: ['الرَّحِيمِ', 'الْكَرِيمِ', 'الْحَكِيمِ', 'الْعَظِيمِ'],
      optionsLatin: ['Rahim', 'Karim', 'Hakim', 'Azim'],
    },
    {
      id: '2',
      question: 'الْحَمْدُ لِلَّهِ رَبِّ __',
      questionLatin: 'Elhamdulillahi rabbi-__',
      correctAnswer: 'الْعَالَمِينَ',
      correctAnswerLatin: 'Alemin',
      options: ['الْعَالَمِينَ', 'الْمُؤْمِنِينَ', 'الْمُسْلِمِينَ', 'الصَّالِحِينَ'],
      optionsLatin: ['Alemin', 'Muminin', 'Muslimin', 'Salihin'],
    },
    {
      id: '3',
      question: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ __',
      questionLatin: 'İyyake nabudu ve iyyake-__',
      correctAnswer: 'نَسْتَعِينُ',
      correctAnswerLatin: 'Nestein',
      options: ['نَسْتَعِينُ', 'نَسْتَغْفِرُ', 'نَسْأَلُ', 'نَدْعُو'],
      optionsLatin: ['Nestein', 'Nestagfiru', 'Neselu', 'Nedu'],
    },
    {
      id: '4',
      question: 'اهْدِنَا الصِّرَاطَ __',
      questionLatin: 'İhdinas-siratal-__',
      correctAnswer: 'الْمُسْتَقِيمَ',
      correctAnswerLatin: 'Mustakim',
      options: ['الْمُسْتَقِيمَ', 'الْقَوِيمَ', 'الْعَظِيمَ', 'الْكَرِيمَ'],
      optionsLatin: ['Mustakim', 'Kavim', 'Azim', 'Karim'],
    },
    {
      id: '5',
      question: 'قُلْ هُوَ اللَّهُ __',
      questionLatin: 'Kul huvallahu-__',
      correctAnswer: 'أَحَدٌ',
      correctAnswerLatin: 'Ehad',
      options: ['أَحَدٌ', 'وَاحِدٌ', 'صَمَدٌ', 'قَدِيرٌ'],
      optionsLatin: ['Ehad', 'Vahid', 'Samed', 'Kadir'],
    },
    {
      id: '6',
      question: 'اللَّهُ __',
      questionLatin: 'Allahus-__',
      correctAnswer: 'الصَّمَدُ',
      correctAnswerLatin: 'Samed',
      options: ['الصَّمَدُ', 'الْأَحَدُ', 'الْوَاحِدُ', 'الْقَادِرُ'],
      optionsLatin: ['Samed', 'Ehad', 'Vahid', 'Kadir'],
    },
    {
      id: '7',
      question: 'لَمْ يَلِدْ وَلَمْ __',
      questionLatin: 'Lem yelid ve lem-__',
      correctAnswer: 'يُولَدْ',
      correctAnswerLatin: 'Yuled',
      options: ['يُولَدْ', 'يُخْلَقْ', 'يَكُنْ', 'يُوجَدْ'],
      optionsLatin: ['Yuled', 'Yuhlak', 'Yekun', 'Yucad'],
    },
    {
      id: '8',
      question: 'وَلَمْ يَكُنْ لَهُ __ أَحَدٌ',
      questionLatin: 'Ve lem yekun lehu-__ ehad',
      correctAnswer: 'كُفُوًا',
      correctAnswerLatin: 'Kufuven',
      options: ['كُفُوًا', 'شَرِيكًا', 'مِثْلًا', 'نَظِيرًا'],
      optionsLatin: ['Kufuven', 'Şeriken', 'Mislen', 'Naziren'],
    },
    {
      id: '9',
      question: 'قُلْ أَعُوذُ بِرَبِّ __',
      questionLatin: 'Kul euzu birabbi-__',
      correctAnswer: 'الْفَلَقِ',
      correctAnswerLatin: 'Felak',
      options: ['الْفَلَقِ', 'النَّاسِ', 'الْعَالَمِينَ', 'الْمَشْرِقِ'],
      optionsLatin: ['Felak', 'Nas', 'Alemin', 'Meşrik'],
    },
    {
      id: '10',
      question: 'مِنْ شَرِّ مَا __',
      questionLatin: 'Min şerri ma-__',
      correctAnswer: 'خَلَقَ',
      correctAnswerLatin: 'Halak',
      options: ['خَلَقَ', 'صَنَعَ', 'فَعَلَ', 'عَمِلَ'],
      optionsLatin: ['Halak', 'Sanaa', 'Feale', 'Amile'],
    },
    {
      id: '11',
      question: 'قُلْ أَعُوذُ بِرَبِّ __',
      questionLatin: 'Kul euzu birabbi-__',
      correctAnswer: 'النَّاسِ',
      correctAnswerLatin: 'Nas',
      options: ['النَّاسِ', 'الْفَلَقِ', 'الْعَالَمِينَ', 'الْخَلْقِ'],
      optionsLatin: ['Nas', 'Felak', 'Alemin', 'Halk'],
    },
    {
      id: '12',
      question: 'مَلِكِ __',
      questionLatin: 'Meliki-__',
      correctAnswer: 'النَّاسِ',
      correctAnswerLatin: 'Nas',
      options: ['النَّاسِ', 'الْمُلْكِ', 'الْعَالَمِينَ', 'الْخَلْقِ'],
      optionsLatin: ['Nas', 'Mulk', 'Alemin', 'Halk'],
    },
    {
      id: '13',
      question: 'إِلَٰهِ __',
      questionLatin: 'İlahi-__',
      correctAnswer: 'النَّاسِ',
      correctAnswerLatin: 'Nas',
      options: ['النَّاسِ', 'الْعَالَمِينَ', 'الْمُؤْمِنِينَ', 'الْخَلْقِ'],
      optionsLatin: ['Nas', 'Alemin', 'Muminin', 'Halk'],
    },
    {
      id: '14',
      question: 'مِنْ شَرِّ الْوَسْوَاسِ __',
      questionLatin: 'Min şerril-vesvasi-__',
      correctAnswer: 'الْخَنَّاسِ',
      correctAnswerLatin: 'Hannas',
      options: ['الْخَنَّاسِ', 'الْقَهَّارِ', 'الْجَبَّارِ', 'الْكَذَّابِ'],
      optionsLatin: ['Hannas', 'Kahhar', 'Cebbar', 'Kezzab'],
    },
    {
      id: '15',
      question: 'إِنَّا أَعْطَيْنَاكَ __',
      questionLatin: 'İnna ataynak-__',
      correctAnswer: 'الْكَوْثَرَ',
      correctAnswerLatin: 'Kevser',
      options: ['الْكَوْثَرَ', 'الْخَيْرَ', 'النَّصْرَ', 'الْفَتْحَ'],
      optionsLatin: ['Kevser', 'Hayr', 'Nasr', 'Feth'],
    },
    {
      id: '16',
      question: 'فَصَلِّ لِرَبِّكَ __',
      questionLatin: 'Fesalli lirabbike-__',
      correctAnswer: 'وَانْحَرْ',
      correctAnswerLatin: 'Venhar',
      options: ['وَانْحَرْ', 'وَاسْجُدْ', 'وَارْكَعْ', 'وَاذْكُرْ'],
      optionsLatin: ['Venhar', 'Vescud', 'Verka', 'Vezkur'],
    },
    {
      id: '17',
      question: 'إِنَّ شَانِئَكَ هُوَ __',
      questionLatin: 'İnne şaniake huve-__',
      correctAnswer: 'الْأَبْتَرُ',
      correctAnswerLatin: 'Ebter',
      options: ['الْأَبْتَرُ', 'الْأَخْسَرُ', 'الْأَذَلُّ', 'الْأَصْغَرُ'],
      optionsLatin: ['Ebter', 'Ahser', 'Ezell', 'Asgar'],
    },
    {
      id: '18',
      question: 'وَالْعَصْرِ * إِنَّ الْإِنْسَانَ لَفِي __',
      questionLatin: 'Vel-asr * İnnel-insane lefi-__',
      correctAnswer: 'خُسْرٍ',
      correctAnswerLatin: 'Husr',
      options: ['خُسْرٍ', 'ضَلَالٍ', 'هَلَاكٍ', 'عَذَابٍ'],
      optionsLatin: ['Husr', 'Dalal', 'Helak', 'Azab'],
    },
    {
      id: '19',
      question: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا __',
      questionLatin: 'İllellezine amenu ve amilus-salihat ve tevasevu bil-hakki ve tevasevu-__',
      correctAnswer: 'بِالصَّبْرِ',
      correctAnswerLatin: 'Bissabr',
      options: ['بِالصَّبْرِ', 'بِالشُّكْرِ', 'بِالْعِلْمِ', 'بِالْخَيْرِ'],
      optionsLatin: ['Bissabr', 'Biş-şukr', 'Bil-ilm', 'Bil-hayr'],
    },
    {
      id: '20',
      question: 'أَلَمْ نَشْرَحْ لَكَ __',
      questionLatin: 'Elem neşrah leke-__',
      correctAnswer: 'صَدْرَكَ',
      correctAnswerLatin: 'Sadrek',
      options: ['صَدْرَكَ', 'قَلْبَكَ', 'عَقْلَكَ', 'نَفْسَكَ'],
      optionsLatin: ['Sadrek', 'Kalbek', 'Aklek', 'Nefsek'],
    },
  ];

  // Select 10 random questions on component mount
  const [mockQuestions] = useState(() => {
    const shuffled = [...allMockQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  return (
    <GameScreen
      lessonId={id as string}
      gameType="verses"
      questions={mockQuestions}
      timerDuration={10}
      hasLatinToggle={true}
    />
  );
}
