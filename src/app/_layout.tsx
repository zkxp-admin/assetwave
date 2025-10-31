import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_600SemiBold,
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
  Orbitron_900Black,
} from '@expo-google-fonts/orbitron';
import { Slot } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { Provider } from 'jotai';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../global.css';
import '../polyfills.js';
import { AppThemeProvider, useAppTheme } from '../contexts/app-theme-context';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function ThemedLayout() {
  const { currentTheme, resolvedColorScheme } = useAppTheme();

  return (
    <HeroUINativeProvider
      config={{
        colorScheme: resolvedColorScheme,
        theme: currentTheme,
        textProps: {
          allowFontScaling: false,
        },
      }}
    >
      <Slot />
    </HeroUINativeProvider>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_600SemiBold,
    Orbitron_700Bold,
    Orbitron_800ExtraBold,
    Orbitron_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={styles.root}>
            <Provider>
              <KeyboardProvider>
                <AppThemeProvider>
                  <ThemedLayout />
                </AppThemeProvider>
              </KeyboardProvider>
            </Provider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
