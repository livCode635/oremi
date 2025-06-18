// 📁 SouscriptionAutoFlow.js - Composant pour la souscription d'assurance auto
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import * as Speech from "expo-speech";

const SouscriptionAutoFlow = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({});
  const scrollRef = useRef(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  const steps = [
    {
      aiMessage:
        "👋 Bonjour ! Commençons la souscription à l'assurance auto. Merci d'ajouter une photo de la carte grise.",
      type: "photo_upload",
      label: "Carte grise",
    },
    {
      aiMessage: "📸 Maintenant, ajoutez la photo de votre pièce d'identité (CIP).",
      type: "photo_upload",
      label: "CIP",
    },
    {
      aiMessage:
        "🧾 Avez-vous une ancienne facture de souscription ? Vous pouvez l'ajouter ici.",
      type: "photo_upload",
      label: "Facture précédente",
    },
    {
      aiMessage:
        "🔍 Super ! Voici les données extraites :\n\nNom: Jean Dupont\nNuméro chassis: XYZ123\nDate immatriculation: 01/01/2020\nMarque: Toyota\nModèle: Yaris\nPuissance: 8CV\nÉnergie: Essence\nNombre de places: 5\nCouleur: Rouge\nUsage: Personnel\nCatégorie: Tourisme\nValeur: 5.000.000 FCFA\nType d'assurance: Tous risques\nDurée: 12 mois\nBonus: 0%",
      type: "confirmation",
    },
    {
      aiMessage:
        "💰 Votre prime est de 245.000 FCFA pour 12 mois. Souhaitez-vous procéder au paiement ?",
      type: "payment",
    },
    {
      aiMessage:
        "✅ Paiement réussi !\n\n📋 Contrat enregistré sous le numéro: CONTRAT-1234-2025}\n\n Veuillez consulter votre boite mail pour le téléchargement des documents nécessaire. Merci pour votre confiance 🙏",
      type: "final",
    },
  ]
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => addAIMessage(steps[0].aiMessage), 500);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [messages]);

  const addAIMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now(), text, isUser: false }]);
      setIsTyping(false);
      Speech.speak(text.replace(/[*_#🔥⚡🚗🏠🛡️💎🧠📋💰🎯⚖️📊🆘📞💬🔊]/g, ""), { language: "fr-FR", rate: 0.95 });
    }, 1000);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, isUser: true }]);
  };

  const nextStep = () => {
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      addAIMessage(steps[currentStep + 1].aiMessage);
    }, 800);
  };

  const handlePhotoUpload = () => {
    Alert.alert("📸 Photo", "Choisir une source", [
      { text: "📷 Caméra", onPress: () => simulatePhoto("camera") },
      { text: "🖼️ Galerie", onPress: () => simulatePhoto("gallery") },
      { text: "✅ Terminer", onPress: nextStep },
    ]);
  };

  const simulatePhoto = (source) => {
    setPhotos((prev) => [...prev, { id: Date.now(), source }]);
    Alert.alert("✅", "Photo ajoutée !");
  };

  const handlePayment = () => {
    addUserMessage("✅ Je procède au paiement");
    setTimeout(() => nextStep(), 1500);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    switch (step?.type) {
      case "photo_upload":
        return (
          <TouchableOpacity style={styles.photoBtn} onPress={handlePhotoUpload}>
            <Text style={styles.photoBtnIcon}>📸</Text>
            <Text style={styles.photoBtnText}>Ajouter: {step.label}</Text>
          </TouchableOpacity>
        );
      case "confirmation":
        return (
          <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
            <Text style={styles.continueBtnText}>Modifier si besoin, puis Continuer</Text>
          </TouchableOpacity>
        );
      case "payment":
        return (
          <TouchableOpacity style={styles.paymentBtn} onPress={handlePayment}>
            <Text style={styles.paymentBtnText}>💳 Payer maintenant</Text>
          </TouchableOpacity>
        );
      case "final":
        return (
          <TouchableOpacity style={styles.finalBtn} onPress={onBack}>
            <Text style={styles.finalBtnText}>🏠 Retour à l'accueil</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                  <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                  <Text style={styles.headerTitle}>Assistant Souscription</Text>
                  <Text style={styles.headerSubtitle}>Étape {currentStep + 1}/5</Text>
                </View>
              </View>
      <ScrollView ref={scrollRef} style={styles.messages}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageWrapper, msg.isUser ? styles.userMsg : styles.aiMsg]}
          >
            <View
              style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.aiBubble]}
            >
              <Text style={[styles.messageText, msg.isUser ? styles.userText : styles.aiText]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
        {isTyping && (
          <View style={styles.aiMsg}>
            <View style={styles.aiBubble}>
              <View style={styles.typing}>
                <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
                <Text style={styles.typingText}>Assistant écrit...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputArea}>{renderStepContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: { fontSize: 18, color: "#10b981" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1f2937" },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },
  messages: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  messageWrapper: { marginVertical: 4 },
  userMsg: { alignItems: "flex-end" },
  aiMsg: { alignItems: "flex-start" },
  messageBubble: { maxWidth: "85%", borderRadius: 16, padding: 12 },
  userBubble: { backgroundColor: "#10b981" },
  aiBubble: { backgroundColor: "white", borderWidth: 1, borderColor: "#e5e7eb" },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: "white", fontWeight: "500" },
  aiText: { color: "#1f2937" },
  typing: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#6b7280" },
  typingText: {
    color: "#4B5563",
    fontSize: 13,
    marginLeft: 8,
    fontWeight: "500",
    fontStyle: "normal",
    fontFamily: "monospace",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inputArea: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#10b981",
    borderStyle: "dashed",
    gap: 8,
  },
  photoBtnIcon: { fontSize: 20 },
  photoBtnText: { fontSize: 16, color: "#10b981", fontWeight: "500" },
  continueBtn: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  continueBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
  paymentBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  paymentBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
  finalBtn: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  finalBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default SouscriptionAutoFlow;
