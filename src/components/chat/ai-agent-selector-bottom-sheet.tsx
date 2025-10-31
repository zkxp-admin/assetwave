import { useMemo, useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'heroui-native';
import { View, Pressable, StyleSheet } from 'react-native';
import { Package, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAtom } from 'jotai';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

import { AppText } from '../app-text';
import { agents } from '../../lib/chat/constants';
import { selectedAgentAtom } from '../../lib/chat/chat-atoms';

export function AIAgentSelectorBottomSheet() {
  const { colors } = useTheme();
  const [selectedAgent, setSelectedAgent] = useAtom(selectedAgentAtom);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['45%'], []);

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
  );

  // Handle agent selection
  const handleSelectAgent = (agentKey: string) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Update state immediately
    setSelectedAgent(agentKey);

    // Close bottom sheet after delay
    setTimeout(() => {
      bottomSheetRef.current?.close();
    }, 500);
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
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.panel }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <AppText style={[styles.title, { color: colors.foreground }]}>
            Select AI Agent
          </AppText>
          <AppText style={[styles.description, { color: colors.mutedForeground }]}>
            Choose the AI agent for your conversation
          </AppText>
        </View>

        <View style={styles.agentList}>
          {agents.map((agent) => {
            const isSelected = selectedAgent === agent.key;

            return (
              <Pressable
                key={agent.key}
                onPress={() => handleSelectAgent(agent.key)}
                style={[
                  styles.agentItem,
                  {
                    backgroundColor: colors.background,
                    borderColor: isSelected ? colors.accent : colors.border,
                    borderWidth: isSelected ? 1 : 1,
                  },
                ]}
              >
                <View style={styles.agentContent}>
                  <View style={styles.agentInfo}>
                    <View style={styles.agentHeader}>
                      <View style={{ opacity: 1 }}>
                        {renderAgentIcon(agent.icon, 18)}
                      </View>
                      <AppText
                        style={[
                          styles.agentLabel,
                          {
                            color: isSelected ? colors.accent : colors.foreground,
                          },
                        ]}
                      >
                        {agent.label}
                      </AppText>
                    </View>
                    <AppText
                      style={[
                        styles.agentDescription,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {agent.description}
                    </AppText>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  agentList: {
    gap: 12,
  },
  agentItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  agentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentInfo: {
    flex: 1,
    gap: 6,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  agentLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  agentDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
