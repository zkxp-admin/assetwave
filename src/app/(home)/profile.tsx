import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { useTheme, Avatar, Button, Divider } from 'heroui-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, ChevronRight, Code, LogOut, Wifi, WifiOff, Edit3, Database, Wallet } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ThemeToggle } from '../../components/theme-toggle';
import { useAppTheme } from '../../contexts/app-theme-context';
import { useNetworkAwareAuth } from '../../lib/use-network-aware-auth';
import { useProfile } from '../../lib/profile/hooks/use-profile';
import { seedDataService } from '../../lib/services/seed';
import { CustomChip } from '../../components/assets/custom-chip';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const router = useRouter();
  const { signOut } = useAuth();
  const { isConnected, connectionType } = useNetworkAwareAuth();
  const { user, displayName, initials, isLoaded } = useProfile();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Get user data from profile hook
  const userData = {
    name: displayName,
    username: user?.username || '',
    email: user?.email || '',
    imageUrl: user?.imageUrl,
    initials,
  };

  const handleEditProfilePress = () => {
    router.push('/(home)/profile-edit');
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
    // Navigate to settings
  };

  const handleDevSignInPress = () => {
    router.push('/(auth)/sign-in');
  };

  const handleWalletToggle = () => {
    setIsWalletConnected(!isWalletConnected);
    console.log(isWalletConnected ? 'Disconnect Wallet' : 'Connect Wallet pressed');
  };

  const handleSeedCompleteDataPress = async () => {
    if (!user?.id || !user?.email) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    Alert.alert(
      'Seed Complete Test Data',
      'This will create:\n• User profile & tenant\n• 5 test assets\n• Tracking history\n• 8 test posts\n\nContinue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Seed Everything',
          style: 'default',
          onPress: async () => {
            setIsSeeding(true);

            try {
              const result = await seedDataService.seedTestData(user.id, user.email!, user.username);

              if (result.success) {
                // Show success alert
                Alert.alert(
                  'Success! 🎉',
                  `All test data has been seeded successfully!\n\n` +
                  `Tenant ID: ${result.tenantId}\n` +
                  `Assets Created: ${result.assetsCreated}\n` +
                  `Posts Created: ${result.postsCreated}`
                );
              } else {
                Alert.alert('Error', result.error || result.message);
              }
            } catch (error) {
              console.error('Seed error:', error);
              Alert.alert('Error', 'Failed to seed data. Please try again.');
            } finally {
              setIsSeeding(false);
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Avatar alt="User Profile" className="w-24 h-24 mb-4">
            {userData.imageUrl ? (
              <Avatar.Image source={{ uri: userData.imageUrl }} />
            ) : null}
            <Avatar.Fallback color="accent" className="text-2xl">
              {userData.initials}
            </Avatar.Fallback>
          </Avatar>

          <Text className="font-orbitron-semibold text-2xl" style={[styles.userName, { color: colors.foreground }]}>
            {userData.name}
          </Text>

          {userData.username && (
            <Text className="text-base" style={[styles.username, { color: colors.defaultForeground }]}>
              @{userData.username}
            </Text>
          )}

          {userData.email && (
            <Text className="text-sm" style={[styles.email, { color: colors.defaultForeground }]}>
              {userData.email}
            </Text>
          )}

          {/* Wallet Status Chip */}
          <View style={styles.chipContainer}>
            <CustomChip
              size="sm"
              backgroundClass={isWalletConnected ? 'bg-green-500' : 'bg-red-500'}
              textClass="text-white"
            >
              {isWalletConnected ? '● Connected to Solana' : '● Disconnected from Solana'}
            </CustomChip>
          </View>
        </View>

        <Divider className="my-6" />

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            variant="secondary"
            size="lg"
            onPress={handleEditProfilePress}
            className="w-full justify-start mb-3"
          >
            <View className="flex-row items-center">
              <Edit3 size={20} color={colors.foreground} style={{ marginRight: 12 }} />
              <Text className="text-lg" style={{ color: colors.foreground }}>
                Edit Profile
              </Text>
            </View>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onPress={handleWalletToggle}
            className="w-full justify-start mb-3"
          >
            <View className="flex-row items-center">
              <Wallet size={20} color={colors.foreground} style={{ marginRight: 12 }} />
              <Text className="text-lg" style={{ color: colors.foreground }}>
                {isWalletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
              </Text>
            </View>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onPress={handleSettingsPress}
            className="w-full justify-start mb-3"
          >
            <View className="flex-row items-center">
              <Settings size={20} color={colors.foreground} style={{ marginRight: 12 }} />
              <Text className="text-lg" style={{ color: colors.foreground }}>
                Settings
              </Text>
            </View>
          </Button>

          <Button
            variant="tertiary"
            size="lg"
            onPress={handleSignOut}
            className="w-full justify-start"
          >
            <View className="flex-row items-center">
              <LogOut size={20} color={colors.foreground} style={{ marginRight: 12 }} />
              <Text className="text-lg" style={{ color: colors.foreground }}>
                Sign Out
              </Text>
            </View>
          </Button>
        </View>

        <Divider className="my-6" />

        {/* Theme Section */}
        <View style={styles.themeSection}>
          <View style={styles.themeHeader}>
            <Text className="font-inter-semibold text-lg" style={{ color: colors.foreground }}>
              Appearance
            </Text>
            <Text className="text-sm" style={{ color: colors.defaultForeground }}>
              Customize your app's appearance
            </Text>
          </View>
          
          <View style={styles.themeToggleContainer}>
            <ThemeToggle />
            <Text className="text-sm ml-3" style={{ color: colors.defaultForeground }}>
              Current: {colorScheme === 'system' ? 'System' : colorScheme === 'light' ? 'Light' : 'Dark'} Mode
            </Text>
          </View>
        </View>

        <Divider className="my-6" />

        {/* Developer Section */}
        <View style={styles.devSection}>
          <View style={styles.devHeader}>
            <Text className="font-inter-semibold text-lg" style={{ color: colors.foreground }}>
              Developer
            </Text>
            <Text className="text-sm" style={{ color: colors.defaultForeground }}>
              Development and testing tools
            </Text>
          </View>

          {/* Network Status */}
          <View className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 mb-3">
            <View className="flex-row items-center">
              {isConnected ? (
                <Wifi size={20} color={colors.success} />
              ) : (
                <WifiOff size={20} color={colors.danger} />
              )}
              <Text className="text-base font-inter-semibold ml-2" style={{ color: colors.foreground }}>
                Network Status: {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            {connectionType && (
              <Text className="text-sm mt-1" style={{ color: colors.defaultForeground }}>
                Connection Type: {connectionType}
              </Text>
            )}
          </View>

          <Button
            variant="secondary"
            size="lg"
            onPress={handleDevSignInPress}
            className="w-full justify-start mb-3"
          >
            <View className="flex-row items-center justify-between w-full">
              <View className="flex-row items-center">
                <Code size={20} color={colors.foreground} style={{ marginRight: 12 }} />
                <Text className="text-lg" style={{ color: colors.foreground }}>
                  Sign In Screen (Dev)
                </Text>
              </View>
              <ChevronRight size={20} color={colors.defaultForeground} />
            </View>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onPress={handleSeedCompleteDataPress}
            isDisabled={isSeeding}
            className="w-full justify-start"
          >
            <View className="flex-row items-center justify-between w-full">
              <View className="flex-row items-center">
                <Database size={20} color={colors.foreground} style={{ marginRight: 12 }} />
                <Text className="text-lg" style={{ color: colors.foreground }}>
                  {isSeeding ? 'Seeding...' : 'Seed Complete Test Data'}
                </Text>
              </View>
              {!isSeeding && <ChevronRight size={20} color={colors.defaultForeground} />}
              {isSeeding && <ActivityIndicator />}
            </View>
          </Button>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    marginBottom: 4,
  },
  username: {
    marginBottom: 2,
  },
  email: {
    opacity: 0.8,
    marginBottom: 12,
  },
  chipContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  actionsSection: {
    marginBottom: 20,
  },
  themeSection: {
    marginBottom: 20,
  },
  themeHeader: {
    marginBottom: 16,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devSection: {
    marginBottom: 20,
  },
  devHeader: {
    marginBottom: 16,
  },
});

