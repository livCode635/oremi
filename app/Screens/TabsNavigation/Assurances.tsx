// App.js - Oremi React Native App
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OremiApp = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant Oremi. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notifications] = useState(3);
  const flatListRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Animation pour l'indicateur de frappe
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      setIsTyping(true);

      // Simulation de réponse du bot
      setTimeout(() => {
        const botResponse = getBotResponse(inputMessage);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'bot',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('assurance auto') || message.includes('voiture')) {
      return "Pour une assurance automobile, je peux vous aider à obtenir un devis en quelques minutes. Souhaitez-vous commencer la souscription ou avez-vous des questions spécifiques ?";
    } else if (message.includes('moto')) {
      return "Excellent choix ! Notre assurance moto couvre les 2 et 3 roues. Quel type de moto souhaitez-vous assurer ?";
    } else if (message.includes('habitation') || message.includes('maison')) {
      return "L'assurance habitation Oremi vous protège contre les risques d'incendie, vol, dégâts des eaux. Voulez-vous une estimation ?";
    } else if (message.includes('voyage')) {
      return "Notre assurance voyage vous couvre à l'international. Quelle est votre destination et la durée de votre séjour ?";
    } else if (message.includes('prix') || message.includes('coût') || message.includes('tarif')) {
      return "Les tarifs varient selon vos besoins. Je peux vous faire une estimation personnalisée. Quel type d'assurance vous intéresse ?";
    } else if (message.includes('sinistre') || message.includes('accident')) {
      return "En cas de sinistre, vous pouvez déclarer directement via l'app. Avez-vous un sinistre à déclarer maintenant ?";
    } else if (message.includes('affiliation') || message.includes('parrainage')) {
      return "Notre programme d'affiliation vous permet de gagner des commissions en parrainant de nouveaux clients. Voulez-vous en savoir plus ?";
    } else if (message.includes('scanner') || message.includes('document')) {
      return "Le scanner de documents vous permet de numériser vos papiers d'identité, permis de conduire, etc. directement avec votre téléphone. Très pratique pour vos souscriptions !";
    } else {
      return "Je suis là pour vous aider avec vos assurances. Vous pouvez me poser des questions sur nos produits : Auto, Moto, Habitation, Voyage, ou sur notre programme d'affiliation. Que souhaitez-vous savoir ?";
    }
  };

  const quickQuestions = [
    "Assurance auto pas chère",
    "Comment déclarer un sinistre ?",
    "Devis assurance moto",
    "Programme d'affiliation",
    "Scanner de documents",
    "Assurance voyage international"
  ];

  const insuranceProducts = [
    {
      id: 1,
      name: 'Voiture',
      icon: '🚗',
      colors: ['#A7F3D0', '#34D399'],
      description: 'Protection complète pour votre véhicule'
    },
    {
      id: 2,
      name: 'Moto',
      icon: '🏍️',
      colors: ['#FDE68A', '#F59E0B'],
      description: 'Assurance 2 et 3 roues'
    },
    {
      id: 3,
      name: 'Voyage',
      icon: '🧳',
      colors: ['#FBBF24', '#F59E0B'],
      description: 'Voyagez en toute sérénité'
    },
    {
      id: 4,
      name: 'Habitation',
      icon: '🏠',
      colors: ['#93C5FD', '#3B82F6'],
      description: 'Protégez votre foyer'
    }
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.botText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.sender === 'user' ? styles.userTime : styles.botTime
        ]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  const TypingIndicator = () => (
    <View style={[styles.messageContainer, styles.botMessage]}>
      <View style={[styles.messageBubble, styles.botBubble]}>
        <View style={styles.typingContainer}>
          <Animated.View style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            }
          ]} />
          <Animated.View style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 1, 0.3],
              }),
            }
          ]} />
          <Animated.View style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.3],
              }),
            }
          ]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.welcomeText}>Bienvenu(e) sur Oremi</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationContainer}>
            <Ionicons name="notifications" size={24} color="white" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Insurance Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nos produits d'assurance</Text>
          <View style={styles.productsGrid}>
            {insuranceProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  { backgroundColor: product.colors[0] }
                ]}
                onPress={() => Alert.alert(product.name, product.description)}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.productIcon}>
                  <Text style={styles.productEmoji}>{product.icon}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Besoin d'aide ?</Text>
          
          {/* Assistant */}
          <TouchableOpacity
            style={styles.helpCard}
            onPress={() => setShowAssistant(true)}
          >
            <View style={styles.helpContent}>
              <View style={[styles.helpIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color="white" />
              </View>
              <View style={styles.helpText}>
                <Text style={styles.helpTitle}>Assistant intelligent</Text>
                <Text style={styles.helpSubtitle}>Posez vos questions, je vous aide !</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Scanner */}
          <TouchableOpacity style={styles.helpCard}>
            <View style={styles.helpContent}>
              <View style={[styles.helpIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
              <View style={styles.helpText}>
                <Text style={styles.helpTitle}>Scanner de documents</Text>
                <Text style={styles.helpSubtitle}>Scannez vos papiers facilement</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity style={styles.helpCard}>
            <View style={styles.helpContent}>
              <View style={[styles.helpIcon, { backgroundColor: '#6B7280' }]}>
                <Ionicons name="information-circle" size={20} color="white" />
              </View>
              <View style={styles.helpText}>
                <Text style={styles.helpTitle}>À propos de nous</Text>
                <Text style={styles.helpSubtitle}>Découvrez Oremi AFG</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="home" size={24} color="#10B981" />
          <Text style={[styles.navText, styles.activeNavText]}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="shield-checkmark" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Assurances</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="flag" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Sinistres</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Compte</Text>
        </TouchableOpacity>
      </View>

      {/* Assistant Modal */}
      <Modal
        visible={showAssistant}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.chatContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
          
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderLeft}>
              <View style={styles.chatAvatar}>
                <Ionicons name="chatbubble-ellipses" size={20} color="white" />
              </View>
              <View>
                <Text style={styles.chatTitle}>Assistant Oremi</Text>
                <Text style={styles.chatStatus}>En ligne</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAssistant(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <KeyboardAvoidingView 
            style={styles.chatContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              style={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            />

            {/* Quick Questions */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickQuestionsContainer}
            >
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder="Tapez votre message..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity style={styles.micButton}>
                  <Ionicons name="mic" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: inputMessage.trim() ? 1 : 0.5 }
                ]}
                onPress={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  notificationContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  productIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  productEmoji: {
    fontSize: 32,
  },
  helpCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  helpSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    // Styles pour l'item actif
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  activeNavText: {
    color: '#10B981',
  },
  // Styles pour le chat
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  chatStatus: {
    color: '#93C5FD',
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContent: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
  },
  botBubble: {
    backgroundColor: '#F3F4F6',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userTime: {
    color: '#93C5FD',
  },
  botTime: {
    color: '#9CA3AF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    backgroundColor: '#9CA3AF',
    borderRadius: 4,
    marginHorizontal: 2,
  },
  quickQuestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quickQuestionButton: {
    backgroundColor: '#EBF8FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  quickQuestionText: {
    color: '#2563EB',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    maxHeight: 100,
  },
  micButton: {
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OremiApp;