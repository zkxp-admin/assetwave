import { useTheme } from 'heroui-native'
import { Search, X } from 'lucide-react-native'
import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search anything...',
}: SearchBarProps) {
  const { colors, isDark } = useTheme()
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChangeText('')
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' },
      ]}
    >
      <Search
        size={18}
        color={isFocused ? '#2864f0' : colors.mutedForeground}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        selectionColor={colors.foreground}
        style={[styles.input, { color: colors.foreground }]}
        autoFocus={true}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <TouchableOpacity
        onPress={handleClear}
        style={[styles.clearButton, { opacity: value.length > 0 ? 1 : 0 }]}
        activeOpacity={0.7}
        disabled={value.length === 0}
      >
        <X size={16} color={colors.mutedForeground} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
