import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { CheckCircle, AlertCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react-native';
import { formatDisplayName, getToolIcon } from '../../lib/chat/utils/tool-display-utils';

interface ToolCallDisplayProps {
  part: any; // AI SDK tool call part
}

/**
 * Component to display tool calls in chat
 * Handles different tool types with appropriate icons and formatting
 * Expandable with status indicators
 */
export function ToolCallDisplay({ part }: ToolCallDisplayProps) {
  const { colors, isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract tool metadata from the part
  // The type is like 'tool-extractAssetFromImage'
  const toolName = part.type?.replace('tool-', '') || 'Unknown Tool';
  const toolInput = part.input || {};
  const state = part.state || 'pending';


  // Determine status icon and color based on state
  const getStatusInfo = (currentState: string) => {
    switch (currentState) {
      case 'output-available':
      case 'succeeded':
        return { icon: CheckCircle, color: '#10B981', label: 'Completed' };
      case 'input-streaming':
      case 'in-progress':
        return { icon: Clock, color: '#3B82F6', label: 'In Progress' };
      case 'error':
        return { icon: AlertCircle, color: '#EF4444', label: 'Error' };
      default:
        return { icon: Clock, color: '#6B7280', label: 'Pending' };
    }
  };

  const statusInfo = getStatusInfo(state);
  const StatusIcon = statusInfo.icon;
  const ToolIcon = getToolIcon(toolName);
  const displayName = formatDisplayName(toolName);

  // Format tool input for display
  const formatInputJson = () => {
    return JSON.stringify(toolInput, null, 2);
  };

  return (
    <View style={styles.container}>
      {/* Tool Header - Clickable to expand/collapse */}
      <TouchableOpacity
        style={[styles.header, { backgroundColor: statusInfo.color + '15', borderColor: statusInfo.color }]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <ToolIcon size={16} color={statusInfo.color} strokeWidth={2} />
        <Text style={[styles.toolName, { color: colors.foreground }]}>
          {displayName}
        </Text>
        <StatusIcon size={16} color={statusInfo.color} strokeWidth={2} />
        <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
        <View style={styles.spacer} />
        {isExpanded ? (
          <ChevronDown size={16} color={colors.mutedForeground} strokeWidth={2} />
        ) : (
          <ChevronRight size={16} color={colors.mutedForeground} strokeWidth={2} />
        )}
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={[styles.expandedContent, { borderColor: statusInfo.color }]}>
          {/* Input Section */}
          {Object.keys(toolInput).length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
                Input Parameters
              </Text>
              <ScrollView
                style={styles.codeBlock}
                nestedScrollEnabled
                scrollEnabled
                horizontal
              >
                <Text style={[styles.codeText, { color: colors.mutedForeground }]}>
                  {formatInputJson()}
                </Text>
              </ScrollView>
            </View>
          )}

          {/* Tool Call ID */}
          {part.toolCallId && (
            <View style={styles.section}>
              <Text style={[styles.toolIdLabel, { color: colors.mutedForeground }]}>
                Tool Call ID: {part.toolCallId}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  toolName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 0,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  expandedContent: {
    borderTopWidth: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    padding: 10,
    maxHeight: 200,
  },
  codeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  toolIdLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
