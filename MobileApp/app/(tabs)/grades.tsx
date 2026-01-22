import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../utils/constants';
import { CyberCard } from '../../components/ui/CyberCard';
import { Trophy, TrendingUp, AlertCircle } from 'lucide-react-native';

interface Grade {
  id: string;
  course: string;
  grade: number;
  coefficient: number;
}

export default function GradesScreen() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Data
    setTimeout(() => {
      setGrades([
        { id: '1', course: 'Architecture SOA', grade: 16.5, coefficient: 4 },
        { id: '2', course: 'Dev Mobile', grade: 18.0, coefficient: 3 },
        { id: '3', course: 'IA & Data Mining', grade: 14.5, coefficient: 5 },
        { id: '4', course: 'Sécurité', grade: 12.0, coefficient: 3 },
        { id: '5', course: 'Anglais Technique', grade: 17.0, coefficient: 1 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const totalPoints = grades.reduce((acc, curr) => acc + (curr.grade * curr.coefficient), 0);
    const totalCoeff = grades.reduce((acc, curr) => acc + curr.coefficient, 0);
    return (totalPoints / totalCoeff).toFixed(2);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return COLORS.neonGreen;
    if (grade >= 10) return COLORS.cyberCyan;
    return COLORS.error;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.surfaceDark]}
        style={styles.background}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>MES RÉSULTATS</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.cyberCyan} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* GPA Summary Card */}
          <CyberCard gradient style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View>
                <Text style={styles.gpaLabel}>MOYENNE GÉNÉRALE</Text>
                <Text style={styles.gpaValue}>{calculateAverage()}<Text style={styles.gpaScale}>/20</Text></Text>
              </View>
              <View style={styles.trophyContainer}>
                <Trophy size={40} color={COLORS.accent} />
              </View>
            </View>
          </CyberCard>

          {/* Grades List */}
          <Text style={styles.sectionTitle}>NOTES PAR MATIÈRE</Text>
          
          {grades.map((item) => (
            <View key={item.id} style={styles.gradeRow}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{item.course}</Text>
                <Text style={styles.coeffText}>Coeff: {item.coefficient}</Text>
              </View>
              
              <View style={styles.gradeContainer}>
                <View style={[styles.progressBarBg, { width: 100 }]}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: (item.grade / 20) * 100, backgroundColor: getGradeColor(item.grade) }
                    ]} 
                  />
                </View>
                <Text style={[styles.gradeValue, { color: getGradeColor(item.grade) }]}>
                  {item.grade}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    marginBottom: 30,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpaLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 5,
  },
  gpaValue: {
    color: '#fff',
    fontFamily: FONTS.heading,
    fontSize: 48,
    fontWeight: 'bold',
  },
  gpaScale: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
  },
  trophyContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    color: COLORS.cyberCyan,
    fontFamily: FONTS.heading,
    marginBottom: 20,
    fontSize: 14,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.border,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 14,
    marginBottom: 4,
  },
  coeffText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  gradeContainer: {
    alignItems: 'flex-end',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  gradeValue: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
