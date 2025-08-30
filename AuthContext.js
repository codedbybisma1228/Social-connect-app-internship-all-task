"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding")
      if (!hasSeenOnboarding) {
        setIsFirstTime(true)
        setLoading(false)
        return
      }

      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true")
      setIsFirstTime(false)
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  const login = async (email, password) => {
    try {
      const mockUser = {
        id: "1",
        email: "bismalam300@gmail.com",
        name: "Bisma Aslam",
        profilePicture:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-07-27%20at%205.29.00%20PM-wjiZc0aMxkCi1QyV52NpAbHovc64d6.jpeg", // Updated to new picture
        bio: "Hello, I'm Bisma! Welcome to Social Connect! 🌟",
        joinDate: new Date().toISOString(),
        postsCount: 1,
        followersCount: 0,
        followingCount: 0,
      }

      await AsyncStorage.setItem("user", JSON.stringify(mockUser))
      await AsyncStorage.setItem("rememberLogin", "true")
      setUser(mockUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        email: "bismalam300@gmail.com",
        profilePicture:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-07-27%20at%205.29.00%20PM-wjiZc0aMxkCi1QyV52NpAbHovc64d6.jpeg", // Updated to new picture
        bio: "Hello, I'm Bisma! Welcome to Social Connect! 🌟",
        joinDate: new Date().toISOString(),
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
      }

      await AsyncStorage.setItem("user", JSON.stringify(newUser))
      await AsyncStorage.setItem("rememberLogin", "true")
      setUser(newUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "rememberLogin"])
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const incrementPostCount = async () => {
    try {
      const updatedUser = { ...user, postsCount: (user.postsCount || 0) + 1 }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("Error updating post count:", error)
    }
  }

  const value = {
    user,
    loading,
    isFirstTime,
    login,
    signup,
    logout,
    updateProfile,
    incrementPostCount,
    completeOnboarding,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
