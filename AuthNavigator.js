import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/auth/LoginScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"

const Stack = createStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}
