import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';

export default function LettersGamePlayScreen() {
  const { id } = useLocalSearchParams();

  // Mock questions
  const initialQuestions: GameQuestion[] = [
    {
      id: '1',
      question: '🔊 Dinle',
      correctAnswer: 'أ',
      options: ['أ', 'ب', 'ت', 'ث'],
    },
    {
      id: '2',
      question: '🔊 Dinle',
      correctAnswer: 'ب',
      options: ['أ', 'ب', 'ت', 'ث'],
    },
  ];

  const [mockQuestions] = useState(() => {
    const shuffled = [...initialQuestions].sort(() => Math.random() - 0.5);
    return shuffled;
  });

  return (
    <GameScreen
      lessonId={id as string}
      gameType="letters"
      questions={mockQuestions}
      timerDuration={10}
      hasLatinToggle={false}
    />
  );
}
