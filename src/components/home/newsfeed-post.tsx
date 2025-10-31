import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Avatar, useTheme } from 'heroui-native';
import { Heart, MessageCircle, Share, Server, Shield } from 'lucide-react-native';

interface Post {
  id: string;
  author_name: string;
  avatar?: string;
  author_image_url?: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_bot?: boolean;
  bot_icon?: string;
}

interface NewsfeedPostProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
}

export function NewsfeedPost({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onViewPost 
}: NewsfeedPostProps) {
  const { colors } = useTheme();

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBotIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Server':
        return <Server size={20} color="#22c55e" />;
      case 'Shield':
        return <Shield size={20} color="#22c55e" />;
      default:
        return null;
    }
  };

  const handleLike = () => {
    onLike?.(post.id);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleViewPost = () => {
    onViewPost?.(post.id);
  };

  return (
    <TouchableOpacity onPress={handleViewPost} activeOpacity={0.7}>
      <View style={[styles.container, { borderBottomColor: colors.border, borderBottomWidth: 0.5 }]}>
        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.iconContainer}>
            {post.is_bot ? (
              <Avatar alt={post.author_name}>
                <Avatar.Fallback color="accent" className="text-xs flex items-center justify-center">
                  {getBotIcon(post.bot_icon)}
                </Avatar.Fallback>
              </Avatar>
            ) : (
              <Avatar alt={post.author_name}>
                {post.author_image_url ? (
                  <Avatar.Image source={typeof post.author_image_url === 'string' ? { uri: post.author_image_url } : post.author_image_url} />
                ) : post.avatar_url ? (
                  <Avatar.Image source={typeof post.avatar_url === 'string' ? { uri: post.avatar_url } : post.avatar_url} />
                ) : post.avatar ? (
                  <Avatar.Image source={typeof post.avatar === 'string' ? { uri: post.avatar } : post.avatar} />
                ) : null}
                <Avatar.Fallback color="accent" className="text-xs">
                  {getInitials(post.author_name)}
                </Avatar.Fallback>
              </Avatar>
            )}
          </View>

          {/* Post Content */}
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.authorName,
                  {
                    color: colors.foreground,
                  }
                ]}
                numberOfLines={1}
              >
                {post.author_name}
              </Text>
              <Text style={[styles.timestamp, { color: `${colors.foreground}60` }]}>
                {formatRelativeTime(new Date(post.created_at).getTime())}
              </Text>
            </View>

            <Text
              style={[
                styles.postContent,
                {
                  color: colors.foreground,
                }
              ]}
              numberOfLines={4}
            >
              {post.content}
            </Text>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleLike}
                  activeOpacity={0.7}
                >
                  <Heart
                    size={16}
                    color={post.is_liked ? '#ef4444' : `${colors.foreground}80`}
                    fill={post.is_liked ? '#ef4444' : 'none'}
                  />
                  <Text style={[
                    styles.actionText,
                    {
                      color: post.is_liked ? '#ef4444' : `${colors.foreground}80`
                    }
                  ]}>
                    {post.likes_count}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleComment}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={16} color={`${colors.foreground}80`} />
                  <Text style={[styles.actionText, { color: `${colors.foreground}80` }]}>
                    {post.comments_count}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShare}
                  activeOpacity={0.7}
                >
                  <Share size={16} color={`${colors.foreground}80`} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 16,
    width: 32,
    height: 32,
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
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.6,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
