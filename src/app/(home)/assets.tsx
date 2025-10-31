import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { useTheme, Button } from 'heroui-native'
import { useAssetsQuery } from '@/src/lib/assets/hooks/use-assets'
import { useProfileQuery } from '@/src/lib/profile/hooks/use-profile-query'
import { AssetList } from '@/src/components/assets/asset-list'
import { AssetsHeader } from '@/src/components/headers/assets-header'
import type { Asset } from '@/src/lib/types/asset'

export default function AssetsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { data: profile, isLoading: isProfileLoading } = useProfileQuery()
  const { data: assets = [], isLoading: isAssetsLoading, refetch } = useAssetsQuery()

  // Refetch assets when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  )

  const handleViewAsset = (asset: Asset) => {
    console.log('Viewing asset:', asset.name)
    // Navigation is now handled in AssetCard component
  }

  const handleCreateAsset = () => {
    router.push('/(home)/assets/create')
  }

  const isLoading = isProfileLoading || isAssetsLoading

  if (isLoading) {
    return (
      <View className="bg-page-bg-light dark:bg-page-bg-dark" style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={[styles.loadingText, { color: colors.defaultForeground }]}>
            Loading assets...
          </Text>
        </View>
      </View>
    )
  }

  // No profile yet - user needs to seed data first
  if (!profile) {
    return (
      <View className="bg-page-bg-light dark:bg-page-bg-dark" style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.emptyText, { color: colors.foreground }]}>
            Welcome to AssetWave! 👋
          </Text>
          <Text style={[styles.emptyDetails, { color: colors.defaultForeground }]}>
            Get started by creating test assets:
          </Text>
          <Text style={[styles.instructionText, { color: colors.defaultForeground }]}>
            1. Go to your Profile tab{'\n'}
            2. Scroll to Developer section{'\n'}
            3. Click "Seed Test Data"{'\n'}
            4. Come back here to see your assets
          </Text>
          <Button
            variant="primary"
            onPress={() => router.push('/(home)/profile')}
            className="mt-6"
          >
            Go to Profile
          </Button>
        </View>
      </View>
    )
  }

  // Profile exists but no assets
  if (assets.length === 0 && !isAssetsLoading) {
    return (
      <View className="bg-page-bg-light dark:bg-page-bg-dark" style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.emptyText, { color: colors.foreground }]}>
            No Assets Yet
          </Text>
          <Text style={[styles.emptyDetails, { color: colors.defaultForeground }]}>
            You can create assets manually or seed test data from your Profile.
          </Text>
          {profile?.tenant_id && (
            <Text style={[styles.tenantInfo, { color: colors.defaultForeground }]}>
              Tenant ID: {profile.tenant_id.substring(0, 8)}...
            </Text>
          )}
          <Button
            variant="primary"
            onPress={() => router.push('/(home)/profile')}
            className="mt-6"
          >
            Go to Profile
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className="bg-page-bg-light dark:bg-page-bg-dark" style={styles.container}>
      <AssetsHeader
        assetCount={assets.length}
        onCreateAsset={handleCreateAsset}
      >
        <AssetList
          assets={assets}
          onViewAsset={handleViewAsset}
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
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyDetails: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 16,
    lineHeight: 24,
    marginHorizontal: 12,
  },
  tenantInfo: {
    fontSize: 12,
    marginTop: 16,
    fontFamily: 'monospace',
  },
})
