import { Send } from 'lucide-react-native';
import { Button } from 'heroui-native';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, View, useColorScheme } from 'react-native';

interface ChatInputRowProps {
  chat: any; // The chat hook from useChat
  input: string;
  setInput: (value: string) => void;
  canSubmit: boolean;
  handleSend: () => void;
}

export const ChatInputRow = forwardRef<TextInput, ChatInputRowProps>(
  ({ chat, input, setInput, canSubmit, handleSend }, ref) => {
    const colorScheme = useColorScheme();

    // Background color based on theme
    const backgroundColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

    // Text color based on theme for better contrast
    const textColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';

    // Border color same as background for seamless look
    const borderColor = backgroundColor;

    // Icon color based on theme
    const iconColor = colorScheme === 'dark' ? '#000000' : '#ffffff';

    return (
      <View style={styles.inputRow}>
        <TextInput
          ref={ref}
          placeholder={'Ask Anything'}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          multiline={true}
          numberOfLines={5}
          returnKeyType="send"
          editable={chat.status !== 'submitted'}
          style={[styles.textInput, { backgroundColor, color: textColor, borderColor }]}
        />

        {/* Send Button */}
        <Button
          variant="primary"
          isIconOnly
          onPress={handleSend}
          isDisabled={!canSubmit}
          style={styles.sendButton}
        >
            <Send
              size={18}
              color={iconColor}
            />
        </Button>
      </View>
    );
  }
);

ChatInputRow.displayName = 'ChatInputRow';

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 21,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 50,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
