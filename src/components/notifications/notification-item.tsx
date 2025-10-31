import { useTheme } from 'heroui-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  getAssetIcon,
  getMutedColor,
  getNotificationColor,
  getNotificationIcon,
  getUnreadIndicatorColor,
} from '../../helpers/utils/icon-utils'

export type NotificationType = 'like' | 'comment' | 'mention' | 'follow' | 'system'

export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  isRead: boolean
  user?: {
    name: string
    avatar?: string
  }
}

interface NotificationItemProps {
  notification: NotificationData
  onPress?: (notification: NotificationData) => void
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { colors, isDark } = useTheme()
  const Icon = getNotificationIcon(notification.type)
  const AssetIcon =
    notification.type === 'system'
      ? getAssetIcon(notification.title, notification.message)
      : null
  const iconColor = getNotificationColor(notification.type, isDark)

  const handlePress = () => {
    onPress?.(notification)
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View
        style={[
          styles.container,
          { borderBottomColor: colors.border, borderBottomWidth: 0.5 },
        ]}
      >
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            {AssetIcon ? (
              <AssetIcon size={20} color={iconColor} />
            ) : (
              <Icon size={20} color={iconColor} />
            )}
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.title,
                  {
                    color: notification.isRead ? colors.foreground : colors.foreground,
                    fontWeight: notification.isRead ? '500' : '600',
                  },
                ]}
                numberOfLines={2}
              >
                {notification.title}
              </Text>
              {!notification.isRead && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: getUnreadIndicatorColor(isDark) },
                  ]}
                />
              )}
            </View>

            <Text
              style={[
                styles.message,
                {
                  color: notification.isRead ? colors.foreground : colors.foreground,
                  opacity: notification.isRead ? 0.7 : 0.9,
                },
              ]}
              numberOfLines={2}
            >
              {notification.message}
            </Text>

            <Text style={[styles.timestamp, { color: getMutedColor(isDark) }]}>
              {notification.timestamp}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
  },
})
