import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, LAYOUT } from '../../utils/constants';
import { GlitchText } from '../../components/ui/GlitchText';
import { CyberCard } from '../../components/ui/CyberCard';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      // Direct call to auth service
      // NOTE: Adjust payload structure based on your actual backend requirement
      const response = await api.auth.post('/login', { email, password });
      
      const { token, user } = response.data;
      
      if (token) {
        await signIn(token, user || { email, name: 'Student' });
        router.replace('/(tabs)/home');
      } else {
        throw new Error('No token received');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Échec de connexion', error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.background, COLORS.surfaceDark]}
        style={styles.background}
      />
      
      {/* Cyber Grid Overlay (Simplified with simple view stripes for now, would use SVG in prod) */}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <GlitchText text="UniPortal" size="xl" style={styles.title} />
          <Text style={styles.subtitle}>Espace Académique Futuriste</Text>
        </View>

        <CyberCard variant="cyan" style={styles.formCard}>
          <Text style={styles.formTitle}>CONNEXION</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput 
              style={styles.input}
              placeholder="student@university.tn"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>MOT DE PASSE</Text>
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={COLORS.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>ACCÉDER</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </CyberCard>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>
            Pas de compte ? <Text style={styles.linkHighlight}>S'inscrire</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 10,
    color: COLORS.primary,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 16,
    letterSpacing: 1,
  },
  formCard: {
    marginBottom: 30,
  },
  formTitle: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.cyberCyan,
    fontFamily: FONTS.body,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: FONTS.body,
  },
  loginButton: {
    marginTop: 10,
    shadowColor: COLORS.cyberCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  gradientButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.surfaceDark,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    fontSize: 16,
    letterSpacing: 1,
  },
  linkText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
  linkHighlight: {
    color: COLORS.cyberPurple,
    fontWeight: 'bold',
  },
});
