import { Stack, usePathname } from 'expo-router';
import { useTheme } from 'heroui-native';
import { useCallback } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import LogoDark from '../../../assets/logo-dark.png';
import LogoLight from '../../../assets/logo-light.png';
import { ThemeToggle } from '../../components/theme-toggle';
import { BottomTabs } from '@/src/components/common/bottom-tabs';
import { AuthGuard } from '../../components/auth/auth-guard'; 

export default function Layout() {
  const { theme, colors, isDark } = useTheme();

  const pathname = usePathname();

  // Hide bottom tabs on chat-related pages and profile edit page
  const shouldShowBottomTabs = !pathname.includes('/chat') && !pathname.includes('/profile-edit');

  const _renderTitle = () => {
    return (
      <Image
        source={isDark ? LogoLight : LogoDark}
        style={styles.logo}
        resizeMode="contain"
      />
    );
  };

  const _renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <AuthGuard>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerTitleAlign: 'center',
            headerTransparent: Platform.select({
              ios: true,
              android: false,
            }),
            headerBlurEffect: theme === 'dark' ? 'dark' : 'light',
            headerTintColor: colors.foreground,
            headerStyle: {
              backgroundColor: Platform.select({
                ios: undefined,
                android: colors.background,
              }),
            },
            headerTitleStyle: {
              fontFamily: 'Inter_600SemiBold',
            },
            headerRight: _renderThemeToggle,
            headerBackButtonDisplayMode: 'minimal',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
            contentStyle: {
              backgroundColor: colors.background,
            },
            // Simplified animations to prevent ghosting
            animation: 'none',
            animationTypeForReplace: 'push',
          }}
        >
      <Stack.Screen
        name="index"
        options={{ 
          headerShown: false,
          animation: 'none',
        }}
      />
      <Stack.Screen name="components" />
      <Stack.Screen
        name="themes/index"
        options={{ headerShown: true, headerTitle: 'Themes' }}
      />
      <Stack.Screen
        name="showcases"
        options={{
          headerShown:
            Platform.OS === 'ios' ? pathname === '/showcases' : false,
          headerTitle: 'Showcases',
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          headerShown: true,
          headerTitle: 'Explore',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
          animation: 'default',
        }}
      />
      <Stack.Screen
        name="profile-edit"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
          animation: 'default',
        }}
      />
      <Stack.Screen
        name="chat-history"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="assets"
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="assets/[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="assets/create"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
        </Stack>

        {/* Bottom tabs at layout level - hidden on chat page */}
        {shouldShowBottomTabs && <BottomTabs />}
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 24,
  },
});
