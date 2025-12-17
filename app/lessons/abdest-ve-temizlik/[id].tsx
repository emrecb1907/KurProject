
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { abdestVeTemizlik } from '@/data/abdestVeTemizlik';
import AbdestVeTemizlikLesson from '@/components/lessons/AbdestVeTemizlikLesson';

export default function AbdestVeTemizlikLessonScreen() {
    const { id } = useLocalSearchParams();

    // Ensure id is a string
    const lessonId = Array.isArray(id) ? id[0] : id;

    // Find lesson in static data
    const lesson = abdestVeTemizlik.find(l => l.id.toString() === lessonId);

    if (!lesson) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Ders bulunamadı.</Text>
            </View>
        );
    }

    return (
        <AbdestVeTemizlikLesson
            lesson={lesson}
            lessonId={lessonId}
        />
    );
}
