import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { ChevronLeft, Edit, HardDrive, Plus } from 'lucide-react-native'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActionButton } from './action-button'

interface AssetsHeaderProps {
  assetCount?: number
  children?: React.ReactNode
  showBackButton?: boolean
  title?: string
  subtitle?: string
  onEdit?: () => void
  onCreateAsset?: () => void
  variant?: 'default' | 'create'
}

export function AssetsHeader({
  assetCount = 0,
  children,
  showBackButton = false,
  title = 'Assets',
  subtitle,
  onEdit,
  onCreateAsset,
  variant = 'default',
}: AssetsHeaderProps) {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const handleBackPress = () => {
    router.back()
  }

  const handleCreateAssetPress = () => {
    onCreateAsset?.()
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
        {!isDark && (
          <View className="absolute inset-0 bg-white/50 rounded-b-3xl border-b border-zinc-500/20" />
        )}
        {isDark && (
          <View className="absolute inset-0 bg-zinc-500/15 rounded-b-3xl border-b border-zinc-500/20" />
        )}


        <View style={styles.header}>
          {/* Left - Back Button or Empty Space */}
          {(showBackButton || variant === 'create') ? (
            <ActionButton icon={ChevronLeft} onPress={handleBackPress} />
          ) : (
            <View style={styles.button} />
          )}

          {/* Center - Title and Subtitle/Count */}
          <View style={styles.centerSection}>
            <View style={styles.titleContainer}>
              <View style={styles.iconContainer}>
                <HardDrive
                  size={24}
                  color="#2864f0"
                  style={styles.titleIcon}
                />
              </View>
              <Text
                className="font-orbitron-semibold"
                style={[styles.title, { color: colors.foreground }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {variant === 'create' ? 'Create Asset' : title}
              </Text>
            </View>
            {subtitle && (
              <Text
                className="text-xs"
                style={[styles.count, { color: colors.defaultForeground }]}
              >
                {subtitle}
              </Text>
            )}
            {variant !== 'create' && !(showBackButton || subtitle) && (
              <Text
                className="text-xs"
                style={[styles.count, { color: colors.defaultForeground }]}
              >
                {assetCount} assets found
              </Text>
            )}
          </View>

          {/* Right - Create Asset Button or Edit Button or Empty Space */}
          {variant === 'create' ? (
            <View style={styles.button} />
          ) : !showBackButton ? (
            <ActionButton icon={Plus} onPress={handleCreateAssetPress} />
          ) : (
            <ActionButton icon={Edit} onPress={onEdit} />
          )}
        </View>
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
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  count: {
    marginTop: 2,
    opacity: 0.8,
  },
})
