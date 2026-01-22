import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../utils/constants';
import { CyberCard } from '../../components/ui/CyberCard';
import { api } from '../../services/api';
import { BookOpen, User, Calendar, Clock } from 'lucide-react-native';

interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  credits: number;
  schedule: string;
  room: string;
}

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // In production, fetch from SOAP wrapper or REST proxy
      // const response = await api.course.get('/courses');
      // setCourses(response.data);
      
      // Mock Data for Demo
      setTimeout(() => {
        setCourses([
          { id: '1', name: 'Architecture SOA', code: 'SOA-301', professor: 'Dr. Ahmed', credits: 4, schedule: 'Mardi 10:30', room: 'C204' },
          { id: '2', name: 'Développement Mobile', code: 'MOB-202', professor: 'Mme. Sarah', credits: 3, schedule: 'Jeudi 14:00', room: 'Lab 3' },
          { id: '3', name: 'Intelligence Artificielle', code: 'AIA-405', professor: 'Dr. Ben Ali', credits: 5, schedule: 'Lundi 08:30', room: 'Amphi A' },
          { id: '4', name: 'Sécurité Réseaux', code: 'SEC-303', professor: 'Mr. Pierre', credits: 3, schedule: 'Mercredi 10:30', room: 'C105' },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Course }) => (
    <CyberCard style={styles.card} variant="cyan">
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <BookOpen color={COLORS.cyberCyan} size={20} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.courseName}>{item.name}</Text>
          <Text style={styles.courseCode}>{item.code}</Text>
        </View>
        <View style={styles.creditsBadge}>
          <Text style={styles.creditsText}>{item.credits} Crédits</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <User size={14} color={COLORS.textMuted} />
          <Text style={styles.detailText}>{item.professor}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={14} color={COLORS.textMuted} />
          <Text style={styles.detailText}>{item.schedule}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={14} color={COLORS.textMuted} />
          <Text style={styles.detailText}>{item.room}</Text>
        </View>
      </View>
    </CyberCard>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.surfaceDark]}
        style={styles.background}
      />
      
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>MES COURS</Text>
        <Text style={styles.termText}>SEMESTRE 2 - 2026</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.cyberCyan} />
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  pageTitle: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 24,
    fontWeight: 'bold',
  },
  termText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 12,
    marginTop: 5,
    letterSpacing: 2,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  courseName: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseCode: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  creditsBadge: {
    backgroundColor: 'rgba(157, 0, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cyberPurple,
  },
  creditsText: {
    color: COLORS.cyberPurple,
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
