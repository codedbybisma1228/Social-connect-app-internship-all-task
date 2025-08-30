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
  ScrollView,
} from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext" // Import useTheme
import { COLORS } from "../../utils/constants" // Import centralized constants

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
})

export default function SignUpScreen({ navigation }) {
  const { signup } = useAuth()
  const { dynamicColors, dynamicGradients } = useTheme() // Use theme context

  const handleSignUp = async (values, { setSubmitting }) => {
    const { confirmPassword, ...userData } = values
    const result = await signup(userData)
    if (!result.success) {
      Alert.alert("Sign Up Failed", result.error)
    } else {
      Alert.alert("Welcome!", "Account created successfully! Welcome to Social Connect! 🎉")
    }
    setSubmitting(false)
  }

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                <Ionicons name="person-add" size={40} color={COLORS.white} />
              </LinearGradient>
              <Text style={[styles.title, { color: COLORS.white }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: "rgba(255,255,255,0.9)" }]}>
                Join Social Connect today and start connecting!
              </Text>
            </View>

            <Formik
              initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
              validationSchema={SignUpSchema}
              onSubmit={handleSignUp}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <LinearGradient colors={dynamicGradients.input} style={styles.inputGradient}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={dynamicColors.textMuted}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          { color: dynamicColors.textPrimary },
                          touched.name && errors.name && styles.inputError,
                        ]}
                        placeholder="Full Name"
                        placeholderTextColor={dynamicColors.textMuted}
                        value={values.name}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        autoCapitalize="words"
                      />
                    </LinearGradient>
                    {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <LinearGradient colors={dynamicGradients.input} style={styles.inputGradient}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={dynamicColors.textMuted}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          { color: dynamicColors.textPrimary },
                          touched.email && errors.email && styles.inputError,
                        ]}
                        placeholder="Email Address"
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
                        placeholder="Password"
                        placeholderTextColor={dynamicColors.textMuted}
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        secureTextEntry
                      />
                    </LinearGradient>
                    {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
                          touched.confirmPassword && errors.confirmPassword && styles.inputError,
                        ]}
                        placeholder="Confirm Password"
                        placeholderTextColor={dynamicColors.textMuted}
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        secureTextEntry
                      />
                    </LinearGradient>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <LinearGradient colors={dynamicGradients.secondary} style={styles.buttonGradient}>
                      {isSubmitting ? (
                        <Text style={[styles.buttonText, { color: COLORS.white }]}>Creating Account...</Text>
                      ) : (
                        <>
                          <Ionicons
                            name="person-add-outline"
                            size={20}
                            color={COLORS.white}
                            style={styles.buttonIcon}
                          />
                          <Text style={[styles.buttonText, { color: COLORS.white }]}>Create Account</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: "rgba(255,255,255,0.8)" }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={[styles.loginLink, { color: COLORS.white }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
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
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "700",
  },
})
