import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuestionCard, OptionButton, Timer, LifeIndicator } from '@components/game';
import { Button } from '@components/ui';
import { useStore, useAuth } from '@/store';
import { colors } from '@constants/colors';
import { database } from '@/lib/supabase/database';
import { useTheme } from '@/contexts/ThemeContext';

export default function VersesGamePlayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentLives, maxLives, removeLives, addXP } = useStore();
  const { isAuthenticated, user } = useAuth();
  const { themeVersion } = useTheme();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showLatin, setShowLatin] = useState(false);

  // Dynamic styles
  const styles = useMemo(() => getStyles(), [themeVersion]);

  // Mock questions - 20 total, 10 will be randomly selected
  const allMockQuestions = [
    {
      id: '1',
      questionText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ __',
      questionTextLatin: 'Bismillahir-Rahmanir-__',
      correctAnswer: 'الرَّحِيمِ',
      correctAnswerLatin: 'Rahim',
      options: ['الرَّحِيمِ', 'الْكَرِيمِ', 'الْحَكِيمِ', 'الْعَظِيمِ'],
      optionsLatin: ['Rahim', 'Karim', 'Hakim', 'Azim'],
    },
    {
      id: '2',
      questionText: 'الْحَمْدُ لِلَّهِ رَبِّ __',
      questionTextLatin: 'Elhamdulillahi rabbi-__',
      correctAnswer: 'الْعَالَمِينَ',
      correctAnswerLatin: 'Alemin',
      options: ['الْعَالَمِينَ', 'الْمُؤْمِنِينَ', 'الْمُسْلِمِينَ', 'الصَّالِحِينَ'],
      optionsLatin: ['Alemin', 'Muminin', 'Muslimin', 'Salihin'],
    },
    {
      id: '3',
      questionText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ __',
      questionTextLatin: 'İyyake nabudu ve iyyake-__',
      correctAnswer: 'نَسْتَعِينُ',
      correctAnswerLatin: 'Nestein',
      options: ['نَسْتَعِينُ', 'نَسْتَغْفِرُ', 'نَسْأَلُ', 'نَدْعُو'],
      optionsLatin: ['Nestein', 'Nestagfiru', 'Neselu', 'Nedu'],
    },
    {
      id: '4',
      questionText: 'اهْدِنَا الصِّرَاطَ __',
      questionTextLatin: 'İhdinas-siratal-__',
      correctAnswer: 'الْمُسْتَقِيمَ',
      correctAnswerLatin: 'Mustakim',
      options: ['الْمُسْتَقِيمَ', 'الْقَوِيمَ', 'الْعَظِيمَ', 'الْكَرِيمَ'],
      optionsLatin: ['Mustakim', 'Kavim', 'Azim', 'Karim'],
    },
    {
      id: '5',
      questionText: 'قُلْ هُوَ اللَّهُ __',
      questionTextLatin: 'Kul huvallahu-__',
      correctAnswer: 'أَحَدٌ',
      correctAnswerLatin: 'Ehad',
      options: ['أَحَدٌ', 'وَاحِدٌ', 'صَمَدٌ', 'قَدِيرٌ'],
      optionsLatin: ['Ehad', 'Vahid', 'Samed', 'Kadir'],
    },
    {
      id: '6',
      questionText: 'اللَّهُ __',
      questionTextLatin: 'Allahus-__',
      correctAnswer: 'الصَّمَدُ',
      correctAnswerLatin: 'Samed',
      options: ['الصَّمَدُ', 'الْأَحَدُ', 'الْوَاحِدُ', 'الْقَادِرُ'],
      optionsLatin: ['Samed', 'Ehad', 'Vahid', 'Kadir'],
    },
    {
      id: '7',
      questionText: 'لَمْ يَلِدْ وَلَمْ __',
      questionTextLatin: 'Lem yelid ve lem-__',
      correctAnswer: 'يُولَدْ',
      correctAnswerLatin: 'Yuled',
      options: ['يُولَدْ', 'يُخْلَقْ', 'يَكُنْ', 'يُوجَدْ'],
      optionsLatin: ['Yuled', 'Yuhlak', 'Yekun', 'Yucad'],
    },
    {
      id: '8',
      questionText: 'وَلَمْ يَكُنْ لَهُ __ أَحَدٌ',
      questionTextLatin: 'Ve lem yekun lehu-__ ehad',
      correctAnswer: 'كُفُوًا',
      correctAnswerLatin: 'Kufuven',
      options: ['كُفُوًا', 'شَرِيكًا', 'مِثْلًا', 'نَظِيرًا'],
      optionsLatin: ['Kufuven', 'Şeriken', 'Mislen', 'Naziren'],
    },
    {
      id: '9',
      questionText: 'قُلْ أَعُوذُ بِرَبِّ __',
      questionTextLatin: 'Kul euzu birabbi-__',
      correctAnswer: 'الْفَلَقِ',
      correctAnswerLatin: 'Felak',
      options: ['الْفَلَقِ', 'النَّاسِ', 'الْعَالَمِينَ', 'الْمَشْرِقِ'],
      optionsLatin: ['Felak', 'Nas', 'Alemin', 'Meşrik'],
    },
    {
      id: '10',
      questionText: 'مِنْ شَرِّ مَا __',
      questionTextLatin: 'Min şerri ma-__',
      correctAnswer: 'خَلَقَ',
      correctAnswerLatin: 'Halak',
      options: ['خَلَقَ', 'صَنَعَ', 'فَعَلَ', 'عَمِلَ'],
      optionsLatin: ['Halak', 'Sanaa', 'Feale', 'Amile'],
    },
    {
      id: '11',
      questionText: 'قُلْ أَعُوذُ بِرَبِّ __',
      questionTextLatin: 'Kul euzu birabbi-__',
      correctAnswer: 'النَّاسِ',
      correctAnswerLatin: 'Nas',
      options: ['النَّاسِ', 'الْفَلَقِ', 'الْعَالَمِينَ', 'الْخَلْقِ'],
      optionsLatin: ['Nas', 'Felak', 'Alemin', 'Halk'],
    },
    {
      id: '12',
      questionText: 'مَلِكِ __',
      questionTextLatin: 'Meliki-__',
      correctAnswer: 'النَّاسِ',
      correctAnswerLatin: 'Nas',
      options: ['النَّاسِ', 'الْمُلْكِ', 'الْعَالَمِينَ', 'الْخَلْقِ'],
      optionsLatin: ['Nas', 'Mulk', 'Alemin', 'Halk'],
    },
    {
      id: '13',
      questionText: 'إِلَٰهِ __',
      questionTextLatin: 'İlahi-__',
      correctAnswer: 'النَّاسِ',
      correctAnswerLatin: 'Nas',
      options: ['النَّاسِ', 'الْعَالَمِينَ', 'الْمُؤْمِنِينَ', 'الْخَلْقِ'],
      optionsLatin: ['Nas', 'Alemin', 'Muminin', 'Halk'],
    },
    {
      id: '14',
      questionText: 'مِنْ شَرِّ الْوَسْوَاسِ __',
      questionTextLatin: 'Min şerril-vesvasi-__',
      correctAnswer: 'الْخَنَّاسِ',
      correctAnswerLatin: 'Hannas',
      options: ['الْخَنَّاسِ', 'الْقَهَّارِ', 'الْجَبَّارِ', 'الْكَذَّابِ'],
      optionsLatin: ['Hannas', 'Kahhar', 'Cebbar', 'Kezzab'],
    },
    {
      id: '15',
      questionText: 'إِنَّا أَعْطَيْنَاكَ __',
      questionTextLatin: 'İnna ataynak-__',
      correctAnswer: 'الْكَوْثَرَ',
      correctAnswerLatin: 'Kevser',
      options: ['الْكَوْثَرَ', 'الْخَيْرَ', 'النَّصْرَ', 'الْفَتْحَ'],
      optionsLatin: ['Kevser', 'Hayr', 'Nasr', 'Feth'],
    },
    {
      id: '16',
      questionText: 'فَصَلِّ لِرَبِّكَ __',
      questionTextLatin: 'Fesalli lirabbike-__',
      correctAnswer: 'وَانْحَرْ',
      correctAnswerLatin: 'Venhar',
      options: ['وَانْحَرْ', 'وَاسْجُدْ', 'وَارْكَعْ', 'وَاذْكُرْ'],
      optionsLatin: ['Venhar', 'Vescud', 'Verka', 'Vezkur'],
    },
    {
      id: '17',
      questionText: 'إِنَّ شَانِئَكَ هُوَ __',
      questionTextLatin: 'İnne şaniake huve-__',
      correctAnswer: 'الْأَبْتَرُ',
      correctAnswerLatin: 'Ebter',
      options: ['الْأَبْتَرُ', 'الْأَخْسَرُ', 'الْأَذَلُّ', 'الْأَصْغَرُ'],
      optionsLatin: ['Ebter', 'Ahser', 'Ezell', 'Asgar'],
    },
    {
      id: '18',
      questionText: 'وَالْعَصْرِ * إِنَّ الْإِنْسَانَ لَفِي __',
      questionTextLatin: 'Vel-asr * İnnel-insane lefi-__',
      correctAnswer: 'خُسْرٍ',
      correctAnswerLatin: 'Husr',
      options: ['خُسْرٍ', 'ضَلَالٍ', 'هَلَاكٍ', 'عَذَابٍ'],
      optionsLatin: ['Husr', 'Dalal', 'Helak', 'Azab'],
    },
    {
      id: '19',
      questionText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا __',
      questionTextLatin: 'İllellezine amenu ve amilus-salihat ve tevasevu bil-hakki ve tevasevu-__',
      correctAnswer: 'بِالصَّبْرِ',
      correctAnswerLatin: 'Bissabr',
      options: ['بِالصَّبْرِ', 'بِالشُّكْرِ', 'بِالْعِلْمِ', 'بِالْخَيْرِ'],
      optionsLatin: ['Bissabr', 'Biş-şukr', 'Bil-ilm', 'Bil-hayr'],
    },
    {
      id: '20',
      questionText: 'أَلَمْ نَشْرَحْ لَكَ __',
      questionTextLatin: 'Elem neşrah leke-__',
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = mockQuestions[currentQuestionIndex];

  useEffect(() => {
    // Check lives
    if (currentLives <= 0) {
      Alert.alert('Yetersiz Can', 'Canın kalmadı! Reklam izleyerek veya bekleyerek can kazanabilirsin.', [
        {
          text: 'Tamam', onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }
        }
      ]);
      return;
    }

    // Deduct life
    removeLives(1);
  }, []);

  const handleTimeUp = () => {
    handleAnswer(getCurrentOptions()[0], 0);
  };

  const handleAnswer = async (answer: string, timeTaken: number) => {
    if (isAnswered) return;

    setSelectedOption(answer);
    const correct = showLatin
      ? answer === currentQuestion.correctAnswerLatin
      : answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCorrect(null);

    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsGameComplete(true);
    }
  };

  const handleExit = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Add XP locally
    if (correctAnswersCount > 0) {
      addXP(correctAnswersCount);

      // Sync with DB if authenticated
      if (isAuthenticated && user?.id) {
        try {
          console.log('🔄 Syncing Verses XP to DB:', correctAnswersCount);
          await database.users.updateXP(user.id, correctAnswersCount);

          // Save progress to enable weekly activity tracking
          await database.progress.updateCompletion(
            user.id,
            id as string, // lesson_id
            correctAnswersCount,
            mockQuestions.length
          );

          // Record daily activity (optimized)
          await database.dailyActivity.record(user.id);

          console.log('✅ Verses game progress saved');
        } catch (error) {
          console.error('❌ Failed to sync XP:', error);
        }
      }
    }
    handleExit();
  };

  const getCurrentOptions = () => {
    return showLatin ? currentQuestion.optionsLatin : currentQuestion.options;
  };

  const getCurrentQuestion = () => {
    return showLatin ? currentQuestion.questionTextLatin : currentQuestion.questionText;
  };

  const getOptionState = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option ? 'selected' : 'default';
    }

    const correctAnswer = showLatin
      ? currentQuestion.correctAnswerLatin
      : currentQuestion.correctAnswer;

    if (option === correctAnswer) {
      return 'correct';
    }

    if (option === selectedOption && !isCorrect) {
      return 'incorrect';
    }

    return 'default';
  };

  if (isGameComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Tebrikler!</Text>
          <Text style={styles.completeText}>Dersi başarıyla tamamladın.</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Doğru Cevap: {correctAnswersCount}/{mockQuestions.length}</Text>
            <Text style={styles.statText}>Kazanılan XP: +{correctAnswersCount}</Text>
          </View>

          <Pressable
            style={[styles.completeButton, isSubmitting && { opacity: 0.7 }]}
            onPress={handleComplete}
            disabled={isSubmitting}
          >
            <Text style={styles.completeButtonText}>
              {isSubmitting ? 'Kaydediliyor...' : 'Tamamla!'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit}>
          <Text style={styles.backButton}>✕</Text>
        </Pressable>
        <LifeIndicator currentLives={currentLives} maxLives={maxLives} />
      </View>

      {/* Timer - Key forces reset on question change */}
      <Timer
        key={currentQuestionIndex}
        duration={10}
        onTimeUp={handleTimeUp}
        isActive={!isAnswered}
      />

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          {/* Question */}
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={mockQuestions.length}
            question={getCurrentQuestion()}
          />

          <Button
            title={showLatin ? 'Arapça Göster' : 'Latin Göster'}
            variant="outline"
            size="small"
            onPress={() => setShowLatin(!showLatin)}
            style={styles.toggleButton}
          />
        </View>

        {/* Options */}
        <View style={styles.options}>
          {getCurrentOptions().map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              state={getOptionState(option)}
              onPress={() => handleAnswer(option, 0)}
              disabled={isAnswered}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next Button Footer */}
      {isAnswered && (
        <View style={styles.footer}>
          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < mockQuestions.length - 1 ? 'Sonraki Soru' : 'Bitir'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionContainer: {
    marginBottom: 16,
  },
  toggleButton: {
    marginTop: 8,
  },
  options: {
    marginTop: 8,
    paddingBottom: 100, // Space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.successDark,
    marginHorizontal: 20,
  },
  nextButtonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  completeText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  statsContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  completeButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.successDark,
  },
  completeButtonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
