import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { ChevronLeft } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAssetQuery, useUpdateAssetMutation } from '@/src/lib/assets/hooks/use-assets'
import { AssetForm } from '@/src/components/assets/asset-form'
import { ConfirmDelete } from '@/src/components/assets/confirm-delete'
import type { AssetFormData } from '@/src/lib/types/asset'

export default function EditAssetScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: asset, isLoading: isLoadingAsset } = useAssetQuery(id || '')
  const updateMutation = useUpdateAssetMutation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: AssetFormData) => {
    if (!asset) return

    setIsLoading(true)
    try {
      await updateMutation.mutateAsync({ assetId: asset.id, assetData: data })

      // Navigate back to assets list after successful update
      router.back()
    } catch (error) {
      console.error('Failed to update asset:', error)
      alert('Failed to update asset. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoadingAsset) {
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
      <View style={[styles.container, { backgroundColor: colors.background }]} />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <ConfirmDelete assetId={id as string} iconOnly />
          </View>
        </View>
      </View>

      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text
          className="font-orbitron-semibold text-xl"
          style={[styles.title, { color: colors.foreground }]}
        >
          Edit Asset
        </Text>
        <Text
          className="text-sm"
          style={[styles.subtitle, { color: colors.defaultForeground }]}
        >
          Update the details for {asset?.name || 'this asset'}
        </Text>
      </View>

      <AssetForm
        asset={asset}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
})
