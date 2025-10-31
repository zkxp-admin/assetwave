import type { ThemeConfig } from 'heroui-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { pastelThemes, type ThemeId } from '../themes/pastel-themes';

type ColorScheme = 'light' | 'dark' | 'system';

interface AppThemeContextType {
  currentThemeId: ThemeId;
  currentTheme: ThemeConfig | undefined;
  setThemeById: (id: ThemeId) => void;
  availableThemes: typeof pastelThemes;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  resolvedColorScheme: 'light' | 'dark';
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined
);
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('default');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('system');
  const systemColorScheme = useColorScheme();

  const setThemeById = useCallback((id: ThemeId) => {
    setCurrentThemeId(id);
  }, []);

  const currentTheme = useMemo(() => {
    const theme = pastelThemes.find((t) => t.id === currentThemeId);
    return theme?.config;
  }, [currentThemeId]);

  const resolvedColorScheme = useMemo(() => {
    if (colorScheme === 'system') {
      return systemColorScheme || 'light';
    }
    return colorScheme;
  }, [colorScheme, systemColorScheme]);

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      // This will trigger a re-render when system theme changes
      // The resolvedColorScheme will automatically update
    });

    return () => subscription?.remove();
  }, []);

  const value = useMemo(
    () => ({
      currentThemeId,
      currentTheme,
      setThemeById,
      availableThemes: pastelThemes,
      colorScheme,
      setColorScheme,
      resolvedColorScheme,
    }),
    [currentThemeId, currentTheme, setThemeById, colorScheme, resolvedColorScheme]
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
};
