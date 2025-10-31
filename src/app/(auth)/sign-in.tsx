import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Card } from 'heroui-native';

import { AuthProvider, useAuthContext } from '../../components/auth/auth-context';
import { EmailStepContent } from '../../components/auth/email-step-content';
import { EmailSuccessStepContent } from '../../components/auth/email-success-step-content';
import { CodeStepContent } from '../../components/auth/code-step-content';
import { AUTH_CONSTANTS } from '../../lib/auth/constants/auth-constants';

function SignInScreen() {
  const { 
    authState, 
    currentEmail, 
    resetAuth, 
    isSignedIn, 
    isLoaded,
    handleEmailSentContinue,
  } = useAuthContext();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/(home)');
    }
  }, [isLoaded, isSignedIn, router]);

  // Redirect to index page after successful authentication
  useEffect(() => {
    if (authState === AUTH_CONSTANTS.STATES.SUCCESS) {
      router.replace('/(home)');
    }
  }, [authState, router]);

  // Determine which step to show
  const isEmailStep = !currentEmail || authState === AUTH_CONSTANTS.STATES.EMAIL_INPUT;
  const isEmailSuccessStep = currentEmail && authState === AUTH_CONSTANTS.STATES.EMAIL_SENT;
  const isCodeStep = currentEmail && authState === AUTH_CONSTANTS.STATES.OTP_INPUT;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      enabled={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-4 justify-center -mt-60">
          <Card surfaceVariant="2" className="rounded-2xl w-full p-6">
            <Card.Body>
              {/* App Title */}
              <View className="items-center mb-16">
                <Text className="text-white text-4xl tracking-wide font-orbitron-semibold text-center shadow-sm">
                  AssetWave
                </Text>
              </View>

              {/* Auth Steps Container */}
              <View className="w-full">
                {/* Email Input Step */}
                {isEmailStep && (
                  <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                  >
                    <EmailStepContent />
                  </Animated.View>
                )}

                {/* Email Sent Success Step */}
                {isEmailSuccessStep && (
                  <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                  >
                    <EmailSuccessStepContent
                      email={currentEmail}
                      onContinue={handleEmailSentContinue}
                    />
                  </Animated.View>
                )}

                {/* OTP Code Input Step */}
                {isCodeStep && (
                  <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                  >
                    <CodeStepContent
                      sentEmail={currentEmail}
                      onBack={resetAuth}
                    />
                  </Animated.View>
                )}

              </View>
            </Card.Body>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default function SignInRoute() {
  return (
    <AuthProvider>
      <Stack.Screen
        options={{
          title: 'Sign In',
          headerTransparent: true,
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <SignInScreen />
    </AuthProvider>
  );
}
