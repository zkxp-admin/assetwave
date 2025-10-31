import { BlurView } from 'expo-blur'
import { useTheme } from 'heroui-native'
import { Search } from 'lucide-react-native'
import type React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FilterChips } from '../search/filter-chips'
import { SearchBar } from '../search/search-bar'

interface SearchHeaderProps {
  query: string
  onQueryChange: (query: string) => void
  selectedFilter: string
  onFilterChange: (filter: string) => void
  resultCount?: number
  children?: React.ReactNode
}

export function SearchHeader({
  query,
  onQueryChange,
  selectedFilter,
  onFilterChange,
  resultCount,
  children,
}: SearchHeaderProps) {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()

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
        {!isDark && <View className="absolute inset-0 bg-white/50 rounded-b-3xl border-b border-zinc-500/20" />}
        {isDark && <View className="absolute inset-0 bg-zinc-500/15 rounded-b-3xl border-b border-zinc-500/20" />}
        {/* Top Row - Title */}
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Search size={24} color="#2864f0" style={styles.titleIcon} />
            <Text
              className="font-orbitron-semibold"
              style={[styles.title, { color: colors.foreground }]}
            >
              Search
            </Text>
          </View>
        </View>

        {/* Middle Section - Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search anything..."
          />
        </View>

        {/* Bottom Section - Filter Chips */}
        <View style={styles.filterSection}>
          <FilterChips
            selectedFilter={selectedFilter}
            onFilterChange={onFilterChange}
            disabled={!query.trim()}
          />
        </View>

        {/* Optional Result Count */}
        {resultCount !== undefined && (
          <View style={styles.resultCountContainer}>
            <Text
              className="text-xs"
              style={[styles.resultCount, { color: colors.defaultForeground }]}
            >
              {resultCount} result{resultCount !== 1 ? 's' : ''} found
            </Text>
          </View>
        )}
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
    minHeight: 120,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  searchSection: {
    paddingBottom: 6,
  },
  filterSection: {
    paddingBottom: 6,
  },
  resultCountContainer: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  resultCount: {
    opacity: 0.8,
  },
})
