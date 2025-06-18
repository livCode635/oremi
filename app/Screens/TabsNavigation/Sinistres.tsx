import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from 'expo-router/build/global-state/routing';

const OremiSinistresScreen = () => {
  const [activeTab, setActiveTab] = useState('encours');

  const sinistresEnCours = [
    {
      id: 1,
      numeroDossier: 'SIN789456',
      type: 'Accident Auto',
      contrat: 'AUTO789456',
      dateDeclaration: '12/12/2024',
      dateSinistre: '10/12/2024',
      statut: 'Expertise en cours',
      description: 'Collision en stationnement - Place de la République',
      expert: {
        nom: 'M. Martin',
        telephone: '06.12.34.56.78',
        email: 'martin@expertise.com',
      },
      franchise: '200 FCFA',
      indemnisation: 'En cours d\'évaluation',
      prochainEtape: 'Rapport d\'expertise sous 48h',
      icon: 'car-sport',
      color: '#f59e0b',
      backgroundColor: '#fef3c7',
      progression: 60,
    },
    {
      id: 2,
      numeroDossier: 'SIN654321',
      type: 'Dégât des Eaux',
      contrat: 'HAB456123',
      dateDeclaration: '08/12/2024',
      dateSinistre: '07/12/2024',
      statut: 'Travaux en cours',
      description: 'Fuite canalisation cuisine - Appartement Paris 15e',
      expert: {
        nom: 'Mme Dubois',
        telephone: '06.98.76.54.32',
        email: 'dubois@expertise.com',
      },
      franchise: '150 FCFA',
      indemnisation: '1,850 FCFA validé',
      prochainEtape: 'Fin travaux prévue 20/12/2024',
      icon: 'water',
      color: '#3b82f6',
      backgroundColor: '#eff6ff',
      progression: 80,
    },
  ];

  const sinistresTermines = [
    {
      id: 3,
      numeroDossier: 'SIN123789',
      type: 'Bris de Glace',
      contrat: 'AUTO789456',
      dateDeclaration: '15/11/2024',
      dateSinistre: '14/11/2024',
      dateClôture: '22/11/2024',
      statut: 'Terminé',
      description: 'Impact pare-brise - Autoroute A6',
      franchise: '50 FCFA',
      indemnisation: '280 FCFA versé',
      dureeTraitement: '7 jours',
      icon: 'car-sport',
      color: '#10b981',
      backgroundColor: '#ecfdf5',
    },
    {
      id: 4,
      numeroDossier: 'SIN987654',
      type: 'Vol Habitation',
      contrat: 'HAB456123',
      dateDeclaration: '03/10/2024',
      dateSinistre: '02/10/2024',
      dateClôture: '15/10/2024',
      statut: 'Terminé',
      description: 'Cambriolage pendant absence - Ordinateur portable volé',
      franchise: '150 FCFA',
      indemnisation: '920 FCFA versé',
      dureeTraitement: '12 jours',
      icon: 'shield-outline',
      color: '#10b981',
      backgroundColor: '#ecfdf5',
    },
  ];

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Terminé':
        return { color: '#16a34a', backgroundColor: '#dcfce7' };
      case 'Expertise en cours':
        return { color: '#d97706', backgroundColor: '#fef3c7' };
      case 'Travaux en cours':
        return { color: '#3b82f6', backgroundColor: '#eff6ff' };
      default:
        return { color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  const renderSinistreCard = (sinistre, isTermine = false) => (
    <TouchableOpacity key={sinistre.id} style={styles.sinistreCard}>
      <View style={styles.sinistreHeader}>
        <View style={[styles.sinistreIcon, { backgroundColor: sinistre.backgroundColor }]}>
          <Ionicons name={sinistre.icon} size={24} color={sinistre.color} />
        </View>
        <View style={styles.sinistreHeaderInfo}>
          <Text style={styles.sinistreType}>{sinistre.type}</Text>
          <Text style={styles.numeroDossier}>Dossier {sinistre.numeroDossier}</Text>
        </View>
        <View style={[styles.statutBadge, getStatutColor(sinistre.statut)]}>
          <Text style={[styles.statutText, { color: getStatutColor(sinistre.statut).color }]}>
            {sinistre.statut}
          </Text>
        </View>
      </View>

      <View style={styles.sinistreDetails}>
        <Text style={styles.description}>{sinistre.description}</Text>
        
        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Sinistre :</Text>
            <Text style={styles.dateValue}>{sinistre.dateSinistre}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Déclaration :</Text>
            <Text style={styles.dateValue}>{sinistre.dateDeclaration}</Text>
          </View>
          {sinistre.dateClôture && (
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Clôture :</Text>
              <Text style={styles.dateValue}>{sinistre.dateClôture}</Text>
            </View>
          )}
        </View>

        {!isTermine && sinistre.progression && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Avancement</Text>
              <Text style={styles.progressPercentage}>{sinistre.progression}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${sinistre.progression}%` }]}
              />
            </View>
          </View>
        )}

        <View style={styles.financialInfo}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Franchise :</Text>
            <Text style={styles.financialValue}>{sinistre.franchise}</Text>
          </View>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Indemnisation :</Text>
            <Text style={[
              styles.financialValue,
              isTermine ? styles.paidAmount : styles.pendingAmount
            ]}>
              {sinistre.indemnisation}
            </Text>
          </View>
        </View>

        {!isTermine && sinistre.expert && (
          <View style={styles.expertContainer}>
            <Text style={styles.expertTitle}>👤 Expert assigné :</Text>
            <Text style={styles.expertName}>{sinistre.expert.nom}</Text>
            <View style={styles.expertContact}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call" size={16} color="#3b82f6" />
                <Text style={styles.contactText}>{sinistre.expert.telephone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isTermine && sinistre.prochainEtape && (
          <View style={styles.nextStepContainer}>
            <Text style={styles.nextStepTitle}>📋 Prochaine étape :</Text>
            <Text style={styles.nextStepText}>{sinistre.prochainEtape}</Text>
          </View>
        )}

        {isTermine && sinistre.dureeTraitement && (
          <View style={styles.treatmentDuration}>
            <Text style={styles.treatmentText}>
              ⏱️ Traité en {sinistre.dureeTraitement}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.sinistreActions}>
        {!isTermine ? (
          <>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={16} color="#6b7280" />
              <Text style={styles.actionText}>Détails</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call-outline" size={16} color="#10b981" />
              <Text style={styles.actionText}>Contacter</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={()=> goBack()}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>9j</Text>
          <Text style={styles.statLabel}>Délai moyen</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'encours' && styles.activeTab]}
          onPress={() => setActiveTab('encours')}
        >
          <Text style={[styles.tabText, activeTab === 'encours' && styles.activeTabText]}>
            En Cours (2)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'termines' && styles.activeTab]}
          onPress={() => setActiveTab('termines')}
        >
          <Text style={[styles.tabText, activeTab === 'termines' && styles.activeTabText]}>
            Terminés (2)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'encours' ? (
          <>
            {sinistresEnCours.map(sinistre => renderSinistreCard(sinistre))}
            
          </>
        ) : (
          <>
            {sinistresTermines.map(sinistre => renderSinistreCard(sinistre, true))}
          
          </>
        )}

        {/* Action rapide */}
        <TouchableOpacity style={styles.quickActionCard}>
          <View style={styles.quickActionHeader}>
            <Ionicons name="flash" size={24} color="#1e3a8a" />
            <Text style={styles.quickActionTitle}>Déclarer un nouveau sinistre</Text>
          </View>
          <Text style={styles.quickActionText}>
            Accident, vol, dégât... Déclarez en 2 minutes avec notre assistant intelligent
          </Text>
          <View style={styles.quickActionButton}>
            <Text style={styles.quickActionButtonText}>Commencer la déclaration</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB pour nouveau sinistre */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="alert-circle" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingVertical: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  backButton: {
    backgroundColor: '#01548b',
    padding: 5,
    borderRadius: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  addButton: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1e3a8a',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sinistreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sinistreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  sinistreIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sinistreHeaderInfo: {
    flex: 1,
  },
  sinistreType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  numeroDossier: {
    fontSize: 13,
    color: '#6b7280',
  },
  statutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statutText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sinistreDetails: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 15,
    lineHeight: 20,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e3a8a',
  },
  financialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  financialItem: {
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  paidAmount: {
    color: '#16a34a',
  },
  pendingAmount: {
    color: '#d97706',
  },
  expertContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  expertTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  expertName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  expertContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  contactText: {
    fontSize: 13,
    color: '#3b82f6',
    marginLeft: 5,
    fontWeight: '500',
  },
  nextStepContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  nextStepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
    marginBottom: 5,
  },
  nextStepText: {
    fontSize: 13,
    color: '#78716c',
    lineHeight: 18,
  },
  treatmentDuration: {
    alignItems: 'center',
    marginTop: 10,
  },
  treatmentText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '500',
  },
  sinistreActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 5,
    fontWeight: '500',
  },
  urgenceCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  urgenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  urgenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  urgenceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 5,
  },
  urgenceSubtext: {
    fontSize: 14,
    color: '#7f1d1d',
  },
  preventionCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  preventionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  preventionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginLeft: 8,
  },
  preventionText: {
    fontSize: 14,
    color: '#15803d',
    marginBottom: 10,
  },
  preventionList: {
    marginLeft: 10,
  },
  preventionItem: {
    fontSize: 13,
    color: '#166534',
    marginBottom: 5,
    lineHeight: 18,
  },
  quickActionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 15,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    borderRadius: 12,
  },
  quickActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default OremiSinistresScreen;