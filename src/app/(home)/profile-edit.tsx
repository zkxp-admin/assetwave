import React, { useState, useRef } from 'react'
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useTheme } from 'heroui-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import BottomSheet from '@gorhom/bottom-sheet'
import { useProfile } from '@/src/lib/profile/hooks/use-profile'
import { ProfileEditForm } from '@/src/components/profile/profile-edit-form'
import { ProfilePhotoBottomSheet } from '@/src/components/profile/profile-photo-bottom-sheet'
import { ProfileHeader } from '@/src/components/headers/profile-header'
import type { ProfileFormData } from '@/src/lib/types/user-profile'

export default function ProfileEditScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { user, updateProfile, uploadProfileImage } = useProfile()
  const [isLoading, setIsLoading] = useState(false)

  // Photo picker state
  const photoBottomSheetRef = useRef<BottomSheet>(null)
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)
  const [isPickingImage, setIsPickingImage] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleOpenPhotoSheet = () => {
    photoBottomSheetRef.current?.expand()
  }

  const handleChooseFromLibrary = async () => {
    try {
      setIsPickingImage(true)

      // Request media library permissions
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow access to your photo library to change your profile image')
        setIsPickingImage(false)
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri
        setSelectedImageUri(imageUri)

        // Upload to Clerk
        await uploadImageToClerk(imageUri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image. Please try again.')
    } finally {
      setIsPickingImage(false)
    }
  }

  const handleTakePhoto = async () => {
    try {
      setIsPickingImage(true)

      // Request camera permissions
      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow access to your camera to take a profile photo')
        setIsPickingImage(false)
        return
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri
        setSelectedImageUri(imageUri)

        // Upload to Clerk
        await uploadImageToClerk(imageUri)
      }
    } catch (error) {
      console.error('Error taking photo:', error)
      Alert.alert('Error', 'Failed to take photo. Please try again.')
    } finally {
      setIsPickingImage(false)
    }
  }

  const handleRemovePhoto = async () => {
    try {
      setIsUploadingImage(true)

      // Set null image in Clerk (remove profile image)
      await uploadProfileImage('')

      setSelectedImageUri(null)
      Alert.alert('Success', 'Profile photo removed')
    } catch (error) {
      console.error('Error removing photo:', error)
      Alert.alert('Error', 'Failed to remove photo. Please try again.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Placeholder function for future Clerk image upload integration
  const uploadImageToClerk = async (imageUri: string) => {
    try {
      setIsUploadingImage(true)

      // TODO: Implement actual Clerk image upload
      console.log('Placeholder: Would upload image to Clerk:', imageUri)

      // Simulate upload delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Placeholder success feedback
      Alert.alert('Placeholder', 'Image upload to Clerk - Coming Soon!')
      photoBottomSheetRef.current?.close()

    } catch (error) {
      console.error('Placeholder upload error:', error)
      Alert.alert('Placeholder Error', 'This is a placeholder - Clerk upload not implemented yet')
      setSelectedImageUri(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const handleSave = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      await updateProfile(data)
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            router.back()
          },
        },
      ])
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProfileHeader />
      <ProfileEditForm
        initialData={user}
        isLoading={isLoading}
        onSave={handleSave}
        onCancel={handleCancel}
        onAvatarPress={handleOpenPhotoSheet}
        selectedImageUri={selectedImageUri}
        isPhotoLoading={isPickingImage || isUploadingImage}
      />

      {/* Profile Photo Bottom Sheet at screen level */}
      <ProfilePhotoBottomSheet
        bottomSheetRef={photoBottomSheetRef}
        onChooseLibrary={handleChooseFromLibrary}
        onTakePhoto={handleTakePhoto}
        onRemove={handleRemovePhoto}
        hasCurrentPhoto={!!(selectedImageUri || user?.imageUrl)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
