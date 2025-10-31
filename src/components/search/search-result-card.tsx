import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { MessageCircle, HardDrive } from 'lucide-react-native'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import type { SearchResult } from '@/src/lib/types/search'
import type { Asset } from '@/src/lib/types/asset'
import { CustomChip, getAssetStatusClasses } from '../assets/custom-chip'
import { StyledCard } from '../common/styled-card'

interface SearchResultCardProps {
  result: SearchResult
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function SearchResultCard({ result }: SearchResultCardProps) {
  const { colors, theme } = useTheme()
  const router = useRouter()
  const isDark = theme === 'dark'
  const scale = useSharedValue(1)

  const handlePress = () => {
    if (result.type === 'post') {
      router.push(`/(home)/posts/${result.id}` as any)
    } else {
      router.push(`/(home)/assets/${result.id}` as any)
    }
  }

  const handlePressIn = () => {
    scale.value = withSpring(0.95)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const isPost = result.type === 'post'
  const isAsset = result.type === 'asset'

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <StyledCard className="p-3 mx-2 mb-2">
        <View style={styles.container}>
          {/* Icon and type indicator */}
          <View style={styles.iconContainer}>
            {isPost ? (
              <MessageCircle
                size={20}
                color={colors.primary}
                strokeWidth={2}
              />
            ) : (
              <HardDrive
                size={20}
                color={colors.success}
                strokeWidth={2}
              />
            )}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Title with type chip */}
            <View style={styles.titleRow}>
              <Text
                className="font-inter-semibold text-base flex-1"
                style={{ color: colors.foreground }}
                numberOfLines={1}
              >
                {result.title}
              </Text>
              <CustomChip
                size="xs"
                className={isPost ? 'bg-primary text-primary-foreground' : 'bg-success text-success-foreground'}
                style={styles.typeChip}
              >
                {isPost ? 'Post' : 'Asset'}
              </CustomChip>
            </View>

            {/* Description */}
            <Text
              className="text-sm"
              style={[styles.description, { color: colors.defaultForeground }]}
              numberOfLines={2}
            >
              {result.description}
            </Text>

            {/* Asset-specific info */}
            {isAsset && result.originalData && (
              <View style={styles.assetInfo}>
                <View style={styles.assetStatusRow}>
                  <CustomChip
                    size="xs"
                    {...getAssetStatusClasses((result.originalData as Asset).status, isDark)}
                  >
                    {(result.originalData as Asset).status}
                  </CustomChip>
                  {(result.originalData as Asset).current_value && (
                    <Text
                      className="text-xs font-semibold"
                      style={[styles.assetValue, { color: colors.foreground }]}
                    >
                      ${(result.originalData as Asset).current_value.toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Date */}
            <Text
              className="text-xs"
              style={[styles.date, { color: colors.defaultForeground }]}
            >
              {result.date}
            </Text>
          </View>
        </View>
      </StyledCard>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  typeChip: {
    marginLeft: 8,
  },
  description: {
    marginBottom: 8,
    lineHeight: 18,
  },
  assetInfo: {
    marginBottom: 8,
  },
  assetStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assetValue: {
    textAlign: 'right',
  },
  date: {
    opacity: 0.6,
  },
})
