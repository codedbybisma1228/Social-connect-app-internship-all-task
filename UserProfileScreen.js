"use client"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS } from "../../utils/constants" // Import centralized constants

export default function UserProfileScreen({ route, navigation }) {
  const { userId } = route.params || {}
  const { users } = useSelector((state) => state.users)
  const { posts } = useSelector((state) => state.posts)
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const { dynamicColors } = useTheme() // Use theme context

  useEffect(() => {
    // Find user by ID
    const foundUser = users.find((u) => u.id === userId)
    if (foundUser) {
      setUser(foundUser)
      // Get user's posts
      const filteredPosts = posts.filter((post) => post.userId === userId)
      setUserPosts(filteredPosts)
    }
  }, [userId, users, posts])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // Here you would typically make an API call to follow/unfollow the user
  }

  const handleMessage = () => {
    // Navigate to messaging screen (to be implemented)
    alert("Messaging feature coming soon!")
  }

  const renderPost = ({ item }) => (
    <View style={[styles.postItem, { borderBottomColor: dynamicColors.separator }]}>
      <Text style={[styles.postContent, { color: dynamicColors.textPrimary }]}>{item.content}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
      <View style={styles.postStats}>
        <Text style={[styles.postStat, { color: dynamicColors.textSecondary }]}>{item.likes.length} likes</Text>
        <Text style={[styles.postStat, { color: dynamicColors.textSecondary }]}>{item.comments.length} comments</Text>
      </View>
    </View>
  )

  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: dynamicColors.background }]}>
        <Text style={[styles.loadingText, { color: dynamicColors.textSecondary }]}>Loading user profile...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: dynamicColors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: dynamicColors.cardBackground, borderBottomColor: dynamicColors.separator },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={dynamicColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicColors.textPrimary }]}>{user.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.profileSection, { backgroundColor: dynamicColors.cardBackground }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: dynamicColors.iconBackground }]}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={60} color={COLORS.primary} />
            )}
          </View>
        </View>

        <Text style={[styles.name, { color: dynamicColors.textPrimary }]}>{user.name}</Text>
        <Text style={[styles.email, { color: dynamicColors.textSecondary }]}>{user.email}</Text>
        <Text style={[styles.bio, { color: dynamicColors.textPrimary }]}>{user.bio || "No bio available"}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: dynamicColors.textPrimary }]}>{userPosts.length}</Text>
            <Text style={[styles.statLabel, { color: dynamicColors.textSecondary }]}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: dynamicColors.textPrimary }]}>0</Text>
            <Text style={[styles.statLabel, { color: dynamicColors.textSecondary }]}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: dynamicColors.textPrimary }]}>0</Text>
            <Text style={[styles.statLabel, { color: dynamicColors.textSecondary }]}>Following</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isFollowing ? styles.followingButton : styles.followButton,
              isFollowing
                ? { backgroundColor: dynamicColors.iconBackground, borderColor: dynamicColors.separator }
                : { backgroundColor: COLORS.primary },
            ]}
            onPress={handleFollow}
          >
            <Text
              style={[
                styles.actionButtonText,
                isFollowing ? { color: dynamicColors.textPrimary } : { color: COLORS.white },
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.messageButton, { borderColor: COLORS.primary }]} onPress={handleMessage}>
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.messageButtonText, { color: COLORS.primary }]}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.postsSection, { backgroundColor: dynamicColors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: dynamicColors.textPrimary }]}>Posts ({userPosts.length})</Text>
        {userPosts.length > 0 ? (
          <FlatList
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={50} color={dynamicColors.textMuted} />
            <Text style={[styles.emptyStateText, { color: dynamicColors.textSecondary }]}>No posts yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  profileSection: {
    paddingVertical: 30,
    alignItems: "center",
    marginTop: 10,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 15,
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  followingButton: {
    backgroundColor: "transparent",
    borderColor: COLORS.gray,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  postsSection: {
    marginTop: 10,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  postItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postStats: {
    flexDirection: "row",
  },
  postStat: {
    fontSize: 14,
    marginRight: 15,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 15,
  },
})
