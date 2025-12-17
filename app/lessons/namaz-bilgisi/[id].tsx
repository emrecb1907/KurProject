
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { namazBilgisi } from '@/data/namazBilgisi';
import NamazBilgisiLesson from '@/components/lessons/NamazBilgisiLesson';

export default function NamazBilgisiLessonScreen() {
    const { id } = useLocalSearchParams();

    // Ensure id is a string
    const lessonId = Array.isArray(id) ? id[0] : id;

    // Find lesson in static data
    const lesson = namazBilgisi.find(l => l.id.toString() === lessonId);

    if (!lesson) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Ders bulunamadı.</Text>
            </View>
        );
    }

    return (
        <NamazBilgisiLesson
            lesson={lesson}
            lessonId={lessonId}
        />
    );
}
