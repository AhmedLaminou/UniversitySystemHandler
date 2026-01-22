import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, LAYOUT } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { CyberCard } from '../../components/ui/CyberCard';
import { GlitchText } from '../../components/ui/GlitchText';
import { Sparkles, Calendar, Book, TrendingUp, Zap, Bell, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ gpa: '3.8', credits: '24', attendance: '95%' });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.surfaceDark]}
        style={styles.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>BONJOUR,</Text>
          <GlitchText text={user?.firstName || 'ÉTUDIANT'} size="lg" />
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Bell color={COLORS.cyberCyan} size={24} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.cyberCyan} />
        }
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <CyberCard style={{ flex: 1, marginRight: 8 }} variant="cyan">
            <View style={styles.statContent}>
              <TrendingUp color={COLORS.cyberCyan} size={24} />
              <Text style={styles.statValue}>{stats.gpa}</Text>
              <Text style={styles.statLabel}>MOYENNE</Text>
            </View>
          </CyberCard>
          
          <CyberCard style={{ flex: 1, marginLeft: 8 }} variant="purple">
            <View style={styles.statContent}>
              <Zap color={COLORS.cyberPurple} size={24} />
              <Text style={styles.statValue}>{stats.credits}</Text>
              <Text style={styles.statLabel}>CRÉDITS</Text>
            </View>
          </CyberCard>
        </View>

        {/* AI Assistant Banner */}
        <TouchableOpacity onPress={() => router.push('/chatbot')}>
          <CyberCard gradient style={styles.aiCard}>
            <View style={styles.aiContent}>
              <View>
                <Text style={styles.aiTitle}>Assistant IA</Text>
                <Text style={styles.aiDesc}>Posez une question sur vos cours...</Text>
              </View>
              <View style={styles.aiIcon}>
                <Sparkles color="#fff" size={24} />
              </View>
            </View>
          </CyberCard>
        </TouchableOpacity>

        {/* Upcoming Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROCHAINS COURS</Text>
          
          <CyberCard style={styles.classCard}>
            <View style={styles.classHeader}>
              <Text style={styles.className}>Architecture SOA</Text>
              <Text style={styles.classTime}>10:30 - 12:00</Text>
            </View>
            <View style={styles.classFooter}>
              <View style={styles.row}>
                <Calendar size={14} color={COLORS.textMuted} />
                <Text style={styles.classInfo}>Salle C204</Text>
              </View>
              <View style={styles.row}>
                <Book size={14} color={COLORS.textMuted} />
                <Text style={styles.classInfo}>Dr. Ahmed</Text>
              </View>
            </View>
          </CyberCard>

          <CyberCard style={styles.classCard}>
            <View style={styles.classHeader}>
              <Text style={styles.className}>Développement Mobile</Text>
              <Text style={styles.classTime}>14:00 - 16:00</Text>
            </View>
            <View style={styles.classFooter}>
              <View style={styles.row}>
                <Calendar size={14} color={COLORS.textMuted} />
                <Text style={styles.classInfo}>Labo 3</Text>
              </View>
              <View style={styles.row}>
                <Book size={14} color={COLORS.textMuted} />
                <Text style={styles.classInfo}>Mme. Sarah</Text>
              </View>
            </View>
          </CyberCard>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCÈS RAPIDE</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/gallery')}>
              <LinearGradient
                colors={[COLORS.surfaceLight, COLORS.surface]}
                style={styles.actionGradient}
              >
                <MessageSquare color={COLORS.accent} size={24} />
                <Text style={styles.actionText}>Galerie</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/news')}>
              <LinearGradient
                colors={[COLORS.surfaceLight, COLORS.surface]}
                style={styles.actionGradient}
              >
                <Bell color={COLORS.neonGreen} size={24} />
                <Text style={styles.actionText}>News</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 12,
    letterSpacing: 2,
  },
  notificationBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statContent: {
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },
  aiCard: {
    marginBottom: 25,
  },
  aiContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiTitle: {
    color: '#fff',
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  aiIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 14,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.cyberPurple,
    paddingLeft: 10,
  },
  classCard: {
    marginBottom: 10,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  className: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 16,
  },
  classTime: {
    color: COLORS.cyberCyan,
    fontWeight: 'bold',
  },
  classFooter: {
    flexDirection: 'row',
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  classInfo: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  actionText: {
    color: COLORS.text,
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
