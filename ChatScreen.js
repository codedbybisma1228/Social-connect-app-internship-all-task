"use client"

import { useState } from "react"
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../../context/ThemeContext"
import { COLORS } from "../../utils/constants"

export default function ChatScreen({ navigation }) {
  const { dynamicColors, dynamicGradients } = useTheme()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you?", sender: "other", time: "10:30 AM" },
    { id: 2, text: "I'm good! Thanks for asking 😊", sender: "me", time: "10:32 AM" },
  ])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === "me" ? styles.myMessage : styles.otherMessage]}>
      <LinearGradient
        colors={item.sender === "me" ? dynamicGradients.secondary : dynamicGradients.card}
        style={[styles.messageGradient, item.sender === "me" ? styles.myMessageGradient : styles.otherMessageGradient]}
      >
        <Text style={[styles.messageText, { color: item.sender === "me" ? COLORS.white : dynamicColors.textPrimary }]}>
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { color: item.sender === "me" ? "rgba(255,255,255,0.7)" : dynamicColors.textSecondary },
          ]}
        >
          {item.time}
        </Text>
      </LinearGradient>
    </View>
  )

  return (
    <LinearGradient colors={dynamicGradients.primary} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient colors={dynamicGradients.card} style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: COLORS.primary }]}>Chat</Text>
              <View style={styles.placeholder} />
            </View>
          </LinearGradient>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <LinearGradient colors={dynamicGradients.card} style={styles.inputGradient}>
            <TextInput
              style={[styles.textInput, { color: dynamicColors.textPrimary }]}
              placeholder="Type a message..."
              placeholderTextColor={dynamicColors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <LinearGradient colors={dynamicGradients.secondary} style={styles.sendButtonGradient}>
                <Ionicons name="send" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  headerGradient: {
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginVertical: 5,
  },
  myMessage: {
    alignItems: "flex-end",
  },
  otherMessage: {
    alignItems: "flex-start",
  },
  messageGradient: {
    borderRadius: 15,
    padding: 12,
    maxWidth: "80%",
  },
  myMessageGradient: {
    borderBottomRightRadius: 5,
  },
  otherMessageGradient: {
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputGradient: {
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})
