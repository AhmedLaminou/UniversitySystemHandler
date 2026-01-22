import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LogOut, Image, Newspaper, Settings, ChevronRight } from 'lucide-react-native';

export default function MoreScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const menuItems = [
    { icon: Image, label: 'Galerie Photos', route: '/gallery', color: COLORS.cyberMagenta },
    { icon: Newspaper, label: 'Actualités', route: '/news', color: COLORS.neonGreen },
    { icon: Settings, label: 'Paramètres', route: '/profile', color: COLORS.textMuted },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.surfaceDark]}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>MENU</Text>
      </View>

      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <item.icon size={24} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <ChevronRight size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={signOut}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.error + '20' }]}>
            <LogOut size={24} color={COLORS.error} />
          </View>
          <Text style={[styles.menuLabel, { color: COLORS.error }]}>Déconnexion</Text>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 16,
  },
  logoutItem: {
    marginTop: 20,
    borderColor: COLORS.error,
  }
});
