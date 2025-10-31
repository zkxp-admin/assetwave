import { useTheme } from 'heroui-native'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { AppText } from '../app-text'

export function TypingIndicator() {
  const { colors } = useTheme()
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      )
    }

    const animation = Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 150),
      animate(dot3, 300),
    ])

    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { borderColor: colors.border }]}>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: colors.mutedForeground,
                transform: [{ translateY: dot1 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: colors.mutedForeground,
                transform: [{ translateY: dot2 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: colors.mutedForeground,
                transform: [{ translateY: dot3 }],
              },
            ]}
          />
        </View>
        <AppText style={[styles.text, { color: colors.mutedForeground }]}>
          Thinking...
        </AppText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '75%',
    borderWidth: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    opacity: 0.7,
  },
})
