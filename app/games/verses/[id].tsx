import { useState, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';
import { useTranslation } from 'react-i18next';

// Type definition for questions from JSON
interface EdepAhlakQuestion {
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  correct: 'A' | 'B' | 'C' | 'D';
}

// Import questions from JSON
import edepAhlakQuestionsTrRaw from '../../../assets/questions/tr/edepAhlak.json';
import edepAhlakQuestionsEnRaw from '../../../assets/questions/en/edepAhlak.json';

const edepAhlakQuestionsTr = edepAhlakQuestionsTrRaw as EdepAhlakQuestion[];
const edepAhlakQuestionsEn = edepAhlakQuestionsEnRaw as EdepAhlakQuestion[];

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function AhlakEdepGamePlayScreen() {
  const { id } = useLocalSearchParams();
  const { t, i18n } = useTranslation();

  // Select questions based on language
  const questionsSource = useMemo(() => {
    return i18n.language === 'tr' ? edepAhlakQuestionsTr : edepAhlakQuestionsEn;
  }, [i18n.language]);

  // Select 10 random questions and shuffle options
  const [questions] = useState<GameQuestion[]>(() => {
    // Shuffle all questions and pick 10
    const shuffledQuestions = shuffleArray(questionsSource).slice(0, 10);

    // Transform to GameQuestion format with shuffled options
    return shuffledQuestions.map((q, index) => {
      const options = [q.A, q.B, q.C, q.D];
      const correctAnswer = q[q.correct];

      // Shuffle options
      const shuffledOptions = shuffleArray(options);

      return {
        id: String(index + 1),
        question: q.question,
        correctAnswer: correctAnswer,
        options: shuffledOptions,
      };
    });
  });

  return (
    <GameScreen
      key={i18n.language}
      lessonId={id as string}
      gameType="verses"
      source="test"
      questions={questions}
      timerDuration={15}
      hasLatinToggle={false}
      title={t('games.verses.title', 'Ahlak ve Edep')}
    />
  );
}
