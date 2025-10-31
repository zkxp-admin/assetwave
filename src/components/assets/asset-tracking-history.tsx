import { useTheme } from 'heroui-native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { AssetTrackingEvent } from '@/src/lib/types/asset'
import {
  getEventIcon,
  formatTimestamp,
  getValidTrackingEvents,
  getSafeEventUser,
  getSafeEventDescription,
  isLastEvent,
} from '@/src/lib/assets/utils/asset-tracking-utils'

interface AssetTrackingHistoryProps {
  events: AssetTrackingEvent[]
}

export function AssetTrackingHistory({ events }: AssetTrackingHistoryProps) {
  const { colors } = useTheme()
  const validEvents = getValidTrackingEvents(events)

  const renderEvent = (event: AssetTrackingEvent, index: number) => {
    const IconComponent = getEventIcon(event.type)
    const isLast = isLastEvent(index, validEvents.length)
    // Use performedBy from metadata (Clerk username), otherwise fall back to event user field
    const performedBy = event.metadata?.performedBy
    const safeUser = performedBy || getSafeEventUser(event)
    const safeDescription = getSafeEventDescription(event)

    return (
      <View key={event.id} style={styles.eventContainer}>
        <View style={styles.timelineContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <IconComponent size={16} color={colors.foreground} />
          </View>
          {!isLast && (
            <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
          )}
        </View>

        <View style={styles.eventContent}>
          <Text
            className="text-base"
            style={[styles.eventDescription, { color: colors.defaultForeground }]}
          >
            <Text className="font-semibold" style={{ color: colors.foreground }}>
              {safeUser}
            </Text>{' '}
            {safeDescription}
          </Text>
          <Text
            className="text-sm"
            style={[styles.eventTimestamp, { color: colors.defaultForeground }]}
          >
            {formatTimestamp(event.timestamp)}
          </Text>
        </View>
      </View>
    )
  }

  if (validEvents.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text
            className="text-sm font-medium"
            style={[styles.emptyStateTitle, { color: colors.foreground }]}
          >
            No Tracking History
          </Text>
          <Text
            className="text-xs"
            style={[styles.emptyStateMessage, { color: colors.defaultForeground }]}
          >
            This asset doesn't have any tracking history yet. History will be recorded as the asset is updated.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {validEvents.map((event, index) => renderEvent(event, index))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  eventContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 32,
    left: 15,
    width: 2,
    height: '100%',
    zIndex: 1,
  },
  eventContent: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 8,
  },
  eventDescription: {
    lineHeight: 20,
    marginBottom: 4,
  },
  eventTimestamp: {
    opacity: 0.6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
})
