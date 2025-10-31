import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useTheme } from 'heroui-native'
import { useAtom } from 'jotai'
import { Bot, ChevronLeft, History, Package, Shield } from 'lucide-react-native'
import { Platform, StyleSheet, Text, View, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { previousTabAtom } from '../../lib/atoms/navigation-atoms'
import { TABS } from '../common/bottom-tabs'
import { ActionButton } from './action-button'
import { selectedAgentAtom } from '../../lib/chat/chat-atoms'
import * as Haptics from 'expo-haptics'
import { useState } from 'react'
import { agents } from '../../lib/chat/constants'
import { AgentSelectorModal } from '../chat/agent-selector-modal'

export function ChatHeader() {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [previousTab] = useAtom(previousTabAtom)
  const [selectedAgent, setSelectedAgent] = useAtom(selectedAgentAtom)
  const [showAgentSelector, setShowAgentSelector] = useState(false)

  // Get current selected agent data
  const selectedAgentData = agents.find((agent) => agent.key === selectedAgent) || agents[0]

  const handleBackPress = () => {
    // Find the previous tab's path from TABS array
    const previousTabData = TABS.find((tab) => tab.key === previousTab)
    if (previousTabData) {
      router.replace(previousTabData.path as any)
    } else {
      // Fallback to home if previous tab not found
      router.replace('/(home)/' as any)
    }
  }

  const handleChatHistoryPress = () => {
    router.push('/(home)/chat-history')
  }

  const handleAgentNamePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setShowAgentSelector(true)
  }

  // Device-specific padding
  const getDevicePadding = () => {
    return Platform.select({
      ios: insets.top,
      android: insets.top + 5,
    })
  }

  const menuTopPosition = (getDevicePadding() ?? 0) + 80

  return (
    <BlurView
      className="overflow-hidden rounded-b-3xl"
      intensity={50}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.blurContainer, { paddingTop: getDevicePadding() }] as any}
      experimentalBlurMethod="dimezisBlurView"
    >
      {/* Surface-2 overlay matching dashboard cards */}
      {!isDark && <View className="absolute inset-0 bg-white/50 rounded-b-3xl border-b border-zinc-500/20" />}
      {isDark && <View className="absolute inset-0 bg-zinc-500/15 rounded-b-3xl border-b border-zinc-500/20" />}

      <View style={styles.header}>
        {/* Left - Back Button */}
        <ActionButton icon={ChevronLeft} onPress={handleBackPress} />

        {/* Center - Title and Agent Subtitle */}
        <View style={styles.centerSection}>
          <View style={styles.titleContainer}>
            <Bot size={24} color="#2864f0" style={styles.titleIcon} />
            <Text
              className="font-orbitron-semibold"
              style={[styles.title, { color: colors.foreground }]}
            >
              Chat
            </Text>
          </View>

          {/* Agent name as clickable chip */}
          <Pressable
            onPress={handleAgentNamePress}
            style={[
              styles.agentChip,
              {
                borderColor: "#2864f0",
              },
            ] as any}
          >
            <Text
              className="text-xs font-semibold"
              style={[styles.agentChipText, { color: "#ffffff" }]}
            >
              {selectedAgentData.label}
            </Text>
          </Pressable>
        </View>

        {/* Right - Chat History Button */}
        <ActionButton icon={History} onPress={handleChatHistoryPress} />
      </View>

      {/* Agent Selector Modal */}
      <AgentSelectorModal
        visible={showAgentSelector}
        onClose={() => setShowAgentSelector(false)}
        topPosition={menuTopPosition}
      />
    </BlurView>
  )
}

const styles = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  agentChip: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#2864f0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  agentChipText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
})
