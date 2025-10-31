import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { ChevronLeft, UserPen } from 'lucide-react-native'
import type React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActionButton } from './action-button'

interface ProfileHeaderProps {
  title?: string
}

export function ProfileHeader({ title = 'Edit Profile' }: ProfileHeaderProps) {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const handleBackPress = () => {
    router.back()
  }

  // Device-specific padding
  const getDevicePadding = () => {
    return Platform.select({
      ios: insets.top,
      android: insets.top + 5,
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

        {/* Center - Title and Icon */}
        <View style={styles.centerSection}>
          <View style={styles.titleContainer}>
            <UserPen size={24} color="#2864f0" style={styles.titleIcon} />
            <Text
              className="font-orbitron-semibold"
              style={[styles.title, { color: colors.foreground }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        </View>

        {/* Right - Empty Space */}
        <View style={styles.button} />
      </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    minHeight: 80,
    paddingHorizontal: 8,
    paddingBottom: 8,
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
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 300,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
})
