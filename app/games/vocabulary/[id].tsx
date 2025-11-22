import { useState, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';

export default function VocabularyGamePlayScreen() {
  const { id } = useLocalSearchParams();

  // Mock questions - 20 total, 10 will be randomly selected
  const allMockQuestions: GameQuestion[] = [
    {
      id: '1',
      question: 'Kitap',
      correctAnswer: 'كِتَاب',
      options: ['كِتَاب', 'قَلَم', 'دَرْس', 'مَدْرَسَة'],
    },
    {
      id: '2',
      question: 'Kalem',
      correctAnswer: 'قَلَم',
      options: ['قَلَم', 'كِتَاب', 'دَفْتَر', 'مِفْتَاح'],
    },
    {
      id: '3',
      question: 'Ders',
      correctAnswer: 'دَرْس',
      options: ['دَرْس', 'مَدْرَسَة', 'مُعَلِّم', 'طَالِب'],
    },
    {
      id: '4',
      question: 'Okul',
      correctAnswer: 'مَدْرَسَة',
      options: ['مَدْرَسَة', 'بَيْت', 'مَسْجِد', 'سُوق'],
    },
    {
      id: '5',
      question: 'Öğretmen',
      correctAnswer: 'مُعَلِّم',
      options: ['مُعَلِّم', 'طَالِب', 'طَبِيب', 'مُهَنْدِس'],
    },
    {
      id: '6',
      question: 'Öğrenci',
      correctAnswer: 'طَالِب',
      options: ['طَالِب', 'مُعَلِّم', 'وَالِد', 'أَخ'],
    },
    {
      id: '7',
      question: 'Ev',
      correctAnswer: 'بَيْت',
      options: ['بَيْت', 'مَدْرَسَة', 'مَسْجِد', 'حَدِيقَة'],
    },
    {
      id: '8',
      question: 'Cami',
      correctAnswer: 'مَسْجِد',
      options: ['مَسْجِد', 'كَنِيسَة', 'بَيْت', 'مَدْرَسَة'],
    },
    {
      id: '9',
      question: 'Su',
      correctAnswer: 'مَاء',
      options: ['مَاء', 'حَلِيب', 'عَصِير', 'شَاي'],
    },
    {
      id: '10',
      question: 'Ekmek',
      correctAnswer: 'خُبْز',
      options: ['خُبْز', 'لَحْم', 'أَرُزّ', 'فَاكِهَة'],
    },
    {
      id: '11',
      question: 'صَلَاة',
      correctAnswer: 'Namaz',
      options: ['Namaz', 'Oruç', 'Zekât', 'Hac'],
    },
    {
      id: '12',
      question: 'صَوْم',
      correctAnswer: 'Oruç',
      options: ['Oruç', 'Namaz', 'Dua', 'Tesbih'],
    },
    {
      id: '13',
      question: 'زَكَاة',
      correctAnswer: 'Zekât',
      options: ['Zekât', 'Sadaka', 'Hac', 'Umre'],
    },
    {
      id: '14',
      question: 'حَجّ',
      correctAnswer: 'Hac',
      options: ['Hac', 'Umre', 'Ziyaret', 'Seyahat'],
    },
    {
      id: '15',
      question: 'قُرْآن',
      correctAnswer: 'Kuran',
      options: ['Kuran', 'Tevrat', 'İncil', 'Zebur'],
    },
    {
      id: '16',
      question: 'نَبِيّ',
      correctAnswer: 'Peygamber',
      options: ['Peygamber', 'Melek', 'İnsan', 'Sahabe'],
    },
    {
      id: '17',
      question: 'مَلَك',
      correctAnswer: 'Melek',
      options: ['Melek', 'Peygamber', 'Cin', 'İnsan'],
    },
    {
      id: '18',
      question: 'جَنَّة',
      correctAnswer: 'Cennet',
      options: ['Cennet', 'Cehennem', 'Dünya', 'Ahiret'],
    },
    {
      id: '19',
      question: 'نَار',
      correctAnswer: 'Cehennem',
      options: ['Cehennem', 'Cennet', 'Ateş', 'Azap'],
    },
    {
      id: '20',
      question: 'إِيمَان',
      correctAnswer: 'İman',
      options: ['İman', 'İslam', 'İhsan', 'İbadet'],
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
      gameType="vocabulary"
      questions={mockQuestions}
      timerDuration={10}
      hasLatinToggle={false}
    />
  );
}
