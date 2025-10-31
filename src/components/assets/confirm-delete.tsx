import { useRouter } from 'expo-router'
import { Button, useTheme } from 'heroui-native'
import { Trash2, Check, X } from 'lucide-react-native'
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useAssets } from '@/src/lib/assets/hooks/use-assets'

interface ConfirmDeleteProps {
  assetId: string
  redirectTo?: string
  className?: string
  iconOnly?: boolean
}

export function ConfirmDelete({
  assetId,
  redirectTo = '/(home)/assets',
  className = '',
  iconOnly = false,
}: ConfirmDeleteProps) {
  const router = useRouter()
  const { deleteAsset } = useAssets()
  const { colors } = useTheme()
  const [stage, setStage] = useState<'initial' | 'confirm'>('initial')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClick = async () => {
    if (stage === 'initial') {
      // Haptic feedback when entering confirmation stage
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setStage('confirm')
      return
    }

    setIsDeleting(true)
    try {
      // Haptic feedback before deletion
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      await deleteAsset(assetId)
      router.push(redirectTo as any)
    } catch (error) {
      console.error('Error deleting asset:', error)
      // Haptic feedback on error
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      alert('Error deleting asset. Please try again.')
      setStage('initial')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    // Haptic feedback when cancelling
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStage('initial')
  }

  if (iconOnly) {
    return (
      <View className={className}>
        {stage === 'confirm' ? (
          <View className="flex-row gap-2">
            <Button
              variant="danger"
              onPress={handleClick}
              isDisabled={isDeleting}
              isIconOnly
            >
              <Check size={20} color="white" />
            </Button>
            <Button
              variant="ghost"
              onPress={handleCancel}
              isDisabled={isDeleting}
              isIconOnly
            >
              <X size={20} color={colors.foreground} />
            </Button>
          </View>
        ) : (
          <Button
            onPress={handleClick}
            isIconOnly
            className="bg-red-500/30"
          >
            <Trash2 size={20} color="#dc2626" />
          </Button>
        )}
      </View>
    )
  }

  return (
    <View className={className}>
      {stage === 'confirm' ? (
        <View className="flex-row gap-2">
          <Button
            variant="danger"
            onPress={handleClick}
            isDisabled={isDeleting}
            className="flex-1"
          >
            <Check size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
              {isDeleting ? 'Deleting...' : 'Confirm'}
            </Text>
          </Button>
          <Button
            variant="ghost"
            onPress={handleCancel}
            isDisabled={isDeleting}
            className="flex-1"
          >
            <X size={16} color={colors.foreground} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: '500', color: colors.foreground }}>
              Cancel
            </Text>
          </Button>
        </View>
      ) : (
        <Button
          onPress={handleClick}
          className="bg-red-500/30 text-red-500"
        >
            <Trash2 size={16} color="#dc2626" />
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#dc2626' }}>Delete</Text>
        </Button>
      )}
    </View>
  )
}
