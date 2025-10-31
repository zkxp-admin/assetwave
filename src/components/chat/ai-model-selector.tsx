import { Ionicons } from '@expo/vector-icons';
import { Button, useTheme } from 'heroui-native';
import { View } from 'react-native';
import { Package, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAtom } from 'jotai';

import { AppText } from '../app-text';
import { agents } from '../../lib/chat/constants';
import { selectedAgentAtom } from '../../lib/chat/chat-atoms';
//import { useAIAgentSelector } from '../../lib/chat/ai-agent-selector-context';

export function AIAgentSelector() {
  const { colors } = useTheme();
  const [selectedAgent] = useAtom(selectedAgentAtom);
  //const { bottomSheetRef } = useAIAgentSelector();

  // Get current selected agent data
  const selectedAgentData = agents.find((agent) => agent.key === selectedAgent) || agents[0];

  // Handle opening the agent selector bottom sheet
  const handlePress = () => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Open the bottom sheet
    //bottomSheetRef.current?.open();
  };

  // Render agent icon
  const renderAgentIcon = (iconType: string, size: number) => {
    switch (iconType) {
      case 'Package':
        return <Package size={size} color={colors.foreground} />;
      case 'Shield':
        return <Shield size={size} color={colors.foreground} />;
      default:
        return <Package size={size} color={colors.foreground} />;
    }
  };

  return (
    <Button
      variant="tertiary"
      size="sm"
      className="flex-row items-center gap-1.5"
      onPress={handlePress}
    >
      <View className="flex-row items-center gap-1.5">
        {renderAgentIcon(selectedAgentData.icon, 14)}
        <AppText className="text-xs font-medium text-foreground">
          {selectedAgentData.label}
        </AppText>
        <Ionicons name="chevron-down" size={12} color={colors.mutedForeground} />
      </View>
    </Button>
  );
}
