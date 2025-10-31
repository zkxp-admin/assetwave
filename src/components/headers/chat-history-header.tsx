import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { ChevronLeft, History } from 'lucide-react-native'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActionButton } from './action-button'

export function ChatHistoryHeader() {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const handleBackPress = () => {
    // Use router.back() to trigger proper reverse slide animation
    router.back()
  }

  // Device-specific padding
  const getDevicePadding = () => {
    return Platform.select({
      ios: insets.top,
      android: insets.top + 2,
    })
  }

  return (
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

      <View style={styles.header}>
        {/* Left - Back Button */}
        <ActionButton icon={ChevronLeft} onPress={handleBackPress} />

        {/* Center - Title */}
        <View style={styles.titleContainer}>
          <History size={24} color="#2864f0" style={styles.titleIcon} />
          <Text
            className="font-orbitron-semibold"
            style={[styles.title, { color: colors.foreground }]}
          >
            Chat History
          </Text>
        </View>

        {/* Right - Placeholder for balance */}
        <View style={styles.button} />
      </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
})
