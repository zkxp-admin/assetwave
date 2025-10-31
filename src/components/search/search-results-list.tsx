import { useTheme } from 'heroui-native'
import { AlertCircle, MessageCircle } from 'lucide-react-native'
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Platform, Keyboard, Pressable } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import type { SearchResult } from '@/src/lib/types/search'
import { SearchResultCard } from './search-result-card'

interface SearchResultsListProps {
  results: SearchResult[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  onLoadMore: () => void
  query: string
}

export function SearchResultsList({
  results,
  isLoading,
  error,
  hasMore,
  onLoadMore,
  query,
}: SearchResultsListProps) {
  const { colors } = useTheme()

  // No query entered
  if (!query.trim()) {
    return (
      <Pressable style={styles.emptyContainer} onPress={() => Keyboard.dismiss()}>
        <MessageCircle size={48} color={colors.defaultForeground} opacity={0.3} />
        <Text
          className="text-base font-inter-medium text-center mt-4"
          style={{ color: colors.defaultForeground }}
        >
          Start typing to search
        </Text>
        <Text
          className="text-sm text-center mt-2"
          style={{ color: colors.defaultForeground, opacity: 0.6 }}
        >
          Search posts and assets
        </Text>
      </Pressable>
    )
  }

  // Loading state (initial search)
  if (isLoading && results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.foreground} />
        <Text
          className="text-base font-inter-medium text-center mt-4"
          style={{ color: colors.foreground }}
        >
          Searching...
        </Text>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <AlertCircle size={48} color={colors.danger} opacity={0.7} />
        <Text
          className="text-base font-inter-medium text-center mt-4"
          style={{ color: colors.danger }}
        >
          Search failed
        </Text>
        <Text
          className="text-sm text-center mt-2"
          style={{ color: colors.defaultForeground, opacity: 0.6 }}
        >
          {error.message || 'An error occurred while searching'}
        </Text>
      </View>
    )
  }

  // No results found
  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MessageCircle size={48} color={colors.defaultForeground} opacity={0.3} />
        <Text
          className="text-base font-inter-medium text-center mt-4"
          style={{ color: colors.defaultForeground }}
        >
          No results found
        </Text>
        <Text
          className="text-sm text-center mt-2"
          style={{ color: colors.defaultForeground, opacity: 0.6 }}
        >
          Try different keywords
        </Text>
      </View>
    )
  }

  return (
    <FlashList
      data={results}
      renderItem={({ item }) => <SearchResultCard result={item} />}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        hasMore && !isLoading ? (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color={colors.foreground} />
            <Text
              className="text-sm ml-2"
              style={{ color: colors.defaultForeground }}
            >
              Loading more...
            </Text>
          </View>
        ) : hasMore ? null : results.length > 0 ? (
          <View style={styles.endContainer}>
            <Text
              className="text-sm text-center"
              style={{ color: colors.defaultForeground, opacity: 0.6 }}
            >
              No more results
            </Text>
          </View>
        ) : null
      }
      contentContainerStyle={styles.contentContainer}
    />
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingTop: Platform.select({
      ios: 215,
      android: 100,
    }),
    paddingBottom: 16,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  endContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
})
