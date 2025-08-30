"use client"

import { View, Image, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext" // Import useTheme
import { COLORS } from "../utils/constants" // Import centralized constants

export default function UserAvatar({ uri, size = 40, style }) {
  const { dynamicColors } = useTheme() // Use theme context

  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  }

  return (
    <View style={[styles.container, avatarSize, style, { backgroundColor: dynamicColors.iconBackground }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, avatarSize]} />
      ) : (
        <Ionicons name="person" size={size * 0.6} color={COLORS.primary} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "cover",
  },
})
