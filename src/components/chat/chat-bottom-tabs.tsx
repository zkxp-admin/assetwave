import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { useAtom } from 'jotai'
import { Bot, HardDrive, Home, Search } from 'lucide-react-native'
import type React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { activeTabAtom, previousTabAtom } from '../../lib/atoms/navigation-atoms'

interface Tab {
  key: string
  label: string
  icon: React.ComponentType<{
    size?: number
    color?: string
    strokeWidth?: number
    opacity?: number
  }>
  path: string
}

// Helper function to create tab paths consistently
const createTabPath = (route: string): string =>
  `/(home)${route === 'index' ? '' : `/${route}`}`

const TABS: Tab[] = [
  { key: 'home', label: 'Home', icon: Home, path: createTabPath('index') },
  { key: 'chat', label: 'Ai', icon: Bot, path: createTabPath('chat') },
  { key: 'assets', label: 'Assets', icon: HardDrive, path: createTabPath('assets') },
  { key: 'search', label: 'Search', icon: Search, path: createTabPath('search') },
]

interface ChatBottomTabsProps {
  keyboardHeight: SharedValue<number>
}

export function ChatBottomTabs({ keyboardHeight }: ChatBottomTabsProps) {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)
  const [, setPreviousTab] = useAtom(previousTabAtom)

  const handleTabPress = (tabKey: string, path: string) => {
    try {
      // Add haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      // Store current active tab as previous tab before navigating to chat
      if (tabKey === 'chat' && activeTab !== 'chat') {
        setPreviousTab(activeTab)
      }

      setActiveTab(tabKey)

      // Special handling for home tab - always navigate to home page
      if (tabKey === 'home') {
        router.replace('/(home)/' as any)
        return
      }

      // Don't navigate if already on the active tab (for other tabs)
      if (activeTab === tabKey) {
        return
      }

      // Use replace instead of push for immediate transition without animation
      router.replace(path as any)
    } catch {
      // Revert active tab on navigation failure
      setActiveTab(activeTab)
    }
  }

  // Animated style to hide tabs when keyboard is open
  // Note: keyboardHeight has a minimum of 20px (KEYBOARD_OFFSET), so check against that threshold
  const animatedStyle = useAnimatedStyle(() => {
    const isKeyboardOpen = keyboardHeight.value > 20; // Keyboard is open when > KEYBOARD_OFFSET
    return {
      transform: [
        {
          translateY: withTiming(isKeyboardOpen ? 100 : 0, { duration: 250 }),
        },
      ],
      opacity: withTiming(isKeyboardOpen ? 0 : 1, { duration: 250 }),
    }
  })

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView
        className="overflow-hidden rounded-t-3xl"
        intensity={50}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.blurContainer, { paddingBottom: insets.bottom }]}
        experimentalBlurMethod="dimezisBlurView"
      >
        {/* Surface-2 overlay matching dashboard cards */}
        {!isDark && <View className="absolute inset-0 bg-white/50 rounded-t-3xl" />}
        {isDark && <View className="absolute inset-0 bg-zinc-500/15 rounded-t-3xl" />}

        {/* Border overlay with NativeWind */}
        <View className="absolute inset-0 bg-transparent border-t border-gray-500/20 rounded-t-3xl" />

        <View style={styles.tabsContainer}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const IconComponent = tab.icon

            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => handleTabPress(tab.key, tab.path)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Navigate to ${tab.label}`}
                accessibilityState={{ selected: isActive }}
              >
                <IconComponent
                  size={18}
                  color={isActive ? '#2864f0' : colors.foreground}
                  strokeWidth={isActive ? 2.5 : 2}
                  opacity={isActive ? 1 : 0.7}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: colors.foreground,
                      opacity: isActive ? 1 : 0.7,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </BlurView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  blurContainer: {
    paddingTop: 4,
    paddingHorizontal: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingHorizontal: 6,
    paddingBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
})

// Export constants for use in other components
export { TABS }
