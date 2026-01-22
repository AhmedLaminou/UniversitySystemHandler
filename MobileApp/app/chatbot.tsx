import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../utils/constants';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { api } from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Bonjour ! Je suis ton assistant académique IA. Comment puis-je t\'aider aujourd\'hui ?', sender: 'ai', timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // API call to AI service
      const response = await api.ai.post('/chat', { message: input });
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, je ne peux pas répondre pour le moment. Vérifiez votre connexion.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.surfaceDark]}
        style={styles.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Sparkles color={COLORS.cyberCyan} size={20} />
          <Text style={styles.headerTitle}>Assistant IA</Text>
        </View>
        <Text style={styles.statusText}>En ligne</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[
            styles.messageRow,
            msg.sender === 'user' ? styles.userRow : styles.aiRow
          ]}>
            {msg.sender === 'ai' && (
              <View style={styles.aiAvatar}>
                <Bot size={16} color={COLORS.cyberCyan} />
              </View>
            )}
            
            <View style={[
              styles.bubble,
              msg.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                msg.sender === 'user' ? styles.userText : styles.aiText
              ]}>
                {msg.text}
              </Text>
            </View>

            {msg.sender === 'user' && (
              <View style={styles.userAvatar}>
                <User size={16} color="#fff" />
              </View>
            )}
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>L'IA est en train d'écrire...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Posez une question..."
            placeholderTextColor={COLORS.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surfaceDark,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 18,
  },
  statusText: {
    color: COLORS.neonGreen,
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  userBubble: {
    backgroundColor: COLORS.cyberPurple,
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: COLORS.text,
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cyberCyan,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.cyberPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: COLORS.surfaceDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: COLORS.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.cyberCyan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    marginLeft: 50,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  }
});
