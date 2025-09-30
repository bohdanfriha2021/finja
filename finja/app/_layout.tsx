// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppDataProvider } from '@/context/AppDataContext';

export default function RootLayout() {
  return (
    <AppDataProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#f5f7fa' }
      }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppDataProvider>
  );
}