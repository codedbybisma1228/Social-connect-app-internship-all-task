"use client"
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import * as ImagePicker from "expo-image-picker"
import { useDispatch } from "react-redux"
import { addPost } from "../../store/slices/postsSlice"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS } from "../../utils/constants" // Import centralized constants

export default function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [isPosting, setIsPosting] = useState(false)
  const { user, incrementPostCount } = useAuth()
  const dispatch = useDispatch()
  const { dynamicColors, dynamicGradients } = useTheme() // Use theme context

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert("Empty Post", "Please add some content or an image to your post.")
      return
    }

    setIsPosting(true)

    setTimeout(() => {
      const newPost = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.profilePicture,
        content: content.trim(),
        image: selectedImage,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: [],
      }

      dispatch(addPost(newPost))
      incrementPostCount() // Update post count
      setIsPosting(false)
      navigation.goBack()
      Alert.alert("Success", "Your post has been shared!")
    }, 1000)
  }

  const removeImage = () => {
    setSelectedImage(null)
  }

  const isPostDisabled = !content.trim() && !selectedImage

  return (
    <LinearGradient colors={dynamicGradients.secondary} style={styles.container}>
       

      {/* Sub Header */}
      <View
        style={[
          styles.subHeader,
          { backgroundColor: dynamicColors.cardBackground, borderBottomColor: dynamicColors.separator },
        ]}
      >
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelText, { color: COLORS.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: dynamicColors.textPrimary }]}>Create Post</Text>
        <TouchableOpacity
          style={[styles.postButton, !isPostDisabled && styles.postButtonEnabled]}
          onPress={handlePost}
          disabled={isPosting || isPostDisabled}
        >
          <LinearGradient
            colors={!isPostDisabled ? dynamicGradients.primary : [dynamicColors.separator, dynamicColors.separator]}
            style={styles.postButtonGradient}
          >
            <Text
              style={[styles.postText, !isPostDisabled ? { color: COLORS.white } : { color: dynamicColors.textMuted }]}
            >
              {isPosting ? "Posting..." : "Post"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={[styles.keyboardView, { backgroundColor: dynamicColors.cardBackground }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <LinearGradient colors={dynamicGradients.primary} style={styles.avatar}>
              {user?.profilePicture ? (
                <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={24} color={COLORS.white} />
              )}
            </LinearGradient>
            <Text style={[styles.userName, { color: dynamicColors.textPrimary }]}>{user?.name || "User"}</Text>
          </View>

          {/* Text Input */}
          {/* Text Input with Fixed Counter */}
<View style={styles.inputWrapper}>
  <TextInput
    style={[styles.textInput, { color: dynamicColors.textPrimary }]}
    placeholder="What's on your mind?"
    placeholderTextColor={dynamicColors.textMuted}
    multiline
    value={content}
    onChangeText={setContent}
    maxLength={1000}
    textAlignVertical="top"
  />
     <View style={styles.fixedCounter}>
     <Text style={[styles.characterCountText, { color: dynamicColors.textMuted }]}>
     </Text>
     </View>
     </View>
          

          {/* Selected Image */}
          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <Ionicons name="close-circle" size={30} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}

          {/* Character Count */}
          <View style={styles.characterCount}>
            <Text style={[styles.characterCountText, { color: dynamicColors.textMuted }]}>{content.length}/1000</Text>
          </View>
        </ScrollView>

        {/* Bottom Toolbar */}
        <View
          style={[
            styles.toolbar,
            { backgroundColor: dynamicColors.cardBackground, borderTopColor: dynamicColors.separator },
          ]}
        >
          <TouchableOpacity style={styles.toolbarButton} onPress={handleImagePicker}>
            <LinearGradient colors={dynamicGradients.secondary} style={styles.toolbarButtonGradient}>
              <Ionicons name="image" size={24} color={COLORS.white} />
              <Text style={[styles.toolbarButtonText, { color: COLORS.white }]}>Photo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 17,
  },
  subHeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  postButton: {
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postButtonEnabled: {
    shadowOpacity: 0.3,
  },
  postButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
  },
  postText: {
    fontSize: 17,
    fontWeight: "600",
  },
  keyboardView: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
  },
   inputWrapper: {
    position: 'relative', // Needed for absolute positioning
    marginBottom: 15,
  },
  textInput: {
    fontSize: 17,
    paddingVertical: 8,
    lineHeight: 22,
    textAlignVertical: "top",
  },
    fixedCounter: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  characterCountText: {
    fontSize: 13,
  },
  imageContainer: {
    position: "relative",
    marginVertical: 12,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
  },
  characterCount: {
    alignItems: "flex-end",
     marginTop: -85,
  },
  characterCountText: {
    fontSize: 13,
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
  },
  toolbarButton: {
    alignSelf: "flex-start",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolbarButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  toolbarButtonText: {
    fontSize: 17,
    marginLeft: 6,
    fontWeight: "600",
  },
})
