"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useColorScheme } from "react-native"
import { COLORS, GRADIENTS } from "../utils/constants"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme() // 'light' or 'dark'
  const [currentTheme, setCurrentTheme] = useState(systemColorScheme || "light") // Default to system or light

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme")
        if (savedTheme) {
          setCurrentTheme(savedTheme)
        } else {
          // If no theme saved, use system preference
          setCurrentTheme(systemColorScheme || "light")
        }
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage:", error)
        setCurrentTheme(systemColorScheme || "light") // Fallback
      }
    }
    loadTheme()
  }, [systemColorScheme])

  const setTheme = async (theme) => {
    try {
      await AsyncStorage.setItem("appTheme", theme)
      setCurrentTheme(theme)
    } catch (error) {
      console.error("Failed to save theme to AsyncStorage:", error)
    }
  }

  // Function to get dynamic colors based on currentTheme
  const getDynamicColors = (theme) => {
    return theme === "dark" ? COLORS.dark : COLORS.light
  }

  // Function to get dynamic gradients based on currentTheme
  const getDynamicGradients = (theme) => {
    const baseGradients = {
      ...GRADIENTS, // Include all static gradients
      card: theme === "dark" ? GRADIENTS.cardDark : GRADIENTS.cardLight,
      header: theme === "dark" ? GRADIENTS.headerDark : GRADIENTS.headerLight,
      input: theme === "dark" ? GRADIENTS.inputDark : GRADIENTS.inputLight,
    }

    // Defensive check: Ensure all gradient values are arrays
    const validatedGradients = {}
    for (const key in baseGradients) {
      if (Object.prototype.hasOwnProperty.call(baseGradients, key)) {
        if (Array.isArray(baseGradients[key])) {
          validatedGradients[key] = baseGradients[key]
        } else {
          // Fallback to a default primary gradient if not an array
          console.warn(`Gradient '${key}' is not an array. Falling back to COLORS.primary. Value:`, baseGradients[key])
          validatedGradients[key] = [COLORS.primary, COLORS.primary] // Provide a safe fallback
        }
      }
    }
    return validatedGradients
  }

  const dynamicColors = getDynamicColors(currentTheme)
  const dynamicGradients = getDynamicGradients(currentTheme)

  const value = {
    currentTheme,
    setTheme,
    dynamicColors,
    dynamicGradients,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
