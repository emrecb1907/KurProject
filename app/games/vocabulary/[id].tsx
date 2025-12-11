import { useState, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';
import { useTranslation } from 'react-i18next';

// Type definition for questions from JSON
interface IbadetQuestion {
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  correct: 'A' | 'B' | 'C' | 'D';
}

// Import questions from JSON
import ibadetBilgisiQuestionsTrRaw from '../../../assets/questions/tr/ibadetBilgisi.json';
import ibadetBilgisiQuestionsEnRaw from '../../../assets/questions/en/ibadetBilgisi.json';

const ibadetBilgisiQuestionsTr = ibadetBilgisiQuestionsTrRaw as IbadetQuestion[];
const ibadetBilgisiQuestionsEn = ibadetBilgisiQuestionsEnRaw as IbadetQuestion[];

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function IbadetBilgisiGamePlayScreen() {
  const { id } = useLocalSearchParams();
  const { i18n } = useTranslation();

  // Select questions based on language
  const questionsSource = useMemo(() => {
    return i18n.language === 'tr' ? ibadetBilgisiQuestionsTr : ibadetBilgisiQuestionsEn;
  }, [i18n.language]);

  // Select 10 random questions and shuffle options
  // We use key based on language to reset state when language changes
  const [questions] = useState<GameQuestion[]>(() => {
    // Shuffle all questions and pick 10
    const shuffledQuestions = shuffleArray(questionsSource).slice(0, 10);

    // Transform to GameQuestion format with shuffled options
    return shuffledQuestions.map((q, index) => {
      const options = [q.A, q.B, q.C, q.D];
      const correctAnswer = q[q.correct as 'A' | 'B' | 'C' | 'D'];

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
      key={i18n.language} // Force re-render when language changes
      lessonId={id as string}
      gameType="vocabulary"
      source="test"
      questions={questions}
      timerDuration={15}
      hasLatinToggle={false}
    />
  );
}
