"use client"

import React from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, TextInput, ScrollView } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import PostCard from "../../components/PostCard"
import { toggleLike, incrementShare, deletePost } from "../../store/slices/postsSlice"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS } from "../../utils/constants" // Import centralized constants
import NotificationService from "../../services/notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function HomeScreen({ navigation }) {
  const { posts, loading } = useSelector((state) => state.posts)
  const { user } = useAuth()
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = React.useState(false)
  const { dynamicColors, dynamicGradients } = useTheme() // Use theme context

  // Debug: Log user info
  console.log("HomeScreen Debug - Current User:", {
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email,
  })

  const [showChat, setShowChat] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)
  const [showMainSearch, setShowMainSearch] = React.useState(false)
  const [mainSearchQuery, setMainSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState({ posts: [], users: [] })
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedContact, setSelectedContact] = React.useState(null)

  const [followedUsers, setFollowedUsers] = React.useState(new Set())
  const [followersCount, setFollowersCount] = React.useState(0)
  const [followingCount, setFollowingCount] = React.useState(0)

  const [contacts] = React.useState([
    { id: "1", name: "Bisma Khan", avatar: "BK", status: "Online", lastSeen: "Online" },
    { id: "2", name: "Alina Ahmed", avatar: "AA", status: "Last seen 2 hours ago", lastSeen: "2 hours ago" },
    { id: "3", name: "Ali Hassan", avatar: "AH", status: "Last seen yesterday", lastSeen: "yesterday" },
    { id: "4", name: "Ayesha Malik", avatar: "AM", status: "Online", lastSeen: "Online" },
    { id: "5", name: "Faisal Sheikh", avatar: "FS", status: "Last seen 5 minutes ago", lastSeen: "5 minutes ago" },
    { id: "6", name: "Maia Fatima", avatar: "MF", status: "Last seen 1 hour ago", lastSeen: "1 hour ago" },
    { id: "7", name: "Zara Siddiqui", avatar: "ZS", status: "Online", lastSeen: "Online" },
    { id: "8", name: "Hassan Ali", avatar: "HA", status: "Last seen 3 hours ago", lastSeen: "3 hours ago" },
    { id: "9", name: "Fatima Noor", avatar: "FN", status: "Online", lastSeen: "Online" },
    { id: "10", name: "Ahmad Raza", avatar: "AR", status: "Last seen 30 minutes ago", lastSeen: "30 minutes ago" },
    { id: "11", name: "Sana Tariq", avatar: "ST", status: "Last seen 2 hours ago", lastSeen: "2 hours ago" },
    { id: "12", name: "Usman Khan", avatar: "UK", status: "Online", lastSeen: "Online" },
    { id: "13", name: "Hira Butt", avatar: "HB", status: "Last seen yesterday", lastSeen: "yesterday" },
    { id: "14", name: "Bilal Ahmed", avatar: "BA", status: "Last seen 4 hours ago", lastSeen: "4 hours ago" },
    { id: "15", name: "Nida Shah", avatar: "NS", status: "Online", lastSeen: "Online" },
    { id: "16", name: "Hamza Malik", avatar: "HM", status: "Last seen 1 hour ago", lastSeen: "1 hour ago" },
    { id: "17", name: "Rabia Khan", avatar: "RK", status: "Last seen 6 hours ago", lastSeen: "6 hours ago" },
    { id: "18", name: "Saad Qureshi", avatar: "SQ", status: "Online", lastSeen: "Online" },
    { id: "19", name: "Amna Riaz", avatar: "AR", status: "Last seen 15 minutes ago", lastSeen: "15 minutes ago" },
    { id: "20", name: "Talha Iqbal", avatar: "TI", status: "Last seen 3 hours ago", lastSeen: "3 hours ago" },
    { id: "21", name: "Khadija Omar", avatar: "KO", status: "Online", lastSeen: "Online" },
    { id: "22", name: "Waqas Ali", avatar: "WA", status: "Last seen yesterday", lastSeen: "yesterday" },
    { id: "23", name: "Mariam Javed", avatar: "MJ", status: "Last seen 2 hours ago", lastSeen: "2 hours ago" },
    { id: "24", name: "Shahzad Mirza", avatar: "SM", status: "Online", lastSeen: "Online" },
    { id: "25", name: "Laiba Chaudhry", avatar: "LC", status: "Last seen 45 minutes ago", lastSeen: "45 minutes ago" },
    { id: "26", name: "Arslan Baig", avatar: "AB", status: "Last seen 5 hours ago", lastSeen: "5 hours ago" },
    { id: "27", name: "Iqra Nawaz", avatar: "IN", status: "Online", lastSeen: "Online" },
    { id: "28", name: "Daniyal Khan", avatar: "DK", status: "Last seen 1 hour ago", lastSeen: "1 hour ago" },
    { id: "29", name: "Sidra Hussain", avatar: "SH", status: "Last seen yesterday", lastSeen: "yesterday" },
    { id: "30", name: "Owais Rehman", avatar: "OR", status: "Online", lastSeen: "Online" },
  ])

  const [chatMessages, setChatMessages] = React.useState([])
  const [messageText, setMessageText] = React.useState("")

  const handleLike = async (postId) => {
    dispatch(toggleLike({ postId, userId: user.id }))

    // Find the post to get author info
    const post = posts.find((p) => p.id === postId)
    if (post && post.userId !== user.id) {
      // Send notification to post author (if not liking own post)
      await NotificationService.sendLikeNotification(user.name, post.content)
    }
  }

  const handleComment = (post) => {
    navigation.navigate("Comments", { post })
  }

  const handleShare = (postId) => {
    // Increment share count in the store
    dispatch(incrementShare({ postId }))

    // You can add analytics tracking here
    console.log(`Post ${postId} shared by user ${user.id}`)
  }

  const handleDelete = (postId) => {
    dispatch(deletePost({ postId }))
  }

  const handleUserPressProfile = (userId) => {
    if (userId === user.id) {
      // Navigate to own profile
      navigation.navigate("Profile")
    } else {
      // Navigate to other user's profile
      navigation.navigate("UserProfile", { userId })
    }
  }

  const handleChatPress = () => {
    setShowSearch(true)
  }

  const handleCloseSearch = () => {
    setShowSearch(false)
    setSearchQuery("")
  }

  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
    setShowSearch(false)
    setShowChat(true)

    // Initialize chat messages for selected contact
    setChatMessages([
      {
        id: "1",
        text: "Hey! How are you doing?",
        sender: contact.name,
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
        status: "read",
      },
      {
        id: "2",
        text: "I'm doing great! Thanks for asking 😊",
        sender: user.name,
        timestamp: new Date(Date.now() - 240000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
        status: "read",
      },
    ])
  }

  const handleCloseChat = () => {
    setShowChat(false)
    setSelectedContact(null)
    setChatMessages([])
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageText,
        sender: user.name,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
        status: "sent",
      }
      setChatMessages([...chatMessages, newMessage])
      setMessageText("")

      setTimeout(() => {
        setChatMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)

      setTimeout(() => {
        setChatMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
      }, 3000)
    }
  }

  const renderPost = ({ item }) => {
    // Debug: Log each post render
    console.log("Rendering post:", {
      postId: item.id,
      postUserId: item.userId,
      currentUserId: user.id,
      isOwnPost: item.userId === user.id,
      postUserName: item.userName,
    })

    return (
      <PostCard
        post={item}
        currentUserId={user.id}
        onLike={() => handleLike(item.id)}
        onComment={() => handleComment(item)}
        onShare={handleShare}
        onDelete={handleDelete}
        onUserPress={() => handleUserPressProfile(item.userId)}
      />
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient colors={dynamicGradients.secondary} style={styles.emptyIconContainer}>
        <Ionicons name="document-text-outline" size={60} color={COLORS.white} />
      </LinearGradient>
      <Text style={[styles.emptyTitle, { color: dynamicColors.textPrimary }]}>No Posts Yet</Text>
      <Text style={[styles.emptySubtitle, { color: dynamicColors.textSecondary }]}>
        Be the first to share something amazing!
      </Text>
      <TouchableOpacity style={styles.createFirstPostButton} onPress={() => navigation.navigate("CreatePost")}>
        <LinearGradient colors={dynamicGradients.secondary} style={styles.createFirstPostGradient}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={[styles.createFirstPostText, { color: COLORS.white }]}>Create First Post</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  const handleFollowToggle = async (userId, userName) => {
    const isFollowing = followedUsers.has(userId)

    if (isFollowing) {
      // Unfollow user
      const newFollowedUsers = new Set(followedUsers)
      newFollowedUsers.delete(userId)
      setFollowedUsers(newFollowedUsers)
      setFollowingCount((prev) => prev - 1)

      await saveFollowData(newFollowedUsers)

      // Here you would typically update Firebase Firestore
      console.log(`Unfollowed user: ${userName}`)

      // Send notification (optional)
      // await NotificationService.sendUnfollowNotification(user.name, userName)
    } else {
      // Follow user
      const newFollowedUsers = new Set(followedUsers)
      newFollowedUsers.add(userId)
      setFollowedUsers(newFollowedUsers)
      setFollowingCount((prev) => prev + 1)

      await saveFollowData(newFollowedUsers)

      // Here you would typically update Firebase Firestore
      console.log(`Followed user: ${userName}`)

      // Send notification
      await NotificationService.sendFollowNotification(user.name, userName)
    }
  }

  const renderSearchInterface = () => {
    const filteredContacts = searchQuery.trim()
      ? contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

    return (
      <View style={styles.chatOverlay}>
        <LinearGradient colors={dynamicGradients.primary} style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <LinearGradient colors={dynamicGradients.card} style={styles.chatHeaderGradient}>
              <View style={styles.chatHeaderContent}>
                <View style={styles.chatHeaderLeft}>
                  <TouchableOpacity onPress={handleCloseSearch} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={dynamicColors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.chatTitle, { color: COLORS.primary }]}>Select Contact</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.searchContainer}>
            <LinearGradient colors={dynamicGradients.card} style={styles.searchInputGradient}>
              <Ionicons name="search" size={20} color={dynamicColors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: dynamicColors.textPrimary }]}
                placeholder="Search contacts..."
                placeholderTextColor={dynamicColors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </LinearGradient>
          </View>

          <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
            {!searchQuery.trim() ? (
              <View style={styles.emptySearchState}>
                <Text style={[styles.emptySearchText, { color: dynamicColors.textSecondary }]}>
                  Start typing to search for contacts...
                </Text>
              </View>
            ) : filteredContacts.length === 0 ? (
              <View style={styles.emptySearchState}>
                <Text style={[styles.emptySearchText, { color: dynamicColors.textSecondary }]}>
                  No contacts found for "{searchQuery}"
                </Text>
              </View>
            ) : (
              filteredContacts.map((contact) => {
                const isFollowing = followedUsers.has(contact.id)

                return (
                  <View key={contact.id} style={styles.contactItem}>
                    <LinearGradient colors={dynamicGradients.card} style={styles.contactItemGradient}>
                      <TouchableOpacity style={styles.contactMainInfo} onPress={() => handleSelectContact(contact)}>
                        <LinearGradient colors={dynamicGradients.secondary} style={styles.contactAvatar}>
                          <Text style={styles.contactAvatarText}>{contact.avatar}</Text>
                        </LinearGradient>
                        <View style={styles.contactInfo}>
                          <Text style={[styles.contactName, { color: dynamicColors.textPrimary }]}>{contact.name}</Text>
                          <Text style={[styles.contactStatus, { color: dynamicColors.textSecondary }]}>
                            {contact.status}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.contactActions}>
                        <TouchableOpacity
                          onPress={() => handleFollowToggle(contact.id, contact.name)}
                          style={styles.followButton}
                        >
                          <LinearGradient
                            colors={isFollowing ? ["#FF6B6B", "#FF5252"] : dynamicGradients.secondary}
                            style={styles.followButtonGradient}
                          >
                            <Ionicons
                              name={isFollowing ? "person-remove-outline" : "person-add-outline"}
                              size={20}
                              color={COLORS.white}
                            />
                            <Text style={styles.followButtonText}>{isFollowing ? "Unfollow" : "Follow"}</Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.chatIconButton}>
                          <Ionicons name="chatbubble" size={20} color={dynamicColors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </View>
                )
              })
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    )
  }

  const renderChatInterface = () => (
    <View style={styles.chatOverlay}>
      <LinearGradient colors={dynamicGradients.primary} style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <LinearGradient colors={dynamicGradients.card} style={styles.chatHeaderGradient}>
            <View style={styles.chatHeaderContent}>
              <View style={styles.chatHeaderLeft}>
                <TouchableOpacity onPress={handleCloseChat} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={dynamicColors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.chatProfileContainer}>
                  <LinearGradient colors={dynamicGradients.secondary} style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarText}>{selectedContact?.avatar || "JD"}</Text>
                  </LinearGradient>
                  <View>
                    <Text style={[styles.chatTitle, { color: COLORS.primary }]}>
                      {selectedContact?.name || "John Doe"}
                    </Text>
                    <Text style={[styles.chatStatus, { color: dynamicColors.textSecondary }]}>
                      {selectedContact?.lastSeen || "Online"}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.chatHeaderRight}></View>
            </View>
          </LinearGradient>
        </View>

        {/* Existing chat messages and input code */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {chatMessages.map((message) => (
            <View key={message.id} style={[styles.messageItem, message.isMe ? styles.myMessage : styles.otherMessage]}>
              {!message.isMe && (
                <LinearGradient colors={dynamicGradients.secondary} style={styles.messageAvatar}>
                  <Text style={styles.messageAvatarText}>
                    {message.sender
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </LinearGradient>
              )}

              <LinearGradient
                colors={message.isMe ? ["#007AFF", "#0051D5"] : dynamicGradients.card}
                style={[styles.messageBubble, message.isMe ? styles.myMessageBubble : styles.otherMessageBubble]}
              >
                <Text style={[styles.messageText, { color: message.isMe ? COLORS.white : dynamicColors.textPrimary }]}>
                  {message.text}
                </Text>
                <View style={styles.messageFooter}>
                  <Text
                    style={[
                      styles.messageTime,
                      { color: message.isMe ? "rgba(255,255,255,0.8)" : dynamicColors.textSecondary },
                    ]}
                  >
                    {message.timestamp}
                  </Text>
                  {message.isMe && (
                    <View style={styles.messageStatus}>
                      {message.status === "sent" && (
                        <Ionicons name="checkmark" size={14} color="rgba(255,255,255,0.8)" />
                      )}
                      {message.status === "delivered" && (
                        <View style={styles.doubleCheck}>
                          <Ionicons name="checkmark" size={14} color="rgba(255,255,255,0.8)" />
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color="rgba(255,255,255,0.8)"
                            style={styles.secondCheck}
                          />
                        </View>
                      )}
                      {message.status === "read" && (
                        <View style={styles.doubleCheck}>
                          <Ionicons name="checkmark" size={14} color="#4FC3F7" />
                          <Ionicons name="checkmark" size={14} color="#4FC3F7" style={styles.secondCheck} />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>

        <View style={styles.messageInputContainer}>
          <LinearGradient colors={dynamicGradients.card} style={styles.messageInputGradient}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color={dynamicColors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.messageInput, { color: dynamicColors.textPrimary }]}
              placeholder="Type a message..."
              placeholderTextColor={dynamicColors.textSecondary}
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            {messageText.trim() ? (
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.sendButtonGradient}>
                  <Ionicons name="send" size={20} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.emojiButton}>
                <Ionicons name="happy" size={24} color={dynamicColors.textSecondary} />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  )

  const handleMainSearchPress = () => {
    setShowMainSearch(true)
  }

  const handleCloseMainSearch = () => {
    setShowMainSearch(false)
    setMainSearchQuery("")
    setSearchResults({ posts: [], users: [] })
  }

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults({ posts: [], users: [] })
      return
    }

    // Search posts by content, author name, or hashtags
    const filteredPosts = posts.filter(
      (post) =>
        post.content?.toLowerCase().includes(query.toLowerCase()) ||
        post.author?.name?.toLowerCase().includes(query.toLowerCase()) ||
        post.hashtags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )

    // Search users/contacts by name
    const filteredUsers = contacts.filter((contact) => contact.name.toLowerCase().includes(query.toLowerCase()))

    setSearchResults({ posts: filteredPosts, users: filteredUsers })
  }

  const handleMainSearchChange = (query) => {
    setMainSearchQuery(query)
    performSearch(query)
  }

  const handlePostPress = (post) => {
    // Navigate to post detail or close search and scroll to post
    handleCloseMainSearch()
    // You can add navigation to post detail here if needed
  }

  const renderMainSearchInterface = () => {
    return (
      <View style={styles.chatOverlay}>
        <LinearGradient colors={dynamicGradients.primary} style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <LinearGradient colors={dynamicGradients.card} style={styles.chatHeaderGradient}>
              <View style={styles.chatHeaderContent}>
                <View style={styles.chatHeaderLeft}>
                  <TouchableOpacity onPress={handleCloseMainSearch} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={dynamicColors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.chatTitle, { color: COLORS.primary }]}>Search Posts & Users</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.searchContainer}>
            <LinearGradient colors={dynamicGradients.card} style={styles.searchInputGradient}>
              <Ionicons name="search" size={20} color={dynamicColors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: dynamicColors.textPrimary }]}
                placeholder="Search posts, users, hashtags..."
                placeholderTextColor={dynamicColors.textSecondary}
                value={mainSearchQuery}
                onChangeText={handleMainSearchChange}
                autoFocus={true}
              />
            </LinearGradient>
          </View>

          <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
            {!mainSearchQuery.trim() ? (
              <View style={styles.emptySearchState}>
                <Ionicons name="search" size={48} color={dynamicColors.textSecondary} style={{ marginBottom: 10 }} />
                <Text style={[styles.emptySearchText, { color: dynamicColors.textSecondary }]}>
                  Start typing to search for posts, users, or hashtags...
                </Text>
              </View>
            ) : searchResults.posts.length === 0 && searchResults.users.length === 0 ? (
              <View style={styles.emptySearchState}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={dynamicColors.textSecondary}
                  style={{ marginBottom: 10 }}
                />
                <Text style={[styles.emptySearchText, { color: dynamicColors.textSecondary }]}>
                  No results found for "{mainSearchQuery}"
                </Text>
              </View>
            ) : (
              <>
                {searchResults.users.length > 0 && (
                  <View style={styles.searchSection}>
                    <Text style={[styles.searchSectionTitle, { color: COLORS.primary }]}>Users</Text>
                    {searchResults.users.map((user) => (
                      <TouchableOpacity key={user.id} onPress={() => handleUserPressProfile(user)}>
                        <View style={styles.contactItem}>
                          <LinearGradient colors={dynamicGradients.card} style={styles.contactItemGradient}>
                            <LinearGradient colors={dynamicGradients.secondary} style={styles.contactAvatar}>
                              <Text style={styles.contactAvatarText}>{user.avatar}</Text>
                            </LinearGradient>
                            <View style={styles.contactInfo}>
                              <Text style={[styles.contactName, { color: dynamicColors.textPrimary }]}>
                                {user.name}
                              </Text>
                              <Text style={[styles.contactStatus, { color: dynamicColors.textSecondary }]}>
                                {user.status}
                              </Text>
                            </View>
                            <Ionicons name="person" size={20} color={dynamicColors.textSecondary} />
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {searchResults.posts.length > 0 && (
                  <View style={styles.searchSection}>
                    <Text style={[styles.searchSectionTitle, { color: COLORS.primary }]}>Posts</Text>
                    {searchResults.posts.map((post) => (
                      <TouchableOpacity key={post.id} onPress={() => handlePostPress(post)}>
                        <View style={styles.contactItem}>
                          <LinearGradient colors={dynamicGradients.card} style={styles.contactItemGradient}>
                            <LinearGradient colors={dynamicGradients.secondary} style={styles.contactAvatar}>
                              <Text style={styles.contactAvatarText}>{post.author?.name?.charAt(0) || "P"}</Text>
                            </LinearGradient>
                            <View style={styles.contactInfo}>
                              <Text style={[styles.contactName, { color: dynamicColors.textPrimary }]}>
                                {post.author?.name || "Unknown User"}
                              </Text>
                              <Text
                                style={[styles.contactStatus, { color: dynamicColors.textSecondary }]}
                                numberOfLines={2}
                              >
                                {post.content}
                              </Text>
                            </View>
                            <Ionicons name="document-text" size={20} color={dynamicColors.textSecondary} />
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    )
  }

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  React.useEffect(() => {
    loadFollowData()
  }, [])

  const loadFollowData = async () => {
    try {
      const followedData = await AsyncStorage.getItem("followedUsers")
      if (followedData) {
        const followedArray = JSON.parse(followedData)
        setFollowedUsers(new Set(followedArray))
        setFollowingCount(followedArray.length)
      }

      const followersData = await AsyncStorage.getItem("followers")
      if (followersData) {
        const followersArray = JSON.parse(followersData)
        setFollowersCount(followersArray.length)
      }
    } catch (error) {
      console.log("Error loading follow data:", error)
    }
  }

  const saveFollowData = async (newFollowedUsers) => {
    try {
      await AsyncStorage.setItem("followedUsers", JSON.stringify(Array.from(newFollowedUsers)))
    } catch (error) {
      console.log("Error saving follow data:", error)
    }
  }

  if (showMainSearch) {
    return renderMainSearchInterface()
  }

  if (showSearch) {
    return renderSearchInterface()
  }

  if (showChat) {
    return renderChatInterface()
  }

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <View style={styles.header}>
        <LinearGradient colors={dynamicGradients.card} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.headerTitle, { color: COLORS.primary }]}>Connectera</Text>
              <Text style={[styles.headerSubtitle, { color: dynamicColors.textPrimary }]}>
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.searchButton} onPress={handleMainSearchPress}>
                <LinearGradient colors={dynamicGradients.secondary} style={styles.searchButtonGradient}>
                  <Ionicons name="search-outline" size={22} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
                <LinearGradient colors={dynamicGradients.secondary} style={styles.chatButtonGradient}>
                  <Ionicons name="chatbubbles-outline" size={22} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreatePost")}>
                <LinearGradient colors={dynamicGradients.secondary} style={styles.createButtonGradient}>
                  <Ionicons name="create-outline" size={22} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={dynamicColors.textPrimary}
            colors={[COLORS.secondary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, posts.length === 0 && styles.emptyListContent]}
        ListEmptyComponent={renderEmptyState}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  headerGradient: {
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  chatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 10,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  createFirstPostButton: {
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createFirstPostGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  createFirstPostText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  chatOverlay: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  chatHeaderGradient: {
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
  chatHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  chatHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  chatProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  chatHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconButton: {
    padding: 8,
    marginLeft: 5,
  },
  closeButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageItem: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  // Different alignment styles for sent vs received messages
  myMessage: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    maxWidth: "85%",
  },
  otherMessage: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 2,
  },
  messageAvatarText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    maxWidth: "100%",
  },
  myMessageBubble: {
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
  },
  messageStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  doubleCheck: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondCheck: {
    marginLeft: -8,
  },
  messageInputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  messageInputGradient: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    minHeight: 50,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInputGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contactItem: {
    marginBottom: 8,
    borderRadius: 15,
  },
  contactItemGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactAvatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 14,
  },
  emptySearchState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySearchText: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  contactMainInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  followButton: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  followButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  followButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  chatIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  searchSection: {
    marginBottom: 20,
  },
  searchSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
})
