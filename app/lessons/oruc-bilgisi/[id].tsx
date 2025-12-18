
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { orucBilgisi } from '@/data/orucBilgisi';
import OrucBilgisiLesson from '@/components/lessons/OrucBilgisiLesson';

export default function OrucBilgisiLessonScreen() {
    const { id } = useLocalSearchParams();

    // Ensure id is a string
    const lessonId = Array.isArray(id) ? id[0] : id;

    // Find lesson in static data
    const lesson = orucBilgisi.find(l => l.id.toString() === lessonId);

    if (!lesson) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Lesson not found.</Text>
            </View>
        );
    }

    return (
        <OrucBilgisiLesson
            lesson={lesson}
            lessonId={lessonId}
        />
    );
}
