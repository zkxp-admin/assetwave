import { useRouter } from 'expo-router'
import React from 'react'
import { useCreateAssetMutation } from '@/src/lib/assets/hooks/use-assets'
import { AssetForm } from '@/src/components/assets/asset-form'
import { AssetsHeader } from '@/src/components/headers/assets-header'
import type { AssetFormData } from '@/src/lib/types/asset'

export default function CreateAssetScreen() {
  const router = useRouter()
  const createMutation = useCreateAssetMutation()

  const handleSubmit = async (data: AssetFormData) => {
    try {
      await createMutation.mutateAsync(data)
      // After successful creation, navigate back to assets list
      router.back()
    } catch (error) {
      console.error('Error creating asset:', error)
      alert('Error creating asset. Please try again.')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <AssetsHeader variant="create" subtitle="Add a new asset to your inventory">
      <AssetForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createMutation.isPending}
      />
    </AssetsHeader>
  )
}
