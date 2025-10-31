import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { MapPin } from 'lucide-react-native'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import type { Asset } from '@/src/lib/types/asset'
import { CustomChip, getAssetStatusClasses } from './custom-chip'
import { StyledCard } from '../common/styled-card'

interface AssetCardProps {
  asset: Asset
  onView?: (asset: Asset) => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function AssetCard({ asset, onView }: AssetCardProps) {
  const { colors, theme } = useTheme()
  const router = useRouter()
  const isDark = theme === 'dark'
  const scale = useSharedValue(1)

  const handlePress = () => {
    // Navigate to asset detail screen
    router.push(`/(home)/assets/${asset.id}` as any)
    onView?.(asset)
  }

  const handlePressIn = () => {
    scale.value = withSpring(0.95)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <StyledCard className="p-4 mb-2 mx-2">
        <View style={styles.headerRow}>
            <Text
              className="font-inter-semibold text-lg"
              style={[styles.assetName, { color: colors.foreground }]}
            >
              {asset.name}
            </Text>
            <CustomChip
              size="sm"
              {...getAssetStatusClasses(asset.status, isDark)}
              style={styles.statusChip}
            >
              {asset.status}
            </CustomChip>
          </View>

          <View style={styles.contentRow}>
            <View style={styles.leftSection}>
              <Text
                className="text-base"
                style={[styles.manufacturerText, { color: colors.defaultForeground }]}
              >
                {asset.manufacturer} • {asset.model}
              </Text>
              {asset.location && (
                <View style={styles.locationRow}>
                  <MapPin
                    size={12}
                    color={colors.defaultForeground}
                    style={styles.locationIcon}
                  />
                  <Text
                    className="text-sm"
                    style={[styles.locationText, { color: colors.defaultForeground }]}
                  >
                    {asset.location}
                  </Text>
                </View>
              )}
            </View>

            {asset.current_value && (
              <Text
                className="text-sm font-semibold"
                style={[styles.value, { color: colors.foreground }]}
              >
                ${asset.current_value.toLocaleString()}
              </Text>
            )}
          </View>
      </StyledCard>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  assetName: {
    flex: 1,
  },
  manufacturerText: {
    opacity: 0.8,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
    opacity: 0.8,
  },
  locationText: {
    opacity: 0.6,
  },
  value: {
    textAlign: 'right',
  },
  statusChip: {
    marginLeft: 8,
  },
})
