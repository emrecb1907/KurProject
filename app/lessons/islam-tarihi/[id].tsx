
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import IslamicHistoryLesson from '../../../src/components/lessons/IslamicHistoryLesson';
import { getIslamicHistoryLesson } from '../../../src/data/islamicHistory/content';

export default function IslamicHistoryLessonScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Ensure id is a string
    const lessonId = Array.isArray(id) ? id[0] : id;
    const lesson = getIslamicHistoryLesson(lessonId);

    if (!lesson) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Ders bulunamadı.</Text>
            </View>
        );
    }

    return (
        <IslamicHistoryLesson
            lesson={lesson}
            lessonId={lessonId}
        />
    );
}
