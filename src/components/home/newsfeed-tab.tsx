import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform } from 'react-native';
import { NewsfeedPost as NewsfeedPostComponent } from './newsfeed-post';
import { mockPosts, type MockPost } from '@/src/lib/mock-data/mock-posts';

export function NewsfeedTab() {
  const [posts, setPosts] = useState<MockPost[]>(mockPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            is_liked: !post.is_liked,
            likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    // Implement comment functionality here
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    // Implement share functionality here
  };

  const handleViewPost = (postId: string) => {
    console.log('View post:', postId);
    // Implement navigation to post detail here
  };


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {posts.map((post) => (
        <NewsfeedPostComponent
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onViewPost={handleViewPost}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.select({
      ios: 140,
      android: 100,
    }),
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
});
