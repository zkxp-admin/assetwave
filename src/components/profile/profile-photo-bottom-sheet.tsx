import { useCallback } from 'react'
import { useTheme, Button } from 'heroui-native'
import { View, StyleSheet, Alert } from 'react-native'
import * as Haptics from 'expo-haptics'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { Image as ImageIcon, Camera, Trash2 } from 'lucide-react-native'
import { AppText } from '../app-text'

export interface ProfilePhotoBottomSheetProps {
  onChooseLibrary: () => void
  onTakePhoto: () => void
  onRemove: () => void
  bottomSheetRef: React.RefObject<BottomSheet | null>
  hasCurrentPhoto: boolean
}

export function ProfilePhotoBottomSheet({
  onChooseLibrary,
  onTakePhoto,
  onRemove,
  bottomSheetRef,
  hasCurrentPhoto,
}: ProfilePhotoBottomSheetProps) {
  const { colors } = useTheme()

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  )

  // Handle option selection
  const handleSelectOption = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    callback()
    setTimeout(() => {
      bottomSheetRef.current?.close()
    }, 300)
  }

  // Handle remove with confirmation
  const handleRemovePhoto = () => {
    Alert.alert(
      'Remove Profile Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => handleSelectOption(onRemove),
        },
      ]
    )
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.panel }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <AppText style={[styles.title, { color: colors.foreground }]}>
            Change Profile Photo
          </AppText>
          <AppText style={[styles.unavailableMessage, { color: colors.defaultForeground }]}>
            This feature is coming soon
          </AppText>
        </View>

        {/* Choose from Library - Disabled */}
        <Button
          variant="secondary"
          isDisabled
          className="w-full justify-start flex-row gap-3"
        >
          <ImageIcon size={20} color={colors.defaultForeground} />
          <AppText style={{ color: colors.defaultForeground, fontSize: 15, fontWeight: '500' }}>
            Choose from Library
          </AppText>
        </Button>

        {/* Take Photo - Disabled */}
        <Button
          variant="secondary"
          isDisabled
          className="w-full justify-start flex-row gap-3"
        >
          <Camera size={20} color={colors.defaultForeground} />
          <AppText style={{ color: colors.defaultForeground, fontSize: 15, fontWeight: '500' }}>
            Take Photo
          </AppText>
        </Button>

        {/* Remove Photo - Disabled */}
        {hasCurrentPhoto && (
          <Button
            variant="secondary"
            isDisabled
            className="w-full justify-start flex-row gap-3"
          >
            <Trash2 size={20} color={colors.defaultForeground} />
            <AppText style={{ color: colors.defaultForeground, fontSize: 15, fontWeight: '500' }}>
              Remove Current Picture
            </AppText>
          </Button>
        )}
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 14,
    paddingBottom: 32,
    gap: 10,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  unavailableMessage: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '400',
  },
})
