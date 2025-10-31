import type React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getAssetStatusChipClasses } from '@/src/lib/types/asset'

/**
 * Get NativeWind classes for asset status chips based on status and theme
 * @param status - The asset status (active, maintenance, inactive, retired)
 * @param isDark - Whether the current theme is dark mode
 * @returns Object with backgroundClass and textClass properties
 */
export const getAssetStatusClasses = (status: string, isDark: boolean = false) => {
  return getAssetStatusChipClasses(status, isDark)
}

interface CustomChipProps {
  /** The content to display inside the chip */
  children: React.ReactNode
  /** Size variant of the chip */
  size?: 'sm' | 'md' | 'lg'
  /** NativeWind background class (e.g., 'bg-blue-500') */
  backgroundClass?: string
  /** NativeWind text class (e.g., 'text-white') */
  textClass?: string
  /** Border radius for rounded corners */
  borderRadius?: number
  /** Horizontal padding override */
  paddingHorizontal?: number
  /** Vertical padding override */
  paddingVertical?: number
  /** Additional style overrides */
  style?: any
}

export function CustomChip({
  children,
  size = 'sm',
  backgroundClass,
  textClass,
  borderRadius = 12,
  paddingHorizontal,
  paddingVertical,
  style,
}: CustomChipProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: paddingHorizontal ?? 8,
          paddingVertical: paddingVertical ?? 4,
          fontSize: 12,
        }
      case 'md':
        return {
          paddingHorizontal: paddingHorizontal ?? 12,
          paddingVertical: paddingVertical ?? 6,
          fontSize: 14,
        }
      case 'lg':
        return {
          paddingHorizontal: paddingHorizontal ?? 16,
          paddingVertical: paddingVertical ?? 8,
          fontSize: 16,
        }
      default:
        return {
          paddingHorizontal: paddingHorizontal ?? 8,
          paddingVertical: paddingVertical ?? 4,
          fontSize: 12,
        }
    }
  }

  const sizeStyles = getSizeStyles()

  return (
    <View
      className={`${backgroundClass || 'bg-gray-400'}`}
      style={[
        styles.container,
        {
          borderRadius,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      <Text
        className={`${textClass || 'text-white'} font-medium text-center`}
        style={[
          {
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
