"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useDispatch, useSelector } from "react-redux"
import { addComment } from "../../store/slices/postsSlice"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS } from "../../utils/constants" // Import centralized constants
import CommentItem from "../../components/CommentItem"
import NotificationService from "../../services/notifications"

export default function CommentsScreen({ route, navigation }) {
  const { post: initialPost } = route.params
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const dispatch = useDispatch()
  const { dynamicColors, dynamicGradients } = useTheme() // Use theme context

  // Get the updated post from Redux store
  const posts = useSelector((state) => state.posts.posts)
  const currentPost = posts.find((p) => p.id === initialPost.id) || initialPost

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Empty Comment", "Please write something before posting!")
      return
    }

    setIsSubmitting(true)

    try {
      const comment = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.profilePicture,
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
      }

      dispatch(addComment({ postId: currentPost.id, comment }))

      // Send notification to post author (if not commenting on own post)
      if (currentPost.userId !== user.id) {
        await NotificationService.sendCommentNotification(user.name, currentPost.content)
      }

      setNewComment("")
      Alert.alert("Comment Posted! 💬", "Your comment has been added successfully!")
    } catch (error) {
      Alert.alert("Error", "Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderComment = ({ item }) => <CommentItem comment={item} />

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient colors={dynamicGradients.secondary} style={styles.emptyIconContainer}>
        <Ionicons name="chatbubble-outline" size={50} color={COLORS.white} />
      </LinearGradient>
      <Text style={[styles.emptyStateText, { color: dynamicColors.textPrimary }]}>No comments yet</Text>
      <Text style={[styles.emptyStateSubtext, { color: dynamicColors.textSecondary }]}>Be the first to comment!</Text>
    </View>
  )

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <LinearGradient colors={dynamicGradients.card} style={styles.headerGradient}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.primary }]}>
              Comments ({currentPost.comments?.length || 0})
            </Text>
            <View style={styles.placeholder} />
          </LinearGradient>
        </View>

        <View style={styles.postPreview}>
          <LinearGradient colors={dynamicGradients.card} style={styles.postPreviewGradient}>
            <Text style={[styles.postAuthor, { color: COLORS.primary }]}>{currentPost.userName}</Text>
            <Text style={[styles.postContent, { color: dynamicColors.textPrimary }]} numberOfLines={2}>
              {currentPost.content}
            </Text>
          </LinearGradient>
        </View>

        <FlatList
          data={currentPost.comments || []}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={[styles.commentsList, { backgroundColor: dynamicColors.cardBackground }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={(currentPost.comments?.length || 0) === 0 ? styles.emptyListContent : null}
        />

        <View style={styles.inputContainer}>
          <LinearGradient colors={dynamicGradients.card} style={styles.inputGradient}>
            <View style={[styles.avatar, { backgroundColor: dynamicColors.iconBackground }]}>
              <Ionicons name="person" size={20} color={COLORS.primary} />
            </View>
            <TextInput
              style={[styles.textInput, { color: dynamicColors.textPrimary }]}
              placeholder="Write a comment..."
              placeholderTextColor={dynamicColors.textMuted}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={200}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              <LinearGradient
                colors={
                  newComment.trim() && !isSubmitting
                    ? dynamicGradients.secondary
                    : [dynamicColors.separator, dynamicColors.separator]
                }
                style={styles.sendButtonGradient}
              >
                {isSubmitting ? (
                  <Ionicons name="hourglass" size={20} color={COLORS.white} />
                ) : (
                  <Ionicons name="send" size={20} color={COLORS.white} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  postPreview: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postPreviewGradient: {
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentsList: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  emptyStateText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "500",
  },
  emptyStateSubtext: {
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputGradient: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
})
