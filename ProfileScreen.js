"use client"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import * as ImagePicker from "expo-image-picker"
import { useAuth } from "../../context/AuthContext"
import { useSelector } from "react-redux"
import AsyncStorage from "@react-native-async-storage/async-storage"

const COLORS = {
  // Professional color scheme inspired by modern apps
  primary: "#6C5CE7", // Purple
  primaryLight: "#A29BFE",
  primaryDark: "#5F3DC4",

  secondary: "#00CEC9", // Teal
  secondaryLight: "#81ECEC",
  secondaryDark: "#00B894",

  accent: "#FD79A8", // Pink
  accentLight: "#FDCB6E",

  // Neutral colors
  white: "#FFFFFF",
  black: "#2D3436",
  gray: "#636E72",
  lightGray: "#DDD6FE",
  darkGray: "#2D3436",

  // Background colors
  background: "#F8F9FA",
  cardBackground: "#FFFFFF",

  // Text colors
  textPrimary: "#2D3436",
  textSecondary: "#636E72",
  textLight: "#B2BEC3",

  // Status colors
  success: "#00B894",
  warning: "#FDCB6E",
  error: "#E17055",
}

const GRADIENTS = {
  primary: [COLORS.primary, COLORS.primaryDark],
  secondary: [COLORS.secondary, COLORS.secondaryDark],
  accent: [COLORS.accent, COLORS.accentLight],
  background: [COLORS.primaryLight, COLORS.secondaryLight],
  card: ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"],
  header: [COLORS.primary, COLORS.secondary],
}

export default function ProfileScreen() {
  const { user, updateProfile } = useAuth()
  const { posts } = useSelector((state) => state.posts)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || null,
  })

  const [followedUsers, setFollowedUsers] = useState(new Set())
  const [followers, setFollowers] = useState(new Set())

  useEffect(() => {
    loadFollowData()
  }, [])

  const loadFollowData = async () => {
    try {
      // Load followed users (people current user follows)
      const followedData = await AsyncStorage.getItem("followedUsers")
      if (followedData) {
        setFollowedUsers(new Set(JSON.parse(followedData)))
      }

      // Load followers (people who follow current user)
      const followersData = await AsyncStorage.getItem("followers")
      if (followersData) {
        setFollowers(new Set(JSON.parse(followersData)))
      }
    } catch (error) {
      console.log("Error loading follow data:", error)
    }
  }

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setEditedProfile({ ...editedProfile, profilePicture: result.assets[0].uri })
    }
  }

  const handleSave = async () => {
    const result = await updateProfile(editedProfile)
    if (result.success) {
      setIsEditing(false)
      Alert.alert("Success! ✨", "Profile updated successfully!")
    } else {
      Alert.alert("Error", result.error)
    }
  }

  const handleCancel = () => {
    setEditedProfile({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profilePicture: user?.profilePicture || null,
    })
    setIsEditing(false)
  }

  // Calculate user's posts count
  const userPostsCount = posts.filter((post) => post.userId === user?.id).length

  const followingCount = followedUsers.size
  const followersCount = followers.size

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient colors={GRADIENTS.header} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => (isEditing ? handleSave() : setIsEditing(true))}>
            <View style={styles.editButtonContainer}>
              <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={16} color={COLORS.white} />
              <Text style={styles.editButtonText}>{isEditing ? "Save" : "Edit"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Hero Section */}
        <LinearGradient colors={GRADIENTS.background} style={styles.heroSection}>
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={isEditing ? handleImagePicker : null}>
              <View style={styles.avatarWrapper}>
                <LinearGradient colors={GRADIENTS.primary} style={styles.avatarBorder}>
                  <View style={styles.avatar}>
                    {editedProfile.profilePicture ? (
                      <Image source={{ uri: editedProfile.profilePicture }} style={styles.avatarImage} />
                    ) : (
                      <Ionicons name="person" size={60} color={COLORS.white} />
                    )}
                  </View>
                </LinearGradient>
                {isEditing && (
                  <LinearGradient colors={GRADIENTS.accent} style={styles.cameraIcon}>
                    <Ionicons name="camera" size={18} color={COLORS.white} />
                  </LinearGradient>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              {isEditing ? (
                <View style={styles.editingContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                      style={styles.nameInput}
                      value={editedProfile.name}
                      onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                      placeholder="Enter your name"
                      placeholderTextColor={COLORS.textLight}
                      maxLength={50}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.emailInput}
                      value={editedProfile.email}
                      onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
                      placeholder="Enter your email"
                      placeholderTextColor={COLORS.textLight}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bio</Text>
                    <TextInput
                      style={styles.bioInput}
                      value={editedProfile.bio}
                      onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                      placeholder="Tell us about yourself..."
                      placeholderTextColor={COLORS.textLight}
                      multiline
                      maxLength={150}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.displayContainer}>
                  <Text style={styles.name}>{user?.name || "User Name"}</Text>
                  <Text style={styles.email}>{user?.email || "bismalam300@gmail.com"}</Text>
                  <Text style={styles.bio}>{user?.bio || "No bio available"}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Edit Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.saveButtonGradient}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient colors={GRADIENTS.primary} style={styles.statCard}>
            <Ionicons name="document-text" size={24} color={COLORS.white} />
            <Text style={styles.statNumber}>{userPostsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </LinearGradient>

          <LinearGradient colors={GRADIENTS.secondary} style={styles.statCard}>
            <Ionicons name="people" size={24} color={COLORS.white} />
            <Text style={styles.statNumber}>{followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </LinearGradient>

          <LinearGradient colors={GRADIENTS.accent} style={styles.statCard}>
            <Ionicons name="person-add" size={24} color={COLORS.white} />
            <Text style={styles.statNumber}>{followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </LinearGradient>
        </View>

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Posts</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{userPostsCount}</Text>
            </View>
          </View>

          {userPostsCount > 0 ? (
            <View style={styles.postsContent}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.postsIcon}>
                <Ionicons name="checkmark-circle" size={30} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.postsText}>You have {userPostsCount} amazing posts!</Text>
              <Text style={styles.postsSubtext}>Keep sharing your thoughts with the community</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient colors={GRADIENTS.secondary} style={styles.emptyIcon}>
                <Ionicons name="create-outline" size={40} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.emptyStateText}>No posts yet</Text>
              <Text style={styles.emptyStateSubtext}>Share your first post to get started!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    marginTop: -15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 30,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  editingContainer: {
    width: "100%",
    maxWidth: 300,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginLeft: 4,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emailInput: {
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bioInput: {
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    minHeight: 80,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  displayContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  email: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
    textAlign: "center",
  },
  bio: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  saveButtonGradient: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  postsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  sectionBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sectionBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  postsContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  postsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  postsText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  postsSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
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
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
})
