import { useState, useRef, useCallback } from 'react';

export const useGameTimer = () => {
    // Start time tracking
    const startTimeRef = useRef<number>(Date.now());
    const [durationString, setDurationString] = useState<string>("00:00");
    const [isTimeUp, setIsTimeUp] = useState(false);

    // Reset timer (e.g. for retries)
    const resetTimer = useCallback(() => {
        startTimeRef.current = Date.now();
        setIsTimeUp(false);
        setDurationString("00:00");
    }, []);

    // Calculate duration since start
    const calculateDuration = useCallback(() => {
        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - startTimeRef.current) / 1000);

        const minutes = Math.floor(durationSeconds / 60);
        const seconds = durationSeconds % 60;

        const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setDurationString(formatted);

        return durationSeconds;
    }, []);

    // Handle time up event
    const handleTimeDetection = useCallback(() => {
        setIsTimeUp(true);
    }, []);

    return {
        startTimeRef,
        durationString,
        isTimeUp,
        setIsTimeUp, // Exposed if manual override needed
        resetTimer,
        calculateDuration,
        handleTimeDetection
    };
};
