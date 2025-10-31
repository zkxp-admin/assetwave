import React, { useEffect, forwardRef } from 'react';
import { StyleSheet, View, Keyboard, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatInputRow } from './chat-input-row';

interface ChatInputProps {
  chat: any; // The chat hook from useChat
  input: string;
  setInput: (value: string) => void;
  canSubmit: boolean;
  handleSend: () => void;
}

export const ChatInput = forwardRef<TextInput, ChatInputProps>(({ chat, input, setInput, canSubmit, handleSend }, ref) => {
  const insets = useSafeAreaInsets();

  // Consistent bottom padding with safe area
  const bottomPadding = Math.max(insets.bottom, 8);

  // Cleanup keyboard on unmount
  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {/* Shared input row component */}
      <View>
        <ChatInputRow
          ref={ref}
          chat={chat}
          input={input}
          setInput={setInput}
          canSubmit={canSubmit}
          handleSend={handleSend}
        />
      </View>
    </View>
  );
});

ChatInput.displayName = 'ChatInput';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
