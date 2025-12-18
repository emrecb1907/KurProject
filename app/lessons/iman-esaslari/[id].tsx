
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { imanEsaslari } from '@/data/imanEsaslari';
import ImanEsaslariLesson from '@/components/lessons/ImanEsaslariLesson';

export default function ImanEsaslariLessonScreen() {
    const { id } = useLocalSearchParams();

    // Ensure id is a string
    const lessonId = Array.isArray(id) ? id[0] : id;

    // Find lesson in static data
    const lesson = imanEsaslari.find(l => l.id.toString() === lessonId);

    if (!lesson) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Ders bulunamadı.</Text>
            </View>
        );
    }

    return (
        <ImanEsaslariLesson
            lesson={lesson}
            lessonId={lessonId}
        />
    );
}
