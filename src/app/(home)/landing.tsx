import { useRouter } from 'expo-router';
import { Button } from 'heroui-native';
import { StyleSheet, Text, View } from 'react-native';

import Iridescence from '../../components/iridescence-background/Iridescence';
import { SafeAreaView } from '../../components/safe-area-view';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <Iridescence />
      </View>
      <View style={styles.content}>
        <View style={styles.blurBackground}>
          <View style={styles.titleContainer}>
            <Text className="text-white text-5xl font-orbitron-medium text-center" style={styles.assetWaveShadow}>AssetWave</Text>
            <View style={styles.topLeftCorner} />
            <View style={styles.topRightCorner} />
            <View style={styles.bottomLeftCorner} />
            <View style={styles.bottomRightCorner} />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
            size="lg"
            onPress={() => router.push('/(auth)/sign-in')}
            style={styles.button}
          >
              Sign In
            </Button>
          <Button
            variant="tertiary"
            size="lg"
            onPress={() => router.push('/explore')}
            style={styles.button}
          >
              Explore
            </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
 
  },
  content: {
    position: 'absolute',
    top: 250,
    left: 0,
    right: 0,
  },
  blurBackground: {
    paddingHorizontal: 25,
    paddingVertical: 55,
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    gap: 8,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    overflow: 'hidden',
  },
  button: {
    borderRadius: 32,
  },
  titleContainer: {
    position: 'relative',
  },
  assetWaveShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  topLeftCorner: {
    position: 'absolute',
    top: -25,
    left: -35,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.8)',
  },
  topRightCorner: {
    position: 'absolute',
    top: -25,
    right: -35,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.8)',
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: -25,
    left: -35,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.8)',
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: -25,
    right: -35,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.8)',
  },
});

