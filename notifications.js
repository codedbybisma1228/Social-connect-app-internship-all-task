import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

class NotificationService {
  async requestPermissions() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Social Connect",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#667eea",
        sound: true,
      })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    return finalStatus === "granted"
  }

  async scheduleWelcomeNotification(userName) {
    await this.scheduleNotification(
      "Welcome to Social Connect! 🎉",
      `Hi ${userName}! Start connecting with friends and sharing your moments.`,
      { type: "welcome" },
      5, // 5 seconds delay
    )
  }

  async scheduleNotification(title, body, data = {}, seconds = 1) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: { seconds },
    })
  }

  async sendLikeNotification(userName, postContent) {
    await this.scheduleNotification(
      "New Like! ❤️",
      `${userName} liked your post: "${postContent.substring(0, 30)}..."`,
      { type: "like" },
    )
  }

  async sendCommentNotification(userName, postContent) {
    await this.scheduleNotification(
      "New Comment! 💬",
      `${userName} commented on your post: "${postContent.substring(0, 30)}..."`,
      { type: "comment" },
    )
  }

  async sendFollowNotification(userName) {
    await this.scheduleNotification("New Follower! 👥", `${userName} started following you!`, { type: "follow" })
  }
}

export default new NotificationService()
