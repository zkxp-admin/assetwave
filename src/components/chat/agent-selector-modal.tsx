import { useTheme } from 'heroui-native'
import { useAtom } from 'jotai'
import { Package, Shield, Briefcase, DollarSign } from 'lucide-react-native'
import { Modal, StyleSheet, Text, View, Pressable, FlatList } from 'react-native'
import * as Haptics from 'expo-haptics'

import { agents } from '../../lib/chat/constants'
import { selectedAgentAtom } from '../../lib/chat/chat-atoms'

interface AgentSelectorModalProps {
  visible: boolean
  onClose: () => void
  topPosition: number
}

export function AgentSelectorModal({
  visible,
  onClose,
  topPosition,
}: AgentSelectorModalProps) {
  const { colors, isDark } = useTheme()
  const [selectedAgent, setSelectedAgent] = useAtom(selectedAgentAtom)

  const handleSelectAgent = (agentKey: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedAgent(agentKey)
    onClose()
  }

  const renderAgentIcon = (iconType: string, size: number) => {
    switch (iconType) {
      case 'Package':
        return <Package size={size} color={colors.foreground} />
      case 'Shield':
        return <Shield size={size} color={colors.foreground} />
      case 'Briefcase':
        return <Briefcase size={size} color={colors.foreground} />
      case 'DollarSign':
        return <DollarSign size={size} color={colors.foreground} />
      default:
        return <Package size={size} color={colors.foreground} />
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          { backgroundColor: 'transparent' },
        ] as any}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.agentSelectorMenu,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              top: topPosition,
            },
          ] as any}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Menu overlay for visual consistency */}
          {!isDark && (
            <View className="absolute inset-0 bg-white/50 rounded-2xl" />
          )}
          {isDark && (
            <View className="absolute inset-0 bg-zinc-500/15 rounded-2xl" />
          )}

          <View style={[styles.menuHeader, { borderBottomColor: colors.border }]}>
            <Text
              style={[styles.menuTitle, { color: colors.foreground }]}
            >
              Select Agent
            </Text>
          </View>
          <FlatList
            data={agents}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            contentContainerStyle={styles.agentListContainer}
            renderItem={({ item }) => {
              const isSelected = selectedAgent === item.key

              return (
                <Pressable
                  onPress={() => handleSelectAgent(item.key)}
                  style={[
                    styles.agentOption,
                    {
                      backgroundColor: isSelected
                        ? isDark ? 'rgba(120, 120, 120, 0.3)' : 'rgba(120, 120, 120, 0.15)'
                        : 'rgba(120, 120, 120, 0.1)',
                      borderBottomColor: colors.border,
                    },
                  ] as any}
                >
                  <View style={styles.agentOptionContent}>
                    <View style={styles.agentOptionLeft}>
                      {renderAgentIcon(item.icon, 16)}
                      <View style={styles.agentOptionText}>
                        <Text
                          style={[
                            styles.agentOptionLabel,
                            {
                              color: isSelected
                                ? colors.accent
                                : colors.foreground,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text
                          style={[
                            styles.agentOptionDescription,
                            { color: colors.mutedForeground },
                          ]}
                          numberOfLines={2}
                        >
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={styles.checkmarkContainer}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              )
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  agentSelectorMenu: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  agentListContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 8,
  },
  agentOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  agentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentOptionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentOptionText: {
    flex: 1,
    gap: 2,
  },
  agentOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  agentOptionDescription: {
    fontSize: 12,
  },
  checkmarkContainer: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
