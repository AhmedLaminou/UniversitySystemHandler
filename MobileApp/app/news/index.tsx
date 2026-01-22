import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../utils/constants';
import { Stack, useRouter } from 'expo-router';
import { Calendar, ArrowRight, Tag } from 'lucide-react-native';
import { CyberCard } from '../../components/ui/CyberCard';

export default function NewsScreen() {
  const router = useRouter();
  
  const NEWS = [
    { id: '1', title: 'Nouvelle Formation en IA', date: '5 Jan 2026', category: 'Actualités', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', excerpt: 'Lancement du master spécialisé en Intelligence Artificielle...' },
    { id: '2', title: 'Hackathon Innovation 2026', date: '10 Jan 2026', category: 'Événements', image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&q=80', excerpt: 'Rejoignez le plus grand hackathon de l\'année...' },
    { id: '3', title: 'Partenariat Google', date: '28 Dec 2025', category: 'Partenariats', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80', excerpt: 'Collaboration stratégique pour la recherche...' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[COLORS.background, COLORS.surfaceDark]} style={styles.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>ACTUALITÉS</Text>
      </View>

      <FlatList
        data={NEWS}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CyberCard style={styles.card} variant="cyan">
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
            
            <View style={styles.content}>
              <View style={styles.dateRow}>
                <Calendar color={COLORS.cyberCyan} size={12} />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.excerpt}>{item.excerpt}</Text>
              
              <TouchableOpacity style={styles.readMoreBtn}>
                <Text style={styles.readMoreText}>Lire la suite</Text>
                <ArrowRight color={COLORS.cyberPurple} size={16} />
              </TouchableOpacity>
            </View>
          </CyberCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  background: { ...StyleSheet.absoluteFillObject },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 15 },
  title: { color: COLORS.text, fontFamily: FONTS.heading, fontSize: 24, fontWeight: 'bold' },
  list: { padding: 20 },
  card: { marginBottom: 20, overflow: 'hidden' },
  imageContainer: { height: 150, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%' },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.cyberPurple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  content: { paddingTop: 15 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  dateText: { color: COLORS.cyberCyan, fontSize: 12 },
  cardTitle: { color: COLORS.text, fontFamily: FONTS.heading, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  excerpt: { color: COLORS.textMuted, fontSize: 14, lineHeight: 20, marginBottom: 15 },
  readMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  readMoreText: { color: COLORS.cyberPurple, fontWeight: 'bold' },
});
