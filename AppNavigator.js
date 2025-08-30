"use client"

import { useState } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../context/AuthContext"
import AuthNavigator from "./AuthNavigator"
import MainNavigator from "./MainNavigator"
import LoadingScreen from "../screens/LoadingScreen"
import SplashScreen from "../screens/SplashScreen"
import OnboardingScreen from "../screens/OnboardingScreen"

const Stack = createStackNavigator()

export default function AppNavigator() {
  const { user, loading, isFirstTime, completeOnboarding } = useAuth()
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashFinish = () => {
    setShowSplash(false)
  }

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen />
  }

  // Show onboarding for first-time users
  if (isFirstTime) {
    return <OnboardingScreen onComplete={completeOnboarding} />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  )
}
