import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';
import { ARABIC_LETTERS, type Letter } from '@/data/elifBaLetters';

export default function LettersGamePlayScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();

  // Generate 10 random questions from 29 letters
  const [questions] = useState<GameQuestion[]>(() => {
    // Shuffle all 29 letters
    const shuffledLetters = [...ARABIC_LETTERS].sort(() => Math.random() - 0.5);

    // Take first 10 letters
    const selectedLetters = shuffledLetters.slice(0, 10);

    // Generate questions
    return selectedLetters.map((letter, index) => {
      // Get 3 random wrong answers from other letters
      const otherLetters = ARABIC_LETTERS.filter(l => l.id !== letter.id);
      const shuffledOthers = [...otherLetters].sort(() => Math.random() - 0.5);
      const wrongAnswers = shuffledOthers.slice(0, 3).map(l => l.arabic);

      // Combine correct and wrong answers, then shuffle
      const allOptions = [letter.arabic, ...wrongAnswers];
      const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);

      return {
        id: `question-${index + 1}`,
        question: '',
        correctAnswer: letter.arabic,
        options: shuffledOptions,
        audioFileId: letter.id, // 1-29
      };
    });
  });

  return (
    <GameScreen
      lessonId={id as string}
      gameType="letters"
      source="test"
      questions={questions}
      timerDuration={10}
      hasLatinToggle={false}
      title={t('games.letters.title', 'Temel Harfler')}
    />
  );
}
