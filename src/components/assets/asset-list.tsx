import React from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import type { Asset } from '@/src/lib/types/asset'
import { AssetCard } from './asset-card'

interface AssetListProps {
  assets: Asset[]
  onViewAsset?: (asset: Asset) => void
}

export function AssetList({ assets, onViewAsset }: AssetListProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onView={onViewAsset} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.select({
      ios: 120,
      android: 100,
    }),
    paddingBottom: 100,
  },
})
