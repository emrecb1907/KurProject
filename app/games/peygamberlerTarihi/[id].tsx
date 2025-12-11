import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameScreen } from '@components/game';
import { GameQuestion } from '@/types/game.types';

import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

// Type definition for questions from JSON
interface PeygamberlerTarihiQuestion {
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
    correct: 'A' | 'B' | 'C' | 'D';
}

// Import questions from JSON
import peygamberlerTarihiQuestionsTrRaw from '../../../assets/questions/tr/peygamberlerTarihi.json';
import peygamberlerTarihiQuestionsEnRaw from '../../../assets/questions/en/peygamberlerTarihi.json';

const peygamberlerTarihiQuestionsTr = peygamberlerTarihiQuestionsTrRaw as PeygamberlerTarihiQuestion[];
const peygamberlerTarihiQuestionsEn = peygamberlerTarihiQuestionsEnRaw as PeygamberlerTarihiQuestion[];

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function PeygamberlerTarihiGamePlayScreen() {
    const { id } = useLocalSearchParams();
    const { t, i18n } = useTranslation();

    // Select questions based on language
    const allQuestions = useMemo(() => {
        return i18n.language === 'en' ? peygamberlerTarihiQuestionsEn : peygamberlerTarihiQuestionsTr;
    }, [i18n.language]);

    // Select 10 random questions and shuffle options
    const questions = useMemo(() => {
        // Shuffle all questions and pick 10
        const shuffledQuestions = shuffleArray(allQuestions).slice(0, 10);

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
    }, [allQuestions]);

    return (
        <GameScreen
            key={i18n.language}
            lessonId={id as string}
            gameType="peygamberlerTarihi"
            source="test"
            questions={questions}
            timerDuration={15}
            hasLatinToggle={false}
        />
    );
}
