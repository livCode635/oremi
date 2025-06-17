import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#1b1d84",
  secondary: "#1fc192",
  background: "#F8FAFC",
  white: "#FFFFFF",
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    light: "#94A3B8",
  },
  cards: {
    voiture: { bg: "#DCFCE7", gradient: ["#BBF7D0", "#86EFAC"] },
    moto: { bg: "#FEF3C7", gradient: ["#FDE68A", "#FBBF24"] },
    voyage: { bg: "#FECACA", gradient: ["#FCA5A5", "#F87171"] },
    habitation: { bg: "#C7D2FE", gradient: ["#A5B4FC", "#8B5CF6"] },
  },
};
const OremiHomePage = () => {
  const navigation = useNavigation();
  const [activeCard, setActiveCard] = useState(null);

  // Produits d'assurance avec icônes et couleurs
  const insuranceProducts = [
    {
      id: 1,
      title: "Auto",
      icon: "🚗",
      color: COLORS.cards.voiture,
      description: "Protection complète\npour votre véhicule",
    },
    {
      id: 2,
      title: "Moto",
      icon: "🏍️",
      color: COLORS.cards.moto,
      description: "Assurance moto\ntous risques",
    },
    {
      id: 3,
      title: "Voyage",
      icon: "✈️",
      color: COLORS.cards.voyage,
      description: "Voyagez en toute\nsérénité",
    },
    {
      id: 4,
      title: "Habitation",
      icon: "🏠",
      color: COLORS.cards.habitation,
      description: "Protégez votre\ndomicile",
    },
  ];

  // Sections d'aide
  const helpSections = [
    {
      id: 1,
      title: "Foire aux questions et aides",
      icon: "help-circle-outline",
      subtitle: "Trouvez rapidement des réponses",
    },
    {
      id: 2,
      title: "À propos de nous",
      icon: "information-circle-outline",
      subtitle: "Découvrez notre mission",
    },
    {
      id: 3,
      title: "Contactez-nous",
      icon: "call-outline",
      subtitle: "Support client 24h/7j",
    },
  ];

  // Actions rapides supplémentaires
  const quickActions = [
    {
      id: 1,
      title: "Ajouter un contrat",
      icon: "document-text-outline",
      color: COLORS.secondary,
    },
    {
      id: 2,
      title: "Mes contrats",
      icon: "document-text-outline",
      color: COLORS.primary,
    },
    {
      id: 3,
      title: "Déclarer sinistre",
      icon: "warning-outline",
      color: "#EF4444",
    },
  ];

  const handleProductPress = (product) => {
    setActiveCard(product.id);
    Alert.alert(
      `Assurance ${product.title}`,
      `Découvrez nos offres d'assurance ${product.title.toLowerCase()}`
    );
  };

  const handleHelpPress = (help) => {
    Alert.alert(help.title, help.subtitle);
  };

  const handleQuickAction = (action) => {
    Alert.alert(action.title, "Redirection en cours...");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header avec dégradé */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bienvenu(e) sur Oremi</Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="white" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Produits d'assurance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nos produits d'assurance</Text>

          <View style={styles.productsGrid}>
            <Image
              source={require("../../../assets/images/auto.jpeg")}
              style={{ width: 150, height: 150, borderRadius: 15 }}
            />
            <Image
              source={require("../../../assets/images/moto.jpeg")}
              style={{ width: 150, height: 150, borderRadius: 15 }}
            />
            <Image
              source={require("../../../assets/images/voyage.jpeg")}
              style={{ width: 150, height: 150, borderRadius: 15 }}
            />
            <Image
              source={require("../../../assets/images/habitat.jpeg")}
              style={{ width: 150, height: 150, borderRadius: 15 }}
            />
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionCard,
                  { borderLeftColor: action.color },
                ]}
                onPress={() => handleQuickAction(action)}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color },
                  ]}
                >
                  <Ionicons name={action.icon} size={20} color="white" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.text.light}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Besoin d'aide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Besoin d'aide ?</Text>

          <View style={styles.helpContainer}>
            {helpSections.map((help) => (
              <TouchableOpacity
                key={help.id}
                style={styles.helpCard}
                onPress={() => handleHelpPress(help)}
              >
                <View style={styles.helpIconContainer}>
                  <Ionicons name={help.icon} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.helpContent}>
                  <Text style={styles.helpTitle}>{help.title}</Text>
                  <Text style={styles.helpSubtitle}>{help.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.text.light}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bouton flottant Assistant IA */}
      <TouchableOpacity style={styles.aiFloatingButton} onPress={()=>navigation.navigate('AiScreen')}>
        <Ionicons name="chatbox" size={28} color="white" />
        <View style={styles.aiPulse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: 30,
  },
  header: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeSection: {
    flex: 1,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  productCard: {
    width: (width - 52) / 2,
    height: 140,
    borderRadius: 20,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    shadowColor: COLORS.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeProductCard: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  productContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    lineHeight: 16,
  },
  productIconContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
  productIcon: {
    fontSize: 32,
  },
  productOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: COLORS.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickActionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  helpContainer: {
    gap: 12,
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  helpSubtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
  },
  aiFloatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  aiPulse: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.3,
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.text.light,
    marginTop: 4,
    fontWeight: "600",
  },
  activeNavLabel: {
    color: COLORS.primary,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default OremiHomePage;
