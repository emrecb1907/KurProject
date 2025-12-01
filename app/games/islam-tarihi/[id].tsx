import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';

// Import JSON using require for better React Native compatibility
const islamTarihiQuestions = require('@assets/questions/tr/islamTarihi.json');

interface QuestionData {
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
    correct: string;
    id?: number;
}

export default function IslamTarihiTestScreen() {
    const { id } = useLocalSearchParams();

    // Convert JSON questions to GameQuestion format and select 10 random questions
    const [questions] = useState<GameQuestion[]>(() => {
        const allQuestions = islamTarihiQuestions as QuestionData[];
        
        // Add id to each question if not present
        const questionsWithId = allQuestions.map((q, index) => ({
            ...q,
            id: q.id || index + 1,
        }));

        // Shuffle and select 10 random questions
        const shuffled = [...questionsWithId].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(10, shuffled.length));

        // Convert to GameQuestion format
        return selected.map((q, index) => {
            // Get the correct answer text based on the correct letter
            const correctAnswerText = q[q.correct as 'A' | 'B' | 'C' | 'D'];
            
            // Create options array in order A, B, C, D
            const options = [q.A, q.B, q.C, q.D];
            
            // Shuffle options but keep track of correct answer
            const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
            
            return {
                id: `islam-tarihi-${q.id || index + 1}`,
                question: q.question,
                correctAnswer: correctAnswerText,
                options: shuffledOptions,
            };
        });
    });

    return (
        <GameScreen
            lessonId={id as string}
            gameType="quiz"
            source="test"
            questions={questions}
            timerDuration={10}
            hasLatinToggle={false}
        />
    );
}

