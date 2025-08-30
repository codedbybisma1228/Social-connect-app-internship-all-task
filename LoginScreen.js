"use client"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS } from "../../utils/constants" // Import centralized constants

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

export default function LoginScreen({ navigation }) {
  const { login } = useAuth()
  const { dynamicColors, dynamicGradients } = useTheme() // Use theme context

  const handleLogin = async (values, { setSubmitting }) => {
    const result = await login(values.email, values.password)
    if (!result.success) {
      Alert.alert("Login Failed", result.error)
    } else {
      Alert.alert("Welcome!", "Login successful! Welcome to your app! 🎉")
    }
    setSubmitting(false)
  }

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.content}>
           {/* Logo Section */}
          <View style={styles.logoSection}>
            <Text style={[styles.appTitle, { color: COLORS.white }]}>Conectera</Text>
            <Text style={[styles.welcomeText, { color: "rgba(255,255,255,0.9)" }]}>
              Welcome back! Please sign in to continue
            </Text>
          </View>

          <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleLogin}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <LinearGradient colors={dynamicGradients.input} style={styles.inputGradient}>
                    <Ionicons name="mail-outline" size={20} color={dynamicColors.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        { color: dynamicColors.textPrimary },
                        touched.email && errors.email && styles.inputError,
                      ]}
                      placeholder="Enter your email"
                      placeholderTextColor={dynamicColors.textMuted}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </LinearGradient>
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <LinearGradient colors={dynamicGradients.input} style={styles.inputGradient}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={dynamicColors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        { color: dynamicColors.textPrimary },
                        touched.password && errors.password && styles.inputError,
                      ]}
                      placeholder="Enter your password"
                      placeholderTextColor={dynamicColors.textMuted}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry
                    />
                  </LinearGradient>
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <LinearGradient colors={dynamicGradients.secondary} style={styles.buttonGradient}>
                    {isSubmitting ? (
                      <Text style={[styles.buttonText, { color: COLORS.white }]}>Signing In...</Text>
                    ) : (
                      <>
                        <Ionicons name="log-in-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { color: COLORS.white }]}>Sign In</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={[styles.linkText, { color: COLORS.white }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: "rgba(255,255,255,0.8)" }]}>New user? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={[styles.signupLink, { color: COLORS.white }]}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "300",
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputGradient: {
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginLeft: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingRight: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  errorText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 10,
    fontWeight: "500",
  },
  button: {
    marginTop: 20,
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
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  linkButton: {
    alignItems: "center",
    marginBottom: 30,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "700",
  },
})
