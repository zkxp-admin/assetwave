import * as Haptics from 'expo-haptics'
import { useTheme } from 'heroui-native'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface FilterChipsProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
  disabled?: boolean
}

const FILTERS = ['All', 'Assets', 'Posts']

export function FilterChips({ selectedFilter, onFilterChange, disabled = false }: FilterChipsProps) {
  const { colors, isDark } = useTheme()

  const handleFilterPress = (filter: string) => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onFilterChange(filter)
    }
  }

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      {FILTERS.map((filter) => {
        const isActive = filter === selectedFilter
        return (
          <TouchableOpacity
            key={filter}
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? '#2864f0'
                  : isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                opacity: disabled && !isActive ? 0.5 : 1,
              },
            ]}
            onPress={() => handleFilterPress(filter)}
            activeOpacity={0.7}
            disabled={disabled && !isActive}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive ? '#ffffff' : colors.foreground,
                  fontWeight: isActive ? '600' : '500',
                },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  scrollContainer: {
    gap: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 2,
  },
  chipText: {
    fontSize: 14,
  },
})
