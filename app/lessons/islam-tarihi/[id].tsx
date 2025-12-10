
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import IslamicHistoryLesson from '../../../src/components/lessons/IslamicHistoryLesson';
import { getLessonContent } from '../../../src/data/islamicHistory/lessonLoader';

export default function IslamicHistoryLessonScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { i18n } = useTranslation();

    // Ensure id is a string
    const lessonId = Array.isArray(id) ? id[0] : id;
    const lesson = getLessonContent(lessonId, i18n.language);

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
