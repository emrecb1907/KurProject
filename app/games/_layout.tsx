import { Stack } from 'expo-router';
import { colors } from '@constants/colors';

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="letters/index" />
      <Stack.Screen name="letters/[id]" />
      <Stack.Screen name="letters/result" />
      
      <Stack.Screen name="vocabulary/index" />
      <Stack.Screen name="vocabulary/[id]" />
      <Stack.Screen name="vocabulary/result" />
      
      <Stack.Screen name="verses/index" />
      <Stack.Screen name="verses/[id]" />
      <Stack.Screen name="verses/result" />
      
      {/* Quick Quiz - Coming Soon */}
      {/* <Stack.Screen name="quick-quiz/index" /> */}
      {/* <Stack.Screen name="quick-quiz/[id]" /> */}
      {/* <Stack.Screen name="quick-quiz/result" /> */}
    </Stack>
  );
}

