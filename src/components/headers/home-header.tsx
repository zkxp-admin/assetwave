import { useProfile } from '../../lib/profile/hooks/use-profile'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { Avatar, useTheme } from 'heroui-native'
import { Bell } from 'lucide-react-native'
import React, { useCallback } from 'react'
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActionButton } from '../headers/action-button'

interface Tab {
  key: string
  title: string
}

interface HomeHeaderProps {
  tabs?: Tab[]
  activeTab?: string
  onTabChange?: (tabKey: string) => void
  children?: React.ReactNode
}

export function HomeHeader({
  tabs = [],
  activeTab,
  onTabChange,
  children,
}: HomeHeaderProps) {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user, initials, isLoaded } = useProfile()
  const [indicatorPosition] = React.useState(new Animated.Value(0))

  // Simple hardcoded widths for dashboard and newsfeed
  const getIndicatorWidth = (tabKey: string) => {
    return tabKey === 'dashboard' ? 100 : 93
  }

  const getIndicatorPosition = useCallback((tabKey: string) => {
    // Centered layout: Dashboard at ~100px, Newsfeed at ~220px from left
    return tabKey === 'dashboard' ? 90 : 245
  }, [])

  // Animate indicator when activeTab changes
  React.useEffect(() => {
    if (activeTab) {
      const targetPosition = getIndicatorPosition(activeTab)
      Animated.spring(indicatorPosition, {
        toValue: targetPosition,
        useNativeDriver: false,
        tension: 68,
        friction: 10,
      }).start()
    }
  }, [activeTab, indicatorPosition, getIndicatorPosition])

  const handleNotificationsPress = () => {
    router.push('/(home)/notifications')
  }

  const handleProfilePress = () => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.push('/(home)/profile')
  }

  const handleTabPress = (tabKey: string) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onTabChange?.(tabKey)
  }

  // Device-specific padding
  const getDevicePadding = () => {
    return Platform.select({
      ios: insets.top,
      android: insets.top + 5,
    })
  }

  return (
    <View style={styles.container}>
      {/* Content that extends behind header */}
      {children}

      {/* Fixed Header with blur effect */}
      <BlurView
        className="overflow-hidden rounded-b-3xl"
        intensity={50}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.blurContainer, { paddingTop: getDevicePadding() }]}
        experimentalBlurMethod="dimezisBlurView"
      >
        {/* Surface-2 overlay matching dashboard cards */}
        {!isDark && <View className="absolute inset-0 bg-white/50 rounded-b-3xl border-b border-zinc-500/20" />}
        {isDark && <View className="absolute inset-0 bg-zinc-500/15 rounded-b-3xl border-b border-zinc-500/20" />}

        {/* Main Header */}
        <View style={styles.header}>
          {/* Left - Profile */}
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Avatar size="md" alt="User Profile">
              {user?.imageUrl ? <Avatar.Image source={{ uri: user.imageUrl }} /> : null}
              <Avatar.Fallback color="accent" className="text-lg">
                {initials}
              </Avatar.Fallback>
            </Avatar>
          </TouchableOpacity>

          {/* Center - Title */}
          <Text
            className="font-orbitron-semibold"
            style={[styles.title, { color: colors.foreground }]}
          >
            AssetWave
          </Text>

          {/* Right - Actions */}
          <View style={styles.actionsContainer}>
            <ActionButton icon={Bell} badgeCount={3} onPress={handleNotificationsPress} />
          </View>
        </View>

        {/* Tab Bar */}
        {tabs.length > 0 && (
          <View style={[styles.tabBar, { backgroundColor: 'transparent' }]}>
            <View style={styles.tabsWrapper}>
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.key)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Switch to ${tab.title} tab`}
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color: colors.foreground,
                          fontWeight: isActive ? '700' : '400',
                          opacity: isActive ? 1 : 0.7,
                        },
                      ]}
                    >
                      {tab.title}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* Animated indicator */}
            {activeTab && (
              <Animated.View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: '#2864f0',
                    width: getIndicatorWidth(activeTab),
                    left: indicatorPosition,
                  },
                ]}
              />
            )}
          </View>
        )}
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    minHeight: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    position: 'absolute',
    left: 14,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    borderBottomWidth: 0,
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 4,
    gap: 60,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 1.5,
  },
})
