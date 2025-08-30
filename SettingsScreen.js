"use client"
import { useState } from "react"
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS, GRADIENTS } from "../../utils/constants" // Import centralized constants
import NotificationService from "../../services/notifications" // Import NotificationService

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth()
  const { currentTheme, setTheme, dynamicColors, dynamicGradients } = useTheme() // Use theme context
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("English")

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout from Connectera?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Logout cancelled"),
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout()
              Alert.alert("Goodbye! 👋", "You have been logged out successfully.")
            } catch (error) {
              Alert.alert("Error", "Failed to logout. Please try again.")
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleNotifications = () => {
    Alert.alert(
      "Notifications 🔔",
      "Manage your notification preferences:",
      [
        {
          text: notificationsEnabled ? "Disable Notifications" : "Enable Notifications",
          onPress: async () => {
            const newStatus = !notificationsEnabled
            setNotificationsEnabled(newStatus)
            if (newStatus) {
              const granted = await NotificationService.requestPermissions()
              if (granted) {
                Alert.alert("Notifications Enabled", "You will now receive notifications.")
              } else {
                Alert.alert("Permission Denied", "Please enable notification permissions in your device settings.")
                setNotificationsEnabled(false) // Revert if permission not granted
              }
            } else {
              Alert.alert("Notifications Disabled", "You will no longer receive notifications.")
            }
          },
        },
        {
          text: "Send Test Notification",
          onPress: async () => {
            if (notificationsEnabled) {
              await NotificationService.scheduleNotification(
                "Test Notification",
                "This is a test notification from Connectera!",
                {},
                1,
              )
              Alert.alert("Test Sent!", "Check your device for a test notification.")
            } else {
              Alert.alert("Notifications Disabled", "Please enable notifications to send a test.")
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    )
  }

  const handlePrivacy = () => {
    Alert.alert(
      "Privacy & Security 🔒",
      "Privacy settings coming soon! Features will include:\n\n• Account privacy\n• Blocked users\n• Data download\n• Two-factor authentication",
      [{ text: "Understood", style: "default" }],
    )
  }

  const handleHelp = () => {
    Alert.alert(
      "Help & Support 💬",
      "Need assistance? We're here to help!\n\n📧 Email: support@Connectera.com\n💬 Live Chat: Available 24/7\n📱 Phone: +1 (555) 123-4567\n\nOr visit our FAQ section for quick answers.",
      [
        { text: "Contact Support", onPress: () => Alert.alert("Redirecting...", "Opening support chat...") },
        { text: "Close", style: "cancel" },
      ],
    )
  }

  const handleAbout = () => {
    Alert.alert(
      "About Connectera ℹ️",
      "Connectera v1.0.0\n\n🚀 Built with React Native & Expo\n💜 Made with love for connecting people\n🌟 Your feedback makes us better\n\n© 2024 Connectera. All rights reserved.",
      [
        { text: "Rate App", onPress: () => Alert.alert("Thank you! ⭐", "Redirecting to app store...") },
        { text: "Close", style: "cancel" },
      ],
    )
  }

  const handleProfile = () => {
    navigation.navigate("Profile")
  }

  const handleTheme = () => {
    Alert.alert(
      "Theme Settings 🎨",
      "Choose your app theme:",
      [
        {
          text: "System Default",
          onPress: () => {
            setTheme("system") // Set to system to let useColorScheme dictate
            Alert.alert("Theme Changed", "App theme set to System Default.")
          },
        },
        {
          text: "Light Theme",
          onPress: () => {
            setTheme("light")
            Alert.alert("Theme Changed", "App theme set to Light.")
          },
        },
        {
          text: "Dark Theme",
          onPress: () => {
            setTheme("dark")
            Alert.alert("Theme Changed", "App theme set to Dark.")
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    )
  }

  const handleLanguage = () => {
    Alert.alert(
      "Language Settings 🌍",
      "Choose your preferred language:",
      [
        {
          text: "English",
          onPress: () => {
            setCurrentLanguage("English")
            Alert.alert("Language Changed", "App language set to English.")
          },
        },
        {
          text: "Spanish",
          onPress: () => {
            setCurrentLanguage("Spanish")
            Alert.alert("Language Changed", "App language set to Spanish.")
          },
        },
        {
          text: "French",
          onPress: () => {
            setCurrentLanguage("French")
            Alert.alert("Language Changed", "App language set to French.")
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    )
  }

  const handleAddAccount = () => {
    Alert.alert("Add Account", "This feature allows you to add another onnectera account.", [{ text: "OK" }])
  }

  const handleLogoutAllAccounts = () => {
    Alert.alert(
      "Logout All Accounts",
      "Are you sure you want to log out from all accounts? This will clear all saved sessions.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout All",
          style: "destructive",
          onPress: async () => {
            // Simulate logging out all accounts
            await logout() // Assuming logout clears current user and effectively all
            Alert.alert("All Accounts Logged Out", "You have been logged out from all accounts.")
          },
        },
      ],
    )
  }

  const settingsSections = [
    {
      title: "General",
      options: [
        {
          id: "profile",
          title: "Edit Profile",
          subtitle: "Update your personal information",
          icon: "person-outline",
          gradient: GRADIENTS.settingsIcon1,
          onPress: handleProfile,
        },
        {
          id: "notifications",
          title: "Notifications",
          subtitle: notificationsEnabled ? "Enabled" : "Disabled",
          icon: "notifications-outline",
          gradient: GRADIENTS.settingsIcon2,
          onPress: handleNotifications,
        },
        {
          id: "privacy",
          title: "Privacy & Security",
          subtitle: "Control your privacy settings",
          icon: "shield-outline",
          gradient: GRADIENTS.settingsIcon3,
          onPress: handlePrivacy,
        },
        {
          id: "theme",
          title: "Theme",
          subtitle: `Current: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`,
          icon: "color-palette-outline",
          gradient: GRADIENTS.settingsIcon4,
          onPress: handleTheme,
        },
        {
          id: "language",
          title: "Language",
          subtitle: `Current: ${currentLanguage}`,
          icon: "language-outline",
          gradient: GRADIENTS.settingsIcon5,
          onPress: handleLanguage,
        },
      ],
    },
    {
      title: "Support & About",
      options: [
        {
          id: "help",
          title: "Help & Support",
          subtitle: "Get help and contact support",
          icon: "help-circle-outline",
          gradient: GRADIENTS.settingsIcon6,
          onPress: handleHelp,
        },
        {
          id: "about",
          title: "About Connectera",
          subtitle: "App info and version details",
          icon: "information-circle-outline",
          gradient: GRADIENTS.settingsIcon7,
          onPress: handleAbout,
        },
      ],
    },
    {
      title: "Account Actions",
      options: [
        {
          id: "add_account",
          title: "Add account",
          icon: "person-add-outline",
          gradient: GRADIENTS.settingsIcon8,
          onPress: handleAddAccount,
          isAction: true,
          actionColor: COLORS.primary,
        },
        {
          id: "logout",
          title: "Log out",
          icon: "log-out-outline",
          gradient: GRADIENTS.danger,
          onPress: handleLogout,
          isAction: true,
          actionColor: COLORS.error,
        },
        {
          id: "logout_all",
          title: "Log out all accounts",
          icon: "log-out-outline",
          gradient: GRADIENTS.danger,
          onPress: handleLogoutAllAccounts,
          isAction: true,
          actionColor: COLORS.error,
        },
      ],
    },
  ]

  return (
    <View style={[styles.container, { backgroundColor: dynamicColors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: dynamicColors.cardBackground, borderBottomColor: dynamicColors.separator },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={dynamicColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicColors.textPrimary }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <LinearGradient colors={dynamicGradients.primary} style={styles.userCardGradient}>
            <View style={styles.userInfo}>
              <LinearGradient colors={dynamicGradients.secondary} style={styles.userAvatar}>
                {user?.profilePicture ? (
                  <Image source={{ uri: user.profilePicture }} style={styles.userAvatarImage} />
                ) : (
                  <Ionicons name="person" size={30} color={COLORS.white} />
                )}
              </LinearGradient>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || "User"}</Text>
                <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
                <View style={styles.userBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.userBadgeText}>Verified Account</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: dynamicColors.textMuted }]}>{section.title}</Text>
            <View style={[styles.section, { backgroundColor: dynamicColors.cardBackground }]}>
              {section.options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.settingItem,
                    { borderBottomColor: dynamicColors.separator },
                    optionIndex === section.options.length - 1 && styles.lastItem,
                  ]}
                  onPress={option.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingContent}>
                    {option.gradient ? (
                      <LinearGradient colors={option.gradient} style={styles.settingIconBackground}>
                        <Ionicons name={option.icon} size={20} color={COLORS.white} />
                      </LinearGradient>
                    ) : (
                      <View style={[styles.settingIconBackground, { backgroundColor: dynamicColors.iconBackground }]}>
                        <Ionicons name={option.icon} size={20} color={dynamicColors.textPrimary} />
                      </View>
                    )}
                    <View style={styles.settingText}>
                      <Text
                        style={[
                          styles.settingTitleText,
                          { color: option.isAction ? option.actionColor : dynamicColors.textPrimary },
                        ]}
                      >
                        {option.title}
                      </Text>
                      {option.subtitle && (
                        <Text style={[styles.settingSubtitleText, { color: dynamicColors.textSecondary }]}>
                          {option.subtitle}
                        </Text>
                      )}
                    </View>
                    <View style={styles.settingArrow}>
                      <Ionicons name="chevron-forward" size={20} color={dynamicColors.textMuted} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: dynamicColors.textMuted }]}>Social Connect v1.0.0</Text>
          <Text style={[styles.versionSubtext, { color: dynamicColors.textMuted }]}>
            Made with 💜 for connecting people
          </Text>
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Adjust for status bar
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1, // Allows title to take available space
    textAlign: "center", // Center the title
  },
  placeholder: {
    width: 34, // To balance the back button space
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  userCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  userCardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  userAvatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  userBadgeText: {
    fontSize: 12,
    color: COLORS.white,
    marginLeft: 4,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    paddingHorizontal: 16,
    textTransform: "uppercase",
  },
  section: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden", // Ensures border radius applies to children
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  settingItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconBackground: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  settingText: {
    flex: 1,
  },
  settingTitleText: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtitleText: {
    fontSize: 13,
    marginTop: 2,
  },
  settingArrow: {
    marginLeft: 8,
  },
  versionSection: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    fontStyle: "italic",
  },
})
