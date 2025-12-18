
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { siyerDersleri } from '@/data/siyerDersleri';
import SiyerLesson from '@/components/lessons/SiyerLesson';

export default function SiyerLessonScreen() {
    const { id } = useLocalSearchParams();

    // Ensure id is a string
    const lessonId = Array.isArray(id) ? id[0] : id;

    // Find lesson in static data
    const lesson = siyerDersleri.find(l => l.id.toString() === lessonId);

    if (!lesson) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Ders bulunamadı.</Text>
            </View>
        );
    }

    return (
        <SiyerLesson
            lesson={lesson}
            lessonId={lessonId}
        />
    );
}
