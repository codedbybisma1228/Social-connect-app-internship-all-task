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
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS } from "../../utils/constants" // Import centralized constants

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
})

export default function ForgotPasswordScreen({ navigation }) {
  const { dynamicColors, dynamicGradients } = useTheme() // Use theme context

  const handleForgotPassword = async (values, { setSubmitting }) => {
    // Mock forgot password functionality
    setTimeout(() => {
      Alert.alert(
        "Reset Link Sent! 📧",
        `A password reset link has been sent to ${values.email}. Please check your inbox and follow the instructions.`,
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      )
      setSubmitting(false)
    }, 1500)
  }

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <LinearGradient colors={dynamicGradients.secondary} style={styles.logoBackground}>
              <Ionicons name="key" size={40} color={COLORS.white} />
            </LinearGradient>
            <Text style={[styles.title, { color: COLORS.white }]}>Forgot Password?</Text>
            <Text style={[styles.subtitle, { color: "rgba(255,255,255,0.9)" }]}>
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>

          <Formik initialValues={{ email: "" }} validationSchema={ForgotPasswordSchema} onSubmit={handleForgotPassword}>
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
                      placeholder="Enter your email address"
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

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <LinearGradient colors={dynamicGradients.secondary} style={styles.buttonGradient}>
                    {isSubmitting ? (
                      <Text style={[styles.buttonText, { color: COLORS.white }]}>Sending...</Text>
                    ) : (
                      <>
                        <Ionicons name="send-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { color: COLORS.white }]}>Send Reset Link</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <TouchableOpacity style={styles.backToLoginButton} onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.backToLoginText, { color: COLORS.white }]}>← Back to Sign In</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 30,
    paddingTop: 50,
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "300",
    paddingHorizontal: 10,
  },
  form: {
    marginBottom: 40,
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
  backToLoginButton: {
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: "500",
  },
})
