import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { formatDisplayName, getToolIcon } from '../../lib/chat/utils/tool-display-utils';

interface ToolResultDisplayProps {
  part: any; // AI SDK tool result part
}

/**
 * Component to display tool results in chat
 * Shows success/error status with formatted result data
 * Expandable with detailed output
 */
export function ToolResultDisplay({ part }: ToolResultDisplayProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract tool name from the type (e.g., 'tool-extractAssetFromImage')
  const toolName = part.type?.replace('tool-', '') || 'Unknown Tool';
  const result = part.result || {};


  // Determine status based on result
  const isError = result.type === 'error' || result.type === 'creation_error';
  const isSuccess = result.type === 'asset_created' || result.type === 'extraction_complete';

  const getStatusInfo = () => {
    if (isError) {
      return { color: '#EF4444', label: 'Error', status: 'error' };
    }
    if (isSuccess) {
      return { color: '#10B981', label: 'Completed', status: 'success' };
    }
    return { color: '#3B82F6', label: 'Output', status: 'info' };
  };

  const statusInfo = getStatusInfo();
  const ToolIcon = getToolIcon(toolName);
  const displayName = formatDisplayName(toolName);

  // Extract key information from result
  const getMessage = () => result.message || 'Tool executed successfully';

  // Format result data for display
  const formatResultJson = () => {
    return JSON.stringify(result, null, 2);
  };

  return (
    <View style={styles.container}>
      {/* Result Header - Clickable to expand/collapse */}
      <TouchableOpacity
        style={[styles.header, { backgroundColor: statusInfo.color + '15', borderColor: statusInfo.color }]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <ToolIcon size={16} color={statusInfo.color} strokeWidth={2} />
        <View style={styles.headerText}>
          <Text style={[styles.toolName, { color: colors.foreground }]}>
            {displayName} Result
          </Text>
          <Text style={[styles.message, { color: colors.mutedForeground }]} numberOfLines={1}>
            {getMessage()}
          </Text>
        </View>
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
          {/* Output Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Output Result
            </Text>
            <ScrollView
              style={styles.codeBlock}
              nestedScrollEnabled
              scrollEnabled
              horizontal
            >
              <Text style={[styles.codeText, { color: colors.mutedForeground }]}>
                {formatResultJson()}
              </Text>
            </ScrollView>
          </View>

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
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  toolName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
  },
  spacer: {
    flex: 0,
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
