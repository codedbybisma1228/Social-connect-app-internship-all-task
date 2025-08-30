"use client"

import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { COLORS } from "../utils/constants" // Corrected import path

export default function LoadingScreen() {
  const { dynamicColors } = useTheme() // Use theme context

  return (
    <View style={[styles.container, { backgroundColor: dynamicColors.background }]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
