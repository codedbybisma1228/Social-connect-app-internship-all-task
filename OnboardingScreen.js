"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext" // Import useTheme
import { COLORS } from "../utils/constants" // Import centralized constants

const { width } = Dimensions.get("window")

const onboardingData = [
  {
    id: 1,
    icon: "people",
    title: "Connect with Friends",
    description: "Find and connect with friends, family, and like-minded people from around the world.",
  },
  {
    id: 2,
    icon: "camera",
    title: "Share Your Moments",
    description: "Share photos, thoughts, and experiences with your network. Express yourself freely!",
  },
  {
    id: 3,
    icon: "heart",
    title: "Engage & Interact",
    description: "Like, comment, and share posts. Build meaningful connections through conversations.",
  },
]

export default function OnboardingScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { dynamicGradients } = useTheme() // Use theme context

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentItem = onboardingData[currentIndex]

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <View style={styles.content}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: COLORS.white }]}>Skip</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <LinearGradient colors={dynamicGradients.secondary} style={styles.iconContainer}>
            <Ionicons name={currentItem.icon} size={80} color={COLORS.white} />
          </LinearGradient>

          <Text style={[styles.title, { color: COLORS.white }]}>{currentItem.title}</Text>
          <Text style={[styles.description, { color: "rgba(255,255,255,0.9)" }]}>{currentItem.description}</Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex
                    ? { backgroundColor: COLORS.white }
                    : { backgroundColor: "rgba(255,255,255,0.4)" },
                ]}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient colors={dynamicGradients.secondary} style={styles.nextButtonGradient}>
              <Text style={[styles.nextButtonText, { color: COLORS.white }]}>
                {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
              </Text>
              <Ionicons
                name={currentIndex === onboardingData.length - 1 ? "checkmark" : "arrow-forward"}
                size={20}
                color={COLORS.white}
                style={styles.nextButtonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  skipButton: {
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "300",
  },
  bottomSection: {
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  nextButton: {
    width: width - 60,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButtonGradient: {
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  nextButtonIcon: {
    marginLeft: 10,
  },
})
