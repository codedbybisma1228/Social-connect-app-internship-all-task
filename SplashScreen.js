"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext" // Import useTheme
import { COLORS } from "../utils/constants" // Import centralized constants

export default function SplashScreen({ onFinish }) {
  const { dynamicGradients } = useTheme() // Use theme context
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.5)

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    // Auto navigate after 60 seconds
    const timer = setTimeout(() => {
      onFinish()
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        
        <Text style={[styles.appName, { color: COLORS.white }]}>Conectera</Text>
        <Text style={[styles.tagline, { color: "rgba(255,255,255,0.9)" }]}>Connect • Share • Inspire</Text>

        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingDot, { backgroundColor: COLORS.white }]} />
          <Animated.View style={[styles.loadingDot, { marginLeft: 10, backgroundColor: COLORS.white }]} />
          <Animated.View style={[styles.loadingDot, { marginLeft: 10, backgroundColor: COLORS.white }]} />
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 2,
    marginBottom: 50,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
})
