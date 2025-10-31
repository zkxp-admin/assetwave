import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { useTheme } from 'heroui-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAssetQuery } from '@/src/lib/assets/hooks/use-assets'
import { validateAsset } from '@/src/lib/assets/utils/asset-validation'
import { AssetDetail } from '@/src/components/assets/asset-detail'
import { AssetsHeader } from '@/src/components/headers/assets-header'
import { getSafeAssetName } from '@/src/lib/types/asset'

export default function AssetDetailScreen() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: asset, isLoading } = useAssetQuery(id || '')
  const [showAssetName, setShowAssetName] = useState(false)
  const [hasValidationWarning, setHasValidationWarning] = useState(false)

  // Validate asset when it loads
  useEffect(() => {
    if (asset) {
      const validation = validateAsset(asset)
      if (!validation.isValid) {
        setHasValidationWarning(true)
        console.warn('Asset validation issues:', validation.issues)
      }
    }
  }, [asset])


  const handleEdit = () => {
    router.push({
      pathname: '/(home)/assets/edit',
      params: { id: asset?.id },
    })
  }

  const handleBack = () => {
    router.back()
  }

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y
    setShowAssetName(scrollY > 200)
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    )
  }

  if (!asset) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
        <View style={styles.errorContainer}>
          <Text className="font-inter-semibold text-lg" style={[styles.errorTitle, { color: colors.foreground }]}>
            Asset Not Found
          </Text>
          <Text className="text-sm" style={[styles.errorMessage, { color: colors.defaultForeground }]}>
            The asset you're looking for doesn't exist or has been removed.
          </Text>
          <Text 
            className="text-sm font-medium" 
            style={[styles.backLink, { color: colors.accent }]}
            onPress={handleBack}
          >
            ← Back to Assets
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AssetsHeader
        showBackButton={true}
        title={showAssetName ? getSafeAssetName(asset) : 'AssetWave'}
        onEdit={handleEdit}
      >
        {hasValidationWarning && (
          <View style={[styles.warningBanner, { backgroundColor: colors.warning }]}>
            <Text className="text-xs" style={[styles.warningText, { color: colors.foreground }]}>
              ⚠️ This asset has incomplete data. Some fields may be missing or invalid.
            </Text>
          </View>
        )}
        <AssetDetail
          asset={asset}
          onScroll={handleScroll}
        />
      </AssetsHeader>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  backLink: {
    textAlign: 'center',
  },
  warningBanner: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  warningText: {
    textAlign: 'center',
    fontSize: 12,
  },
})
