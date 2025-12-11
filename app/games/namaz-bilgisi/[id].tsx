import { useState, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';
import { useTranslation } from 'react-i18next';

// Import JSONs
const namazBilgisiQuestionsTr = require('@assets/questions/tr/namazBilgisi.json');
const namazBilgisiQuestionsEn = require('@assets/questions/en/namazBilgisi.json');

interface QuestionData {
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
    correct: string;
    id?: number;
}

export default function NamazBilgisiTestScreen() {
    const { id } = useLocalSearchParams();
    const { i18n } = useTranslation();

    // Select questions based on language
    const currentQuestions = i18n.language === 'en' ? namazBilgisiQuestionsEn : namazBilgisiQuestionsTr;

    const questions = useMemo<GameQuestion[]>(() => {
        const allQuestions = currentQuestions as QuestionData[];

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
                id: `namaz-bilgisi-${q.id || index + 1}`,
                question: q.question,
                correctAnswer: correctAnswerText,
                options: shuffledOptions,
            };
        });
    }, [currentQuestions]); // Re-calculate when language/questions change

    return (
        <GameScreen
            key={i18n.language} // Force re-render on language change
            lessonId={id as string}
            gameType="quiz"
            source="test"
            questions={questions}
            timerDuration={10}
            hasLatinToggle={false}
        />
    );
}

