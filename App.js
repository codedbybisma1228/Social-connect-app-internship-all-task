"use client"

import { Provider } from "react-redux"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { store } from "./src/store/store"
import AppNavigator from "./src/navigation/AppNavigator"
import { AuthProvider } from "./src/context/AuthContext"
import { ThemeProvider, useTheme } from "./src/context/ThemeContext" // Import ThemeProvider and useTheme

// Create a wrapper component to apply StatusBar style based on theme
function ThemedStatusBar() {
  const { currentTheme } = useTheme()
  return <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          {" "}
          {/* Wrap with ThemeProvider */}
          <NavigationContainer>
            <ThemedStatusBar /> {/* Use the themed status bar */}
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  )
}
