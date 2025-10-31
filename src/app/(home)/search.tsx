import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'heroui-native'
import { SearchHeader } from '../../components/headers/search-header'
import { SearchResultsList } from '../../components/search/search-results-list'
import { useSearch } from '@/src/lib/search/hooks/use-search'
import type { ResultType } from '@/src/lib/types/search'

export default function SearchScreen() {
  const { colors } = useTheme()
  const [query, setQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  // Convert filter name to type
  const filterType = useMemo((): ResultType[] => {
    if (selectedFilter === 'Posts') return ['post']
    if (selectedFilter === 'Assets') return ['asset']
    return [] // All
  }, [selectedFilter])

  // Use search hook
  const { results, isLoading, error, hasMore, loadMore } = useSearch({
    query,
    filters: filterType,
  })

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        resultCount={results.length}
      >
        {/* Search results content */}
        <View style={styles.resultsContainer}>
          <SearchResultsList
            results={results}
            isLoading={isLoading}
            error={error}
            hasMore={hasMore}
            onLoadMore={loadMore}
            query={query}
          />
        </View>
      </SearchHeader>

      {/* Disabled state for filters when no query */}
      {query.trim() === '' && (
        <View style={styles.filterDisabledOverlay} pointerEvents="none" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
  },
  filterDisabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    pointerEvents: 'none',
  },
})
