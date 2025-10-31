import * as Haptics from 'expo-haptics'
import { useTheme } from 'heroui-native'
import type { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ActionButtonProps {
  icon: LucideIcon
  badgeCount?: number
  onPress?: () => void
}

export function ActionButton({ icon: Icon, badgeCount, onPress }: ActionButtonProps) {
  const { colors, theme } = useTheme()
  const isDark = theme === 'dark'

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress?.()
  }

  return (
    <TouchableOpacity
      className={`bg-gray-500/${isDark ? '20' : '10'} rounded-full`}
      style={styles.actionButton}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Icon size={24} color={colors.foreground} />
      {badgeCount !== undefined && badgeCount > 0 && (
        <View
          className="bg-red-600 border border-red-600 dark:border-gray-900 rounded-full"
          style={styles.badge}
        >
          <Text className="text-white" style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -5,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
})
