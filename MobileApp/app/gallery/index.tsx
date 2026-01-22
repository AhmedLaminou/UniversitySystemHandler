import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../utils/constants';
import { Stack, useRouter } from 'expo-router';
import { Sparkles, X, MapPin } from 'lucide-react-native';

const CATEGORIES = ['Tous', 'Cérémonie', 'Événement', 'Compétition', 'Sport'];

export default function GalleryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  // Mock Data
  const EVENTS = [
    { id: '1', title: 'Remise des Diplômes', date: '5 Jan 2026', category: 'Cérémonie', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
    { id: '2', title: 'Hackathon 2026', date: '20 Dec 2025', category: 'Compétition', image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&q=80' },
    { id: '3', title: 'Conférence IA', date: '15 Dec 2025', category: 'Événement', image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80' },
    { id: '4', title: 'Tournoi de Basket', date: '10 Nov 2025', category: 'Sport', image: 'https://images.unsplash.com/photo-1546519638-68e109498ee2?w=800&q=80' },
  ];

  const filteredEvents = selectedCategory === 'Tous' 
    ? EVENTS 
    : EVENTS.filter(e => e.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[COLORS.background, COLORS.surfaceDark]} style={styles.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>GALERIE</Text>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryChip,
                item === selectedCategory && styles.activeChip
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.categoryText,
                item === selectedCategory && styles.activeCategoryText
              ]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Gallery Grid */}
      <FlatList
        data={filteredEvents}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => setSelectedImage(item)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </LinearGradient>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Lightbox Modal */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeBtn}
            onPress={() => setSelectedImage(null)}
          >
            <X color="#fff" size={30} />
          </TouchableOpacity>
          
          {selectedImage && (
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage.image }} style={styles.modalImage} resizeMode="contain" />
              <View style={styles.modalFooter}>
                <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                <View style={styles.modalRow}>
                  <MapPin color={COLORS.cyberCyan} size={16} />
                  <Text style={styles.modalInfo}>{selectedImage.category} • {selectedImage.date}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  background: { ...StyleSheet.absoluteFillObject },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 15 },
  title: { color: COLORS.text, fontFamily: FONTS.heading, fontSize: 24, fontWeight: 'bold' },
  filterContainer: { marginBottom: 20, height: 40 },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: {
    backgroundColor: COLORS.cyberPurple,
    borderColor: COLORS.cyberPurple,
  },
  categoryText: { color: COLORS.textMuted, fontSize: 12 },
  activeCategoryText: { color: '#fff', fontWeight: 'bold' },
  grid: { padding: 15 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  card: {
    width: '48%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  image: { width: '100%', height: '100%' },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    height: 80,
    justifyContent: 'flex-end',
  },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  cardDate: { color: COLORS.cyberCyan, fontSize: 10 },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  badgeText: { color: '#fff', fontSize: 10 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  modalContent: { width: '100%', height: '70%' },
  modalImage: { width: '100%', height: '100%' },
  modalFooter: { padding: 20 },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10, fontFamily: FONTS.heading },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  modalInfo: { color: COLORS.textMuted },
});
