import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const OremiProfileScreen = () => {
  const navigation = useNavigation();
  
  // État pour gérer les alertes
  const [alertes, setAlertes] = useState({
    echeances: true,
    paiements: false,
    sinistres: true,
    promotions: false,
    parrainage: true,
  });

  // Configuration des notifications
  useEffect(() => {
    setupNotifications();
  }, []);

  // Configuration et permissions pour les notifications
  const setupNotifications = async () => {
    // Configuration du comportement des notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Demander les permissions
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissions requises',
          'Veuillez autoriser les notifications pour recevoir les alertes Oremi.',
          [{ text: 'OK' }]
        );
        return;
      }
    } else {
      Alert.alert('Émulateur détecté', 'Les notifications push ne fonctionnent que sur un appareil physique.');
    }
  };

  // Fonction pour basculer les alertes
  const toggleAlerte = async (type) => {
    setAlertes(prev => {
      const newAlertes = { ...prev, [type]: !prev[type] };
      
      // Si on active l'alerte, programmer les notifications
      if (newAlertes[type]) {
        simulateNotification(type);
      } else {
        // Si on désactive, annuler toutes les notifications de ce type
        cancelNotificationsForType(type);
        Alert.alert(
          "❌ Alerte désactivée",
          `Les notifications pour "${getAlertLabel(type)}" ont été désactivées.`,
          [{ text: "OK" }]
        );
      }
      
      return newAlertes;
    });
  };

  // Helper pour obtenir le label d'une alerte
  const getAlertLabel = (type) => {
    const labels = {
      echeances: "Échéances de contrats",
      paiements: "Rappels de paiements", 
      sinistres: "Suivi des sinistres",
      promotions: "Offres spéciales",
      parrainage: "Programme partenaire"
    };
    return labels[type];
  };

  // Simulation d'une notification push RÉELLE
  const simulateNotification = async (type) => {
    const notifications = {
      echeances: {
        title: "🔔 Oremi - Échéance proche",
        body: "Votre assurance auto expire le 14/01/2025 (dans 26 jours)",
        data: { type: 'echeances', screen: 'Contrats' }
      },
      paiements: {
        title: "🔔 Oremi - Prélèvement programmé",
        body: "65€ seront prélevés le 15/01/2025 pour votre assurance auto",
        data: { type: 'paiements', screen: 'Paiements' }
      },
      sinistres: {
        title: "🔔 Oremi - Sinistre mis à jour",
        body: "Dossier SIN789456 : Rapport d'expertise reçu",
        data: { type: 'sinistres', screen: 'Sinistres' }
      },
      promotions: {
        title: "🔔 Oremi - Offre spéciale",
        body: "-20% sur l'assurance voyage jusqu'au 31/01/2025",
        data: { type: 'promotions', screen: 'Promotions' }
      },
      parrainage: {
        title: "🔔 Oremi - Nouveau filleul !",
        body: "Thomas a souscrit grâce à vous. +5% de réduction !",
        data: { type: 'parrainage', screen: 'Affiliation' }
      }
    };

    const notification = notifications[type];
    
    try {
      // Programmer une notification dans 5 secondes (pour simuler)
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
          data: notification.data,
        },
        trigger: {
          seconds: 30, // Notification dans 30 secondes
        },
      });

      // Confirmer que la notification va être envoyée
      Alert.alert(
        "✅ Alerte activée !",
        `Vous recevrez une notification dans 30 secondes pour tester.\n\nVous pouvez maintenant fermer l'application.`,
        [
          {
            text: "OK",
            onPress: () => {
              console.log(`Notification ${type} programmée avec l'ID: ${notificationId}`);
            }
          }
        ]
      );

      // Programmer des notifications récurrentes selon le type
      scheduleRecurringNotifications(type, notification);

    } catch (error) {
      console.error('Erreur lors de la programmation de la notification:', error);
      Alert.alert('Erreur', 'Impossible de programmer la notification. Vérifiez les permissions.');
    }
  };

  // Programmer des notifications récurrentes
  const scheduleRecurringNotifications = async (type, notification) => {
    // Annuler les anciennes notifications de ce type
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const oldNotifications = scheduledNotifications.filter(n => n.content.data?.type === type);
    
    for (const oldNotif of oldNotifications) {
      await Notifications.cancelScheduledNotificationAsync(oldNotif.identifier);
    }

    // Programmer selon le type d'alerte
    switch (type) {
      case 'echeances':
        // Notification quotidienne à 9h pour les échéances
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: "Vérifiez vos contrats arrivant à échéance",
            data: notification.data,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 9,
            minute: 0,
          },
        });
        break;

      case 'paiements':
        // Notification 3 jours avant les prélèvements (simulation avec 1 minute)
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            data: notification.data,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 60,
            repeats: false,
          },
        });
        break;

      case 'sinistres':
        // Notifications aléatoirement pour les mises à jour de sinistres
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: "Nouveau document disponible dans votre dossier",
            data: notification.data,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 30,
            repeats: false,
          },
        });
        break;

      case 'promotions':
        // Notifications hebdomadaires pour les promotions
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: "Découvrez nos nouvelles offres exclusives !",
            data: notification.data,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: 2, // Mardi
            hour: 10,
            minute: 0,
          },
        });
        break;

      case 'parrainage':
        // Notification quand un filleul s'inscrit (simulation)
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: "Votre lien de parrainage a été utilisé !",
            data: notification.data,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 45,
            repeats: false,
          },
        });
        break;
    }
  };

  // Annuler toutes les notifications d'un type quand on désactive
  const cancelNotificationsForType = async (type) => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const notificationsToCancel = scheduledNotifications.filter(n => n.content.data?.type === type);
    
    for (const notification of notificationsToCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
    
    console.log(`${notificationsToCancel.length} notifications de type ${type} annulées`);
  };

  const menuItems = [
    {
      id: 3,
      icon: 'document-text-outline',
      title: 'Mes devis',
      subtitle: null,
      badge: null,
      onPress: () => console.log('Mes devis pressed'),
      hasArrow: true,
    },
    {
      id: 4,
      icon: 'folder-outline',
      title: 'Mes documents',
      subtitle: null,
      badge: null,
      onPress: () => console.log('Mes documents pressed'),
      hasArrow: true,
    },
    {
      id: 1,
      icon: 'people-outline',
      title: 'Affiliation',
      subtitle: 'Programme Partenaire',
      onPress: () => navigation.navigate("Affiliation"),
      hasArrow: true,
    },
    {
      id: 5,
      icon: 'card-outline',
      title: 'Historique des paiements',
      subtitle: null,
      badge: null,
      onPress: () => console.log('Historique paiements pressed'),
      hasArrow: true,
    },
    {
      id: 6,
      icon: 'shield-checkmark-outline',
      title: 'Mentions légales',
      subtitle: null,
      badge: null,
      onPress: () => console.log('Mentions légales pressed'),
      hasArrow: true,
    },
    {
      id: 7,
      icon: 'log-out-outline',
      title: 'Déconnexion',
      subtitle: null,
      badge: null,
      onPress: () => console.log('Déconnexion pressed'),
      hasArrow: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#01548b" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#01548b" />
              </View>
            </View>
            <Text style={styles.appName}>Oremi</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickActionCard, styles.helpCard]}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="help-circle" size={32} color="#10b981" />
            </View>
            <Text style={styles.quickActionText}>Besoin d'aide ?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickActionCard, styles.infoCard]}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="person-circle" size={32} color="#f472b6" />
            </View>
            <Text style={styles.quickActionText}>Mes informations</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.menuIconContainer,
                  item.id === 1 && styles.affiliateIconContainer,
                  item.id === 2 && styles.walletIconContainer
                ]}>
                  <Ionicons 
                    name={item.icon} 
                    size={24} 
                    color={
                      item.id === 1 ? "#10b981" : 
                      item.id === 2 ? "#f59e0b" : 
                      "#374151"
                    } 
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                    {item.badge && (
                      <View style={[
                        styles.badge,
                        item.id === 1 && styles.expertBadge
                      ]}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              {item.hasArrow && (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Section Alertes Automatiques */}
        <View style={styles.alertesContainer}>
          <Text style={styles.alertesTitle}>Alertes automatiques</Text>
          <Text style={styles.alertesSubtitle}>
            Recevez des notifications pour ne rien manquer
          </Text>
          
          <View style={styles.alertesCard}>
            {/* Alertes d'échéances */}
            <View style={styles.alerteItem}>
              <View style={styles.alerteLeft}>
                <View style={[styles.alerteIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
                </View>
                <View style={styles.alerteInfo}>
                  <Text style={styles.alerteTitle}>Échéances de contrats</Text>
                  <Text style={styles.alerteDescription}>
                    Rappel 30 jours avant expiration
                  </Text>
                </View>
              </View>
              <Switch
                value={alertes.echeances}
                onValueChange={() => toggleAlerte('echeances')}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={alertes.echeances ? '#ffffff' : '#f3f4f6'}
                ios_backgroundColor="#e5e7eb"
              />
            </View>

            {/* Rappels de paiements */}
            <View style={styles.alerteItem}>
              <View style={styles.alerteLeft}>
                <View style={[styles.alerteIcon, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="card-outline" size={20} color="#3b82f6" />
                </View>
                <View style={styles.alerteInfo}>
                  <Text style={styles.alerteTitle}>Rappels de paiements</Text>
                  <Text style={styles.alerteDescription}>
                    Notification 3 jours avant prélèvement
                  </Text>
                </View>
              </View>
              <Switch
                value={alertes.paiements}
                onValueChange={() => toggleAlerte('paiements')}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={alertes.paiements ? '#ffffff' : '#f3f4f6'}
                ios_backgroundColor="#e5e7eb"
              />
            </View>

            {/* Suivi des sinistres */}
            <View style={styles.alerteItem}>
              <View style={styles.alerteLeft}>
                <View style={[styles.alerteIcon, { backgroundColor: '#fef2f2' }]}>
                  <Ionicons name="shield-outline" size={20} color="#ef4444" />
                </View>
                <View style={styles.alerteInfo}>
                  <Text style={styles.alerteTitle}>Suivi des sinistres</Text>
                  <Text style={styles.alerteDescription}>
                    Mises à jour sur vos dossiers en cours
                  </Text>
                </View>
              </View>
              <Switch
                value={alertes.sinistres}
                onValueChange={() => toggleAlerte('sinistres')}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={alertes.sinistres ? '#ffffff' : '#f3f4f6'}
                ios_backgroundColor="#e5e7eb"
              />
            </View>

            {/* Offres spéciales */}
            <View style={styles.alerteItem}>
              <View style={styles.alerteLeft}>
                <View style={[styles.alerteIcon, { backgroundColor: '#f3e8ff' }]}>
                  <Ionicons name="gift-outline" size={20} color="#8b5cf6" />
                </View>
                <View style={styles.alerteInfo}>
                  <Text style={styles.alerteTitle}>Offres spéciales</Text>
                  <Text style={styles.alerteDescription}>
                    Promotions et nouvelles garanties
                  </Text>
                </View>
              </View>
              <Switch
                value={alertes.promotions}
                onValueChange={() => toggleAlerte('promotions')}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={alertes.promotions ? '#ffffff' : '#f3f4f6'}
                ios_backgroundColor="#e5e7eb"
              />
            </View>

            {/* Parrainage */}
            <View style={[styles.alerteItem, styles.lastAlerteItem]}>
              <View style={styles.alerteLeft}>
                <View style={[styles.alerteIcon, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="people-outline" size={20} color="#10b981" />
                </View>
                <View style={styles.alerteInfo}>
                  <Text style={styles.alerteTitle}>Programme partenaire</Text>
                  <Text style={styles.alerteDescription}>
                    Nouvelles commissions et filleuls
                  </Text>
                </View>
              </View>
              <Switch
                value={alertes.parrainage}
                onValueChange={() => toggleAlerte('parrainage')}
                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                thumbColor={alertes.parrainage ? '#ffffff' : '#f3f4f6'}
                ios_backgroundColor="#e5e7eb"
              />
            </View>
          </View>

          {/* Simulation en temps réel */}
          <View style={styles.simulationContainer}>
            <Text style={styles.simulationTitle}>📱 Aperçu Notifications</Text>
            
            {/* Simulation échéances */}
            {alertes.echeances && (
              <View style={styles.notificationDemo}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="calendar" size={16} color="#f59e0b" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>Échéance proche ⏰</Text>
                  <Text style={styles.notificationText}>
                    Votre assurance auto expire le 14/01/2025 (dans 26 jours)
                  </Text>
                </View>
              </View>
            )}

            {/* Simulation paiements */}
            {alertes.paiements && (
              <View style={styles.notificationDemo}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="card" size={16} color="#3b82f6" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>Prélèvement programmé 💳</Text>
                  <Text style={styles.notificationText}>
                    65€ seront prélevés le 15/01/2025 pour votre assurance auto
                  </Text>
                </View>
              </View>
            )}

            {/* Simulation sinistres */}
            {alertes.sinistres && (
              <View style={styles.notificationDemo}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="shield" size={16} color="#ef4444" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>Sinistre mis à jour 🔄</Text>
                  <Text style={styles.notificationText}>
                    Dossier SIN789456 : Rapport d'expertise reçu
                  </Text>
                </View>
              </View>
            )}

            {/* Simulation promotions */}
            {alertes.promotions && (
              <View style={styles.notificationDemo}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="gift" size={16} color="#8b5cf6" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>Offre spéciale 🎉</Text>
                  <Text style={styles.notificationText}>
                    -20% sur l'assurance voyage jusqu'au 31/01/2025
                  </Text>
                </View>
              </View>
            )}

            {/* Simulation parrainage */}
            {alertes.parrainage && (
              <View style={styles.notificationDemo}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="people" size={16} color="#10b981" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>Nouveau filleul ! 🎊</Text>
                  <Text style={styles.notificationText}>
                    Thomas a souscrit grâce à vous. +5% de réduction !
                  </Text>
                </View>
              </View>
            )}

            {/* Message si toutes les alertes sont désactivées */}
            {!Object.values(alertes).some(Boolean) && (
              <View style={styles.noNotificationDemo}>
                <Ionicons name="notifications-off-outline" size={24} color="#9ca3af" />
                <Text style={styles.noNotificationText}>
                  Toutes les alertes sont désactivées
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#01548b',
    paddingVertical: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 30,
    gap: 15,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  helpCard: {
    backgroundColor: '#ffffff',
  },
  infoCard: {
    backgroundColor: '#ffffff',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  affiliateIconContainer: {
    backgroundColor: '#ecfdf5',
  },
  walletIconContainer: {
    backgroundColor: '#fef3c7',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '400',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#ddd6fe',
  },
  expertBadge: {
    backgroundColor: '#ecfdf5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10b981',
  },
  // Styles pour la section alertes
  alertesContainer: {
    marginBottom: 30,
  },
  alertesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  alertesSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  alertesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  alerteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastAlerteItem: {
    borderBottomWidth: 0,
  },
  alerteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alerteIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alerteInfo: {
    flex: 1,
  },
  alerteTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  alerteDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  // Styles pour la simulation
  simulationContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  simulationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  notificationDemo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  notificationText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  noNotificationDemo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noNotificationText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default OremiProfileScreen;