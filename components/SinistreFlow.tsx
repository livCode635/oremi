// 📁 SinistreFlow.js - Nouveau composant à créer
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

const SinistreFlow = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [lieu, setLieu] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);

  const scrollRef = useRef(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  // 🚗 Véhicules pré-enregistrés
  const vehicules = [
    {
      id: 1,
      marque: "Toyota",
      modele: "Corolla",
      immat: "AB-123-CD",
      couleur: "Blanche",
    },
    {
      id: 2,
      marque: "Honda",
      modele: "CR-V",
      immat: "EF-456-GH",
      couleur: "Noire",
    },
    {
      id: 3,
      marque: "Peugeot",
      modele: "208",
      immat: "IJ-789-KL",
      couleur: "Rouge",
    },
  ];

  // 📝 Scénario pré-enregistré
  const steps = [
    {
      aiMessage:
        "🚗 Bonjour ! Je vais vous accompagner dans votre déclaration de sinistre.\n\n**Quel véhicule est concerné ?**",
      type: "vehicle_selection",
    },
    {
      aiMessage:
        "📍 Parfait ! **Où s'est déroulé le sinistre ?**\n\nIndique l'adresse ou une description du lieu.",
      type: "text_input",
      placeholder: "Ex: Avenue Steinmetz, Cotonou...",
    },
    {
      aiMessage:
        "📝 **Décrivez-moi ce qui s'est passé en détail.**\n\nPlus c'est précis, mieux c'est !",
      type: "text_input",
      placeholder: "Circonstances, dégâts, témoins...",
      multiline: true,
    },
    {
      aiMessage:
        "📸 **Ajoutez des photos du sinistre**\n\n• Vue d'ensemble\n• Dégâts détaillés\n• Plaque d'immatriculation",
      type: "photo_upload",
    },
    {
      aiMessage: `✅ **Sinistre enregistré !**\n\n📋 **Dossier:** SIN-2024-${Math.random()
        .toString()
        .substr(2, 4)}\n📅 **Date:** ${new Date().toLocaleDateString(
        "fr-FR"
      )}\n\n👨‍💼 **Un conseiller vous contactera dans 2h**\n📞 **Urgence:** 01 23 45 67 89`,
      type: "final",
    },
  ];

  useEffect(() => {
    // Animation pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Message initial
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
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
    // 🗣️ Lecture vocale
    Speech.speak(text.replace(/[*_#🔥⚡🚗🏠🛡️💎🧠📋💰🎯⚖️📊🆘📞💬🔊]/g, ""), {
      language: "fr-FR",
      rate: 0.95,
    });
  }, 1000);
};


  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        isUser: true,
        timestamp: new Date(),
      },
    ]);
  };

  const nextStep = () => {
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      addAIMessage(steps[currentStep + 1].aiMessage);
    }, 800);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    addUserMessage(
      `${vehicle.marque} ${vehicle.modele} ${vehicle.couleur} (${vehicle.immat})`
    );
    nextStep();
  };

  const handleTextSubmit = () => {
    if (!userInput.trim()) return;

    if (currentStep === 1) setLieu(userInput);
    else if (currentStep === 2) setDescription(userInput);

    addUserMessage(userInput);
    setUserInput("");
    nextStep();
  };

  const handlePhotoUpload = () => {
    Alert.alert("📸 Photos", "Choisir la source", [
      { text: "📷 Caméra", onPress: () => simulatePhoto("camera") },
      { text: "🖼️ Galerie", onPress: () => simulatePhoto("gallery") },
      {
        text: "✅ Terminer",
        onPress: () => {
          if (photos.length > 0) {
            addUserMessage(`${photos.length} photo(s) ajoutée(s)`);
            nextStep();
          } else {
            Alert.alert("⚠️", "Ajoutez au moins une photo");
          }
        },
      },
    ]);
  };

  const simulatePhoto = (source) => {
    setPhotos((prev) => [...prev, { id: Date.now(), source }]);
    Alert.alert("✅", "Photo ajoutée !");
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step?.type) {
      case "vehicle_selection":
        return (
          <View style={styles.vehicleContainer}>
            {vehicules.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() => handleVehicleSelect(vehicle)}
              >
                <Text style={styles.vehicleIcon}>🚗</Text>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {vehicle.marque} {vehicle.modele}
                  </Text>
                  <Text style={styles.vehicleDetails}>
                    {vehicle.immat} • {vehicle.couleur}
                  </Text>
                </View>
                <Text style={styles.vehicleArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "text_input":
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                step.multiline && styles.textInputLarge,
              ]}
              placeholder={step.placeholder}
              value={userInput}
              onChangeText={setUserInput}
              multiline={step.multiline}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !userInput.trim() && styles.sendBtnDisabled,
              ]}
              onPress={handleTextSubmit}
              disabled={!userInput.trim()}
            >
              <Text style={styles.sendBtnText}>→</Text>
            </TouchableOpacity>
          </View>
        );

      case "photo_upload":
        return (
          <View style={styles.photoContainer}>
            {photos.length > 0 && (
              <Text style={styles.photoCount}>
                {photos.length} photo(s) ajoutée(s)
              </Text>
            )}
            <TouchableOpacity
              style={styles.photoBtn}
              onPress={handlePhotoUpload}
            >
              <Text style={styles.photoBtnIcon}>📸</Text>
              <Text style={styles.photoBtnText}>
                {photos.length === 0
                  ? "Ajouter des photos"
                  : "Ajouter une photo"}
              </Text>
            </TouchableOpacity>
            {photos.length > 0 && (
              <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
                <Text style={styles.continueBtnText}>Continuer</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case "final":
        return (
          <View style={styles.finalContainer}>
            <TouchableOpacity style={styles.finalBtn} onPress={onBack}>
              <Text style={styles.finalBtnText}>📋 Nouvelle déclaration</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Assistant Sinistres</Text>
          <Text style={styles.headerSubtitle}>Étape {currentStep + 1}/5</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={styles.messages}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.isUser ? styles.userMsg : styles.aiMsg,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userText : styles.aiText,
                ]}
              >
                {message.text}
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
                <Text style={styles.typingText}>Assistant réfléchit...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
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
  aiBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: "white", fontWeight: "500" },
  aiText: { color: "#1f2937" },
  typing: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#6b7280" },
  typingText: {
  color: "#4B5563", // Gris foncé pour meilleure lisibilité
  fontSize: 13,
  marginLeft: 8,
  fontWeight: "500",
  fontStyle: "normal",
  fontFamily: "monospace",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
  overflow: "hidden",
},

  inputArea: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  // Vehicle Selection
  vehicleContainer: { gap: 12 },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  vehicleIcon: { fontSize: 24, marginRight: 12 },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  vehicleDetails: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  vehicleArrow: { fontSize: 18, color: "#10b981", fontWeight: "600" },

  // Text Input
  inputContainer: { flexDirection: "row", alignItems: "flex-end", gap: 12 },
  textInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 48,
  },
  textInputLarge: { minHeight: 100, textAlignVertical: "top" },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { backgroundColor: "#d1d5db" },
  sendBtnText: { color: "white", fontSize: 18, fontWeight: "600" },

  // Photo Upload
  photoContainer: { gap: 16 },
  photoCount: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
    textAlign: "center",
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

  // Final
  finalContainer: { gap: 12 },
  finalBtn: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  finalBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default SinistreFlow;
