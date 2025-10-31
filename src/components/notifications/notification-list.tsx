import { Button, Divider, useTheme } from 'heroui-native'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { mockNotifications } from './mock-notifications'
import { type NotificationData, NotificationItem } from './notification-item'

interface NotificationListProps {
  notifications?: NotificationData[]
  onNotificationPress?: (notification: NotificationData) => void
}

export function NotificationList({
  notifications = mockNotifications,
  onNotificationPress,
}: NotificationListProps) {
  const { colors } = useTheme()
  const recentNotifications = notifications.filter(
    (n) =>
      n.timestamp.includes('minute') ||
      n.timestamp.includes('hour') ||
      n.timestamp === 'Just now',
  )
  const olderNotifications = notifications.filter(
    (n) => n.timestamp.includes('day') || n.timestamp.includes('week'),
  )

  const handleNotificationPress = (notification: NotificationData) => {
    onNotificationPress?.(notification)
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
          All caught up!
        </Text>
        <Text style={[styles.emptyMessage, { color: colors.foreground, opacity: 0.6 }]}>
          You have no new notifications.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {recentNotifications.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent</Text>
          <View style={styles.notificationsList}>
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onPress={handleNotificationPress}
              />
            ))}
          </View>
        </View>
      )}

      {recentNotifications.length > 0 && olderNotifications.length > 0 && (
        <Divider className="my-4" />
      )}

      {olderNotifications.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Earlier</Text>
          <View style={styles.notificationsList}>
            {olderNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onPress={handleNotificationPress}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  notificationsList: {
    gap: 8,
  },
})
