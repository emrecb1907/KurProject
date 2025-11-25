import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';

export default function QuizGamePlayScreen() {
    const { id } = useLocalSearchParams();

    // Mock Islamic Questions
    const initialQuestions: GameQuestion[] = [
        {
            id: '1',
            question: 'İslam\'ın şartı kaçtır?',
            correctAnswer: '5',
            options: ['3', '4', '5', '6'],
        },
        {
            id: '2',
            question: 'Kuran-ı Kerim\'in ilk inen suresi hangisidir?',
            correctAnswer: 'Alak',
            options: ['Fatiha', 'Bakara', 'Alak', 'Yasin'],
        },
        {
            id: '3',
            question: 'Son peygamber kimdir?',
            correctAnswer: 'Hz. Muhammed',
            options: ['Hz. İsa', 'Hz. Musa', 'Hz. Muhammed', 'Hz. İbrahim'],
        },
        {
            id: '4',
            question: 'Oruç hangi ayda tutulur?',
            correctAnswer: 'Ramazan',
            options: ['Recep', 'Şaban', 'Ramazan', 'Muharrem'],
        },
        {
            id: '5',
            question: 'Günde kaç vakit namaz vardır?',
            correctAnswer: '5',
            options: ['3', '4', '5', '6'],
        },
    ];

    // Select 10 random questions (or all if less than 10)
    const [questions] = useState<GameQuestion[]>(() => {
        const shuffled = [...initialQuestions].sort(() => Math.random() - 0.5);
        // If we have more than 10 questions, take 10, otherwise take all
        return shuffled.slice(0, Math.min(10, shuffled.length));
    });

    return (
        <GameScreen
            lessonId={id as string}
            gameType="quiz"
            questions={questions}
            timerDuration={10}
            hasLatinToggle={false}
        />
    );
}
