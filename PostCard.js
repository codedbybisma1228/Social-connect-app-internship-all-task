"use client"

import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Share } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../context/ThemeContext" // Import useTheme
import { COLORS } from "../utils/constants" // Import centralized constants

export default function PostCard({ post, currentUserId, onLike, onComment, onUserPress, onShare, onDelete }) {
  const { dynamicColors, dynamicGradients } = useTheme() // Use theme context
  const isLiked = post.likes.includes(currentUserId)
  const likesCount = post.likes.length
  const commentsCount = post.comments.length
  const isOwnPost = post.userId === currentUserId

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const handleShare = async () => {
    try {
      const shareContent = {
        message: `Check out this post by ${post.userName}:\n\n"${post.content}"\n\nShared via Social Connect`,
        title: "Social Connect Post",
      }

      const result = await Share.share(shareContent)

      if (result.action === Share.sharedAction) {
        if (onShare) {
          onShare(post.id)
        }
        Alert.alert("Shared! 🎉", "Post shared successfully!")
      }
    } catch (error) {
      Alert.alert("Share Failed", "Unable to share this post. Please try again.")
      console.error("Share error:", error)
    }
  }

  const handleMoreOptions = () => {
    if (isOwnPost) {
      // Options for YOUR posts
      Alert.alert(
        "Post Options",
        "What would you like to do with your post?",
        [
          {
            text: "Edit Post",
            onPress: () => Alert.alert("Coming Soon", "Edit functionality will be available soon!"),
          },
          {
            text: "Delete Post",
            style: "destructive",
            onPress: handleDeletePost,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true },
      )
    } else {
      // Options for OTHER people's posts
      Alert.alert(
        "Post Options",
        `What would you like to do with ${post.userName}'s post?`,
        [
          {
            text: "Report Post",
            style: "destructive",
            onPress: () => {
              Alert.alert(
                "Report Sent! 🚨",
                `Thank you for reporting ${post.userName}'s post. Our team will review it and take appropriate action if needed.`,
                [{ text: "OK" }],
              )
            },
          },
          {
            text: "Hide Post",
            onPress: () => {
              Alert.alert(
                "Post Hidden! 👁️",
                `${post.userName}'s post has been hidden from your feed. You can unhide it from your settings.`,
                [{ text: "OK" }],
              )
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true },
      )
    }
  }

  const handleDeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete(post.id)
            }
            Alert.alert("Deleted! 🗑️", "Your post has been deleted successfully.")
          },
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={dynamicGradients.card} style={styles.cardGradient}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.userInfo} onPress={onUserPress}>
            <LinearGradient colors={dynamicGradients.primary} style={styles.avatar}>
              {post.userAvatar ? (
                <Image source={{ uri: post.userAvatar }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={20} color={COLORS.white} />
              )}
            </LinearGradient>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: COLORS.primary }]}>{post.userName}</Text>
              <Text style={[styles.timestamp, { color: dynamicColors.textMuted }]}>
                {formatTimestamp(post.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* More Options Button - Shows for ALL posts */}
          <TouchableOpacity
            style={[styles.moreButton, { backgroundColor: dynamicColors.iconBackground }]}
            onPress={handleMoreOptions}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={dynamicColors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.postText, { color: dynamicColors.textPrimary }]}>{post.content}</Text>
          {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
        </View>

        {/* Stats Row */}
        {(likesCount > 0 || commentsCount > 0 || post.shares > 0) && (
          <View style={styles.statsRow}>
            {likesCount > 0 && (
              <Text style={[styles.statText, { color: dynamicColors.textMuted }]}>
                <Ionicons name="heart" size={12} color={COLORS.like} /> {likesCount}{" "}
                {likesCount === 1 ? "like" : "likes"}
              </Text>
            )}
            {commentsCount > 0 && (
              <Text style={[styles.statText, { color: dynamicColors.textMuted }]}>
                <Ionicons name="chatbubble" size={12} color={COLORS.comment} /> {commentsCount}{" "}
                {commentsCount === 1 ? "comment" : "comments"}
              </Text>
            )}
            {post.shares > 0 && (
              <Text style={[styles.statText, { color: dynamicColors.textMuted }]}>
                <Ionicons name="share" size={12} color={COLORS.share} /> {post.shares}{" "}
                {post.shares === 1 ? "share" : "shares"}
              </Text>
            )}
          </View>
        )}

        <View style={[styles.actions, { borderTopColor: dynamicColors.separator }]}>
          <TouchableOpacity style={styles.actionButton} onPress={onLike} activeOpacity={0.7}>
            <View
              style={[
                styles.actionButtonContainer,
                isLiked && styles.likedContainer,
                { backgroundColor: dynamicColors.iconBackground },
              ]}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? COLORS.like : dynamicColors.textMuted}
              />
              <Text style={[styles.actionText, isLiked && styles.likedText, { color: dynamicColors.textMuted }]}>
                Like
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onComment} activeOpacity={0.7}>
            <View style={[styles.actionButtonContainer, { backgroundColor: dynamicColors.iconBackground }]}>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.comment} />
              <Text style={[styles.actionText, { color: COLORS.comment }]}>Comment</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.7}>
            <View style={[styles.actionButtonContainer, { backgroundColor: dynamicColors.iconBackground }]}>
              <Ionicons name="share-outline" size={24} color={COLORS.share} />
              <Text style={[styles.actionText, { color: COLORS.share }]}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 13,
    fontWeight: "500",
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexWrap: "wrap",
  },
  statText: {
    fontSize: 12,
    marginRight: 15,
    marginBottom: 5,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    justifyContent: "space-around",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
  },
  actionButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  likedContainer: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  likedText: {
    color: COLORS.like,
  },
})
