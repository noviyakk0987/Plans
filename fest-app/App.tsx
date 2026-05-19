import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Unbounded_500Medium, Unbounded_700Bold } from '@expo-google-fonts/unbounded';
import { initSentry } from './src/utils/sentry';
import { PerfumeLandingScreen } from './src/screens/PerfumeLandingScreen';

initSentry();

export default function App() {
  useFonts({ Unbounded_500Medium, Unbounded_700Bold });

  return (
    <SafeAreaProvider>
      <PerfumeLandingScreen />
    </SafeAreaProvider>
  );
}
