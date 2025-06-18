import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
  Vibration,
} from "react-native";

import * as Speech from "expo-speech";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");

// Service Rasa intégré
class RasaService {
  constructor() {
    // CHANGEZ cette URL si votre serveur Rasa est sur une autre adresse
    this.baseURL = "http://192.168.40.184:5005";
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return "oremi_" + Math.random().toString(36).substr(2, 9);
  }

  async sendMessage(message, selectedService = null) {
    try {
      const payload = {
        sender: this.sessionId,
        message: message,
        metadata: {
          selectedService: selectedService?.id || null,
          timestamp: new Date().toISOString(),
        },
      };

      console.log("📤 Envoi à Rasa:", payload);

      const response = await fetch(`${this.baseURL}/webhooks/rest/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📥 Réponse Rasa:", data);

      return this.formatRasaResponse(data);
    } catch (error) {
      console.error("❌ Erreur Rasa:", error);
      return this.getFallbackResponse(error);
    }
  }

  formatRasaResponse(rasaData) {
    if (!rasaData || rasaData.length === 0) {
      return [
        {
          id: Date.now(),
          text: "Je n'ai pas bien compris votre demande. Pouvez-vous reformuler ?",
          isUser: false,
          timestamp: new Date(),
          buttons: null,
        },
      ];
    }

    return rasaData.map((response, index) => ({
      id: Date.now() + index,
      text: response.text || "Réponse reçue",
      isUser: false,
      timestamp: new Date(),
      buttons: response.buttons || null,
      attachment: response.attachment || null,
    }));
  }

  getFallbackResponse(error) {
    const isConnectionError =
      error.message.includes("Network") ||
      error.message.includes("fetch") ||
      error.message.includes("HTTP");

    if (isConnectionError) {
      return [
        {
          id: Date.now(),
          text: "🔌 Impossible de me connecter au serveur Rasa. Vérifiez que le serveur est démarré sur 192.168.40.184:5005",
          isUser: false,
          timestamp: new Date(),
          buttons: [
            { title: "💡 Mode démo", payload: "demo_mode" },
            { title: "🔄 Réessayer", payload: "retry_connection" },
          ],
        },
      ];
    }

    return [
      {
        id: Date.now(),
        text: "⚠️ Erreur technique temporaire. Veuillez réessayer dans quelques instants.",
        isUser: false,
        timestamp: new Date(),
      },
    ];
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/webhooks/rest/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "test",
          message: "ping",
        }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

const OremiAI = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  type Service = {
    id: string;
    icon: string;
    title: string;
    accent: string;
    chatTitle: string;
    welcomeMessage: string;
    placeholder: string;
  };

  const services = [
    {
      id: "souscription",
      icon: "🛡️",
      title: "Souscription\nIntelligente",
      accent: "#01548b",
      chatTitle: "Assistant Souscription",
      welcomeMessage:
        "Bonjour ! Je vais vous aider à choisir la meilleure assurance selon vos besoins. Décrivez-moi votre situation pour une recommandation personnalisée.",
      placeholder: "Décrivez votre besoin en assurance...",
    },
    {
      id: "sinistres",
      icon: "⚡",
      title: "Déclaration\nSinistres",
      accent: "#10b981",
      chatTitle: "Assistant Sinistres",
      welcomeMessage:
        "Je vais vous guider dans votre déclaration de sinistre étape par étape. Décrivez-moi ce qui s'est passé pour commencer.",
      placeholder: "Décrivez votre sinistre en détail...",
    },
    {
      id: "analyse",
      icon: "🧠",
      title: "Analyse\nContrats",
      accent: "#6b7280",
      chatTitle: "Analyseur de Contrats IA",
      welcomeMessage:
        "J'ai analysé votre contrat d'assurance. Voici mon analyse détaillée avec des recommandations d'optimisation personnalisées.",
      placeholder: "Posez vos questions sur votre contrat...",
    },
    {
      id: "conseils",
      icon: "💎",
      title: "Conseils\nPersonnalisés",
      accent: "#10b981",
      chatTitle: "Conseiller Personnel IA",
      welcomeMessage:
        "En tant que votre conseiller personnel, je vais analyser votre profil pour vous proposer des solutions d'assurance optimales.",
      placeholder: "Parlez-moi de votre situation...",
    },
  ];

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [recording, setRecording] = useState(null);
  const [rasaConnected, setRasaConnected] = useState(false);
  const [rasaService] = useState(() => new RasaService());

  // Animations
  const [pulseAnim] = useState(new Animated.Value(1));
  const [floatAnim] = useState(new Animated.Value(0));
  const [shimmerAnim] = useState(new Animated.Value(0));
  
  // ✅ FIX: Références pour gérer le focus et le scroll
  const scrollViewRef = useRef<ScrollView | null>(null);
  const textInputRef = useRef<TextInput | null>(null);

  // Initialize animations
  useEffect(() => {
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Test de connexion Rasa au démarrage
  useEffect(() => {
    testRasaConnection();
  }, []);

  const testRasaConnection = async () => {
    console.log("🔍 Test de connexion Rasa...");
    const connected = await rasaService.testConnection();
    setRasaConnected(connected);

    if (connected) {
      console.log("✅ Rasa connecté");
    } else {
      console.log("❌ Rasa non accessible");
      Alert.alert(
        "Serveur Rasa",
        "Le serveur Rasa n'est pas accessible. Assurez-vous qu'il est démarré sur 192.168.40.184:5005",
        [
          { text: "Mode démo", onPress: () => console.log("Mode démo activé") },
          { text: "OK" },
        ]
      );
    }
  };

  // Configuration Audio
  useEffect(() => {
    configureAudio();
  }, []);

  const configureAudio = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.log("Erreur configuration audio:", error);
    }
  };

  // Fonction d'enregistrement audio
  const startRecording = async () => {
    try {
      setIsListening(true);
      setVoiceTranscript("");

      // Simuler l'enregistrement (remplacez par une vraie solution de reconnaissance vocale)
      Alert.alert("🎤 Enregistrement Vocal", "Parlez maintenant...", [
        {
          text: "Test: Assurance Auto",
          onPress: () => {
            const testText = "Je voudrais souscrire une assurance auto";
            setVoiceTranscript(testText);
            handleVoiceInput(testText);
            setIsListening(false);
          },
        },
        {
          text: "Test: Analyser contrat",
          onPress: () => {
            const testText = "Analyser mon contrat d'assurance";
            setVoiceTranscript(testText);
            handleVoiceInput(testText);
            setIsListening(false);
          },
        },
        {
          text: "Test: Déclarer sinistre",
          onPress: () => {
            const testText = "Je dois déclarer un sinistre";
            setVoiceTranscript(testText);
            handleVoiceInput(testText);
            setIsListening(false);
          },
        },
        {
          text: "Annuler",
          onPress: () => setIsListening(false),
        },
      ]);
    } catch (error) {
      console.error("Erreur démarrage vocal:", error);
      setIsListening(false);
      Alert.alert("Erreur", "Impossible de démarrer l'enregistrement");
    }
  };

  const stopRecording = async () => {
    try {
      setIsListening(false);
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
    } catch (error) {
      console.error("Erreur arrêt vocal:", error);
    }
  };

  const toggleVoiceRecording = async () => {
    if (isListening) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  // Synthèse vocale
  const speakText = (text) => {
    // Nettoyer le texte des emojis et caractères spéciaux
    const cleanText = text.replace(/[🔥⚡🚗🏠🛡️💎🧠📋💰🎯⚖️📊🆘📞💬🔊]/g, "");

    setIsSpeaking(true);
    Speech.speak(cleanText, {
      language: "fr-FR",
      pitch: 1.0,
      rate: 0.85,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Gestion des entrées vocales avec Rasa
  const handleVoiceInput = async (transcript) => {
    const userMessage = {
      id: Date.now(),
      text: transcript,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setVoiceTranscript("");
    Vibration.vibrate(50);

    // Envoyer à Rasa
    await sendToRasa(transcript);
  };

  // ✅ FIX: Gestion des entrées texte avec Rasa - fonction améliorée
  const handleTextInput = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    const messageToSend = inputText;
    setMessages((prev) => [...prev, userMessage]);
    setInputText(""); // ✅ Vider le champ AVANT d'envoyer à Rasa

    // ✅ Garder le focus sur l'input après envoi
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 100);

    // Envoyer à Rasa
    await sendToRasa(messageToSend);
  };

  // Fonction principale pour envoyer à Rasa
  const sendToRasa = async (message) => {
    setIsTyping(true);

    try {
      const rasaResponses = await rasaService.sendMessage(
        message,
        selectedService
      );

      // Ajouter les réponses de Rasa
      setMessages((prev) => [...prev, ...rasaResponses]);

      // Lire la première réponse vocalement
      if (rasaResponses.length > 0 && rasaResponses[0].text) {
        setTimeout(() => {
          speakText(rasaResponses[0].text);
        }, 500);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi à Rasa:", error);

      // Réponse de fallback
      const fallbackMessage = {
        id: Date.now(),
        text: "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Gestion des boutons de réponse Rasa
  const handleButtonPress = async (button) => {
    const buttonMessage = {
      id: Date.now(),
      text: button.title,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, buttonMessage]);
    Vibration.vibrate(30);

    // Envoyer le payload du bouton à Rasa
    await sendToRasa(button.payload);
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (currentScreen === 2 && messages.length === 0) {
      setTimeout(() => {
        if (selectedService) {
          // Initialiser la conversation avec le service sélectionné
          const serviceMessage = getServiceInitMessage(selectedService);
          sendToRasa(serviceMessage);
        } else {
          // Message de bienvenue général
          const welcomeMessage = {
            id: 1,
            text: "Bonjour ! Je suis Oremi AI, votre assistant intelligent pour l'assurance. Comment puis-je vous aider aujourd'hui ?",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        }
      }, 500);
    }
  }, [currentScreen, selectedService]);

  // Fonction pour obtenir le message d'initialisation selon le service
  const getServiceInitMessage = (service) => {
    const serviceMessages = {
      souscription: "Je veux souscrire une assurance",
      sinistres: "Je dois déclarer un sinistre",
      analyse: "Je veux analyser mon contrat",
      conseils: "J'ai besoin de conseils en assurance",
    };

    return serviceMessages[service.id] || "Bonjour";
  };

  // ✅ FIX: Auto scroll to bottom amélioré avec délai plus long
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      // ✅ Délai plus long pour s'assurer que le contenu est rendu
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 300); // Augmenté de 100ms à 300ms
    }
  }, [messages, isTyping]);

  // ✅ FIX: Scroll supplémentaire quand isTyping change
  useEffect(() => {
    if (!isTyping && scrollViewRef.current && messages.length > 0) {
      // Scroll vers le bas quand la frappe se termine
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 200);
    }
  }, [isTyping]);

  // Composants d'écrans (WelcomeScreen et VoiceScreen restent identiques)
  const WelcomeScreen = () => (
    <View style={styles.container}>
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: (i * 60) % width,
                top: (i * 90) % height,
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
                opacity: 0.03 + (i % 2) * 0.02,
              },
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.heroCard,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.heroContent}>
              <Animated.Text
                style={[
                  styles.heroTitle,
                  {
                    opacity: shimmerAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.9, 1, 0.9],
                    }),
                  },
                ]}
              >
                Oremi AI
              </Animated.Text>
              <Text style={styles.heroSubtitle}>
                Assistant Intelligent Assurance
              </Text>
              <View style={styles.heroTagline}>
                <View style={styles.accent} />
                <Text style={styles.taglineText}>
                  Révolutionnez votre expérience assurance
                </Text>
                <View style={styles.accent} />
              </View>

              {/* Indicateur de connexion Rasa */}
              <View style={styles.connectionStatus}>
                <View
                  style={[
                    styles.connectionDot,
                    { backgroundColor: rasaConnected ? "#10b981" : "#ef4444" },
                  ]}
                />
                <Text style={styles.connectionText}>
                  {rasaConnected ? "IA connectée" : "Mode local"}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <ScrollView
          style={styles.servicesContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceCard}
                onPress={() => {
                  setSelectedService(service);
                  setCurrentScreen(2);
                  Vibration.vibrate(30);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.serviceContent}>
                  <View
                    style={[
                      styles.serviceAccent,
                      { backgroundColor: service.accent },
                    ]}
                  />
                  <View style={styles.serviceIconContainer}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                  </View>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.mainCTA}
            onPress={() => {
              setSelectedService(null);
              setCurrentScreen(2);
              Vibration.vibrate(50);
            }}
            activeOpacity={0.95}
          >
            <View style={styles.ctaContent}>
              <View style={styles.ctaIconContainer}>
                <Text style={styles.ctaIconText}>🎙️</Text>
                <Animated.View
                  style={[
                    styles.ctaRipple,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
              </View>
              <View style={styles.ctaText}>
                <Text style={styles.ctaTitle}>Démarrer</Text>
                <Text style={styles.ctaSubtitle}>IA conversationnelle</Text>
              </View>
              <View style={styles.ctaArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  const VoiceScreen = () => (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View style={styles.voiceHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setCurrentScreen(0);
              if (isListening) {
                stopRecording();
              }
            }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {selectedService && (
            <View style={styles.headerCenter}>
              <Text style={styles.voiceHeaderTitle}>
                {selectedService.chatTitle}
              </Text>
              <Text style={styles.voiceHeaderSubtitle}>
                {selectedService.icon}{" "}
                {selectedService.title.replace("\n", " ")}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.connectionIndicator}
            onPress={testRasaConnection}
          >
            <View
              style={[
                styles.connectionDot,
                { backgroundColor: rasaConnected ? "#10b981" : "#ef4444" },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.aiZone}>
          <Animated.View
            style={[
              styles.aiContainer,
              {
                transform: [
                  { scale: pulseAnim },
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.aiAnimationPlaceholder}>
              <View style={styles.aiGradientBg}>
                <Text style={styles.aiCenterIcon}>🤖</Text>
              </View>

              {[...Array(3)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.aiRing,
                    {
                      transform: [
                        {
                          scale: pulseAnim.interpolate({
                            inputRange: [1, 1.05],
                            outputRange: [1 + i * 0.05, 1.1 + i * 0.05],
                          }),
                        },
                      ],
                      opacity: isListening ? 0.3 - i * 0.1 : 0.1 - i * 0.03,
                      borderColor: selectedService
                        ? selectedService.accent
                        : "#01548b",
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  isListening && styles.statusDotActive,
                  selectedService && {
                    backgroundColor: selectedService.accent,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {isListening
                  ? "Je vous écoute attentivement..."
                  : rasaConnected
                  ? "Appuyez pour parler avec l'IA"
                  : "Mode démo - Tests disponibles"}
              </Text>
            </View>

            <Text style={styles.promptText}>
              {isListening
                ? "Décrivez votre besoin clairement..."
                : "« Analysez mon contrat habitation »\n« Comment déclarer un sinistre ? »"}
            </Text>

            {voiceTranscript ? (
              <View style={styles.transcriptContainer}>
                <Text style={styles.transcriptText}>"{voiceTranscript}"</Text>
              </View>
            ) : null}
          </Animated.View>
        </View>

        <View style={styles.voiceControls}>
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={() => {
              setCurrentScreen(2);
              if (isListening) {
                stopRecording();
              }
            }}
          >
            <Text style={styles.controlIcon}>💬</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryControl,
              isListening && styles.primaryControlActive,
              selectedService && { shadowColor: selectedService.accent },
            ]}
            onPress={() => {
              toggleVoiceRecording();
              Vibration.vibrate(50);
            }}
          >
            <Animated.View
              style={[
                styles.micContainer,
                {
                  backgroundColor: isListening
                    ? "#ef4444"
                    : selectedService
                    ? selectedService.accent
                    : "#01548b",
                  transform: [{ scale: isListening ? pulseAnim : 1 }],
                },
              ]}
            >
              <Text style={styles.micIcon}>🎤</Text>
            </Animated.View>

            {isListening && (
              <Animated.View
                style={[
                  styles.listeningRipple,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  const ChatScreen = () => {
    const currentService = selectedService || {
      chatTitle: "Oremi AI",
      icon: "🤖",
      accent: "#01548b",
      placeholder: "Tapez votre message...",
    };

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />

          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setCurrentScreen(1);
                if (isListening) {
                  stopRecording();
                }
                if (isSpeaking) {
                  Speech.stop();
                }
              }}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.chatHeaderCenter}>
              <View
                style={[
                  styles.aiAvatar,
                  selectedService && {
                    backgroundColor: selectedService.accent,
                  },
                ]}
              >
                <Text style={styles.avatarText}>
                  {selectedService ? selectedService.icon : "🤖"}
                </Text>
              </View>
              <View>
                <Text style={styles.chatTitle}>{currentService.chatTitle}</Text>
                <Text style={styles.chatStatus}>
                  {isSpeaking
                    ? "🔊 En train de parler..."
                    : isTyping
                    ? "✍️ En train d'écrire..."
                    : isListening
                    ? "🎤 En écoute..."
                    : rasaConnected
                    ? "🤖 IA connectée"
                    : "💻 Mode local"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chatMenu}
              onPress={() => {
                if (isSpeaking) {
                  stopSpeaking(); // ✅ Arrêter la lecture
                } else if (
                  messages.length > 0 &&
                  !messages[messages.length - 1].isUser
                ) {
                  speakText(messages[messages.length - 1].text); // ✅ Relire le dernier message
                }
              }}
            >
              <Text style={styles.menuIcon}>{isSpeaking ? "⏸️" : "🔊"}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            // ✅ FIX: Maintenir la position lors du changement de contenu
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.isUser
                    ? styles.userMessageWrapper
                    : styles.aiMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser
                      ? [
                          styles.userMessageBubble,
                          selectedService && {
                            backgroundColor: selectedService.accent,
                          },
                        ]
                      : styles.aiMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser
                        ? styles.userMessageText
                        : styles.aiMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>

                  {!message.isUser && (
                    <View style={styles.messageActions}>
                      <TouchableOpacity
                        style={styles.messageAction}
                        onPress={() => speakText(message.text)}
                      >
                        <Text style={styles.actionText}>🔊 Écouter</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Boutons de réponse Rasa */}
                {message.buttons && message.buttons.length > 0 && (
                  <View style={styles.buttonsContainer}>
                    {message.buttons.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.responseButton,
                          selectedService && {
                            borderColor: selectedService.accent,
                          },
                        ]}
                        onPress={() => handleButtonPress(button)}
                      >
                        <Text
                          style={[
                            styles.responseButtonText,
                            selectedService && {
                              color: selectedService.accent,
                            },
                          ]}
                        >
                          {button.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {isTyping && (
              <View style={styles.aiMessageWrapper}>
                <View style={styles.aiMessageBubble}>
                  <View style={styles.typingIndicator}>
                    <Animated.View
                      style={[styles.typingDot, { opacity: pulseAnim }]}
                    />
                    <Animated.View
                      style={[styles.typingDot, { opacity: pulseAnim }]}
                    />
                    <Animated.View
                      style={[styles.typingDot, { opacity: pulseAnim }]}
                    />
                    <Text style={styles.typingText}>
                      {rasaConnected ? "Rasa réfléchit..." : "Traitement..."}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.chatInputSection}>
            {messages.length <= 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestionsContainer}
              >
                {[
                  "Analyser mon contrat",
                  "Déclarer un sinistre",
                  "Demander un devis",
                  "Optimiser mes garanties",
                  "Assistance urgence",
                ].map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.suggestionChip,
                      selectedService && {
                        borderColor: selectedService.accent,
                      },
                    ]}
                    onPress={() => {
                      setInputText(suggestion);
                      setTimeout(() => handleTextInput(), 100);
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.chatInputContainer}>
              <TextInput
                ref={textInputRef} // ✅ FIX: Référence pour maintenir le focus
                style={styles.chatInput}
                placeholder={currentService.placeholder}
                placeholderTextColor="#9ca3af"
                multiline
                value={inputText}
                onChangeText={setInputText}
                maxLength={500}
                // ✅ FIX: Propriétés pour améliorer la gestion du focus
                autoFocus={false}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  if (inputText.trim()) {
                    handleTextInput();
                  }
                }}
                returnKeyType="send"
              />
              <View style={styles.inputActions}>
                <TouchableOpacity
                  style={[
                    styles.inputAction,
                    isListening && styles.inputActionActive,
                  ]}
                  onPress={() => {
                    toggleVoiceRecording();
                    Vibration.vibrate(30);
                  }}
                >
                  <Text style={styles.inputActionIcon}>
                    {isListening ? "🔴" : "🎤"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.inputActionPrimary,
                    selectedService && {
                      backgroundColor: selectedService.accent,
                    },
                    !inputText.trim() && styles.inputActionDisabled,
                  ]}
                  onPress={() => {
                    if (inputText.trim()) {
                      handleTextInput();
                      Vibration.vibrate(30);
                    }
                  }}
                  disabled={!inputText.trim() || isTyping}
                >
                  <Text style={styles.inputActionText}>
                    {isTyping ? "⏳" : "→"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {voiceTranscript && isListening && (
              <View style={styles.voiceTranscriptContainer}>
                <Text style={styles.voiceTranscriptText}>
                  🎤 "{voiceTranscript}"
                </Text>
              </View>
            )}

            {/* Indicateur de connexion dans le chat */}
            {!rasaConnected && (
              <View style={styles.connectionWarning}>
                <Text style={styles.connectionWarningText}>
                  ⚠️ Mode démo - Rasa non connecté
                </Text>
                <TouchableOpacity
                  style={styles.reconnectButton}
                  onPress={testRasaConnection}
                >
                  <Text style={styles.reconnectButtonText}>🔄 Reconnecter</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currentScreen === 0 && <WelcomeScreen />}
      {currentScreen === 1 && <VoiceScreen />}
      {currentScreen === 2 && <ChatScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safeArea: {
    flex: 1,
  },
  particlesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  particle: {
    position: "absolute",
    width: 3,
    height: 3,
    backgroundColor: "#01548b",
    borderRadius: 1.5,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
    marginTop: 60,
  },
  heroCard: {
    backgroundColor: "#01548b",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#01548b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  heroContent: {
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#fcfcfc",
    marginBottom: 16,
    fontWeight: "500",
  },
  heroTagline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accent: {
    width: 6,
    height: 6,
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  taglineText: {
    color: "#d1d5db",
    fontSize: 14,
    fontStyle: "italic",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "500",
  },
  servicesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  serviceCard: {
    width: (width - 64) / 2,
    height: 120,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  serviceContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    position: "relative",
  },
  serviceAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  serviceIconContainer: {
    alignSelf: "flex-start",
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceTitle: {
    color: "#1f2937",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 19,
  },
  mainCTA: {
    marginBottom: 32,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#01548b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
  },
  ctaIconContainer: {
    position: "relative",
    marginRight: 16,
  },
  ctaIconText: {
    fontSize: 28,
  },
  ctaRipple: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(51, 52, 144, 0.05)",
    top: -10,
    left: -10,
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    color: "#01548b",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  ctaSubtitle: {
    color: "#6b7280",
    fontSize: 14,
  },
  ctaArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#01548b",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  // Voice Screen Styles
  voiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  backIcon: {
    color: "#01548b",
    fontSize: 20,
    fontWeight: "600",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  voiceHeaderTitle: {
    color: "#01548b",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  voiceHeaderSubtitle: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 2,
  },
  connectionIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  aiZone: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  aiContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  aiAnimationPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#01548b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  aiGradientBg: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#01548b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    shadowColor: "#01548b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  aiCenterIcon: {
    fontSize: 60,
  },
  aiRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  statusContainer: {
    alignItems: "center",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d1d5db",
  },
  statusDotActive: {
    backgroundColor: "#ef4444",
  },
  statusText: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "600",
  },
  promptText: {
    color: "#6b7280",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  transcriptContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  transcriptText: {
    color: "#0369a1",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  voiceControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 40,
  },
  secondaryControl: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  controlIcon: {
    fontSize: 22,
  },
  primaryControl: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  primaryControlActive: {
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  micContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  micIcon: {
    fontSize: 30,
    color: "white",
  },
  listeningRipple: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    top: -20,
    left: -20,
  },

  // Chat Screen Styles
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "white",
  },
  chatHeaderCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#01548b",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  chatTitle: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "600",
  },
  chatStatus: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 2,
  },
  chatMenu: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#f9fafb",
  },
  messageWrapper: {
    marginVertical: 4,
  },
  userMessageWrapper: {
    alignItems: "flex-end",
  },
  aiMessageWrapper: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "85%",
    borderRadius: 20,
    padding: 16,
  },
  userMessageBubble: {
    backgroundColor: "#01548b",
    borderTopRightRadius: 8,
  },
  aiMessageBubble: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "white",
    fontWeight: "500",
  },
  aiMessageText: {
    color: "#1f2937",
  },
  messageActions: {
    flexDirection: "row",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  messageAction: {
    paddingVertical: 4,
  },
  actionText: {
    color: "#6b7280",
    fontSize: 14,
  },
  buttonsContainer: {
    marginTop: 8,
    gap: 6,
    maxWidth: "85%",
  },
  responseButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#01548b",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  responseButtonText: {
    color: "#01548b",
    fontSize: 14,
    fontWeight: "500",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6b7280",
  },
  typingText: {
    color: "#6b7280",
    fontSize: 12,
    marginLeft: 8,
    fontStyle: "italic",
  },
  chatInputSection: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  suggestionsContainer: {
    marginBottom: 12,
  },
  suggestionChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  suggestionText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chatInput: {
    flex: 1,
    color: "#1f2937",
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  inputActions: {
    flexDirection: "row",
    gap: 8,
  },
  inputAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  inputActionActive: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
  },
  inputActionIcon: {
    fontSize: 16,
  },
  inputActionPrimary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#01548b",
    justifyContent: "center",
    alignItems: "center",
  },
  inputActionDisabled: {
    backgroundColor: "#d1d5db",
  },
  inputActionText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  voiceTranscriptContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  voiceTranscriptText: {
    color: "#0369a1",
    fontSize: 14,
    fontStyle: "italic",
  },
  connectionWarning: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#fbbf24",
  },
  connectionWarningText: {
    color: "#92400e",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  reconnectButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  reconnectButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
});

export default OremiAI;