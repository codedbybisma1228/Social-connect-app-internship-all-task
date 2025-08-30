 "use client"

import { View, Text, StyleSheet, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext" // Import useTheme
import { COLORS } from "../utils/constants" // Import centralized constants

export default function CommentItem({ comment }) {
  const { dynamicColors } = useTheme() // Use theme context

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) {
      return "Just now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) {
        return `${diffInHours}h ago`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        return `${diffInDays}d ago`
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: dynamicColors.iconBackground }]}>
        {comment.userAvatar ? (
          <Image source={{ uri: comment.userAvatar }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={16} color={COLORS.primary} />
        )}
      </View>
      <View style={styles.content}>
        <View style={[styles.commentBubble, { backgroundColor: dynamicColors.iconBackground }]}>
          <Text style={[styles.userName, { color: COLORS.primary }]}>{comment.userName}</Text>
          <Text style={[styles.commentText, { color: dynamicColors.textPrimary }]}>{comment.content}</Text>
        </View>
        <Text style={[styles.timestamp, { color: dynamicColors.textMuted }]}>{formatTimestamp(comment.timestamp)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  commentBubble: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
})
