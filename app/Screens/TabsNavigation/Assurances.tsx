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

const OremiAssurancesScreen = () => {
  const [activeTab, setActiveTab] = useState('actifs');

  const contratsActifs = [
    {
      id: 1,
      type: 'Auto',
      nom: 'Assurance Véhicule',
      vehicule: 'Peugeot 308 - AB-123-CD',
      numeroContrat: 'AUTO789456',
      dateDebut: '15/01/2024',
      dateFin: '14/01/2025',
      prochainePrime: '65 FCFA',
      dateProchainePrime: '15/01/2025',
      statut: 'Actif',
      garanties: ['Responsabilité civile', 'Tous risques', 'Protection juridique', 'Assistance 0km'],
      franchise: '200 FCFA',
      icon: 'car-sport',
      color: '#10b981',
      backgroundColor: '#ecfdf5',
    },
    {
      id: 2,
      type: 'Habitation',
      nom: 'Multirisque Habitation',
      adresse: '25 Rue des Fleurs, 75015 Paris',
      numeroContrat: 'HAB456123',
      dateDebut: '01/09/2023',
      dateFin: '31/08/2024',
      prochainePrime: '42 FCFA',
      dateProchainePrime: '01/09/2024',
      statut: 'Actif',
      garanties: ['Incendie', 'Dégâts des eaux', 'Vol', 'Responsabilité civile'],
      franchise: '150 FCFA',
      icon: 'home',
      color: '#3b82f6',
      backgroundColor: '#eff6ff',
    },
  ];

  const contratsExpires = [
    {
      id: 4,
      type: 'Auto',
      nom: 'Ex-Assurance Citroën',
      vehicule: 'Citroën C3 - XY-789-ZA',
      numeroContrat: 'AUTO123789',
      dateDebut: '10/03/2022',
      dateFin: '09/03/2023',
      statut: 'Expiré',
      motifArret: 'Vente du véhicule',
      icon: 'car-sport',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
    },
  ];

  const renderContratCard = (contrat, isExpired = false) => (
    <TouchableOpacity key={contrat.id} style={[styles.contratCard, isExpired && styles.expiredCard]}>
      <View style={styles.contratHeader}>
        <View style={[styles.contratIcon, { backgroundColor: contrat.backgroundColor }]}>
          <Ionicons name={contrat.icon} size={24} color={contrat.color} />
        </View>
        <View style={styles.contratHeaderInfo}>
          <Text style={[styles.contratType, isExpired && styles.expiredText]}>{contrat.type}</Text>
          <Text style={[styles.contratNom, isExpired && styles.expiredText]}>{contrat.nom}</Text>
        </View>
        <View style={[styles.statutBadge, 
          contrat.statut === 'Actif' ? styles.actifBadge : styles.expireBadge
        ]}>
          <Text style={[styles.statutText,
            contrat.statut === 'Actif' ? styles.actifText : styles.expireText
          ]}>
            {contrat.statut}
          </Text>
        </View>
      </View>

      <View style={styles.contratDetails}>
        <Text style={[styles.contratNumero, isExpired && styles.expiredText]}>
          Contrat {contrat.numeroContrat}
        </Text>
        
        {contrat.vehicule && (
          <Text style={[styles.contratInfo, isExpired && styles.expiredText]}>
            🚗 {contrat.vehicule}
          </Text>
        )}
        
        {contrat.adresse && (
          <Text style={[styles.contratInfo, isExpired && styles.expiredText]}>
            🏠 {contrat.adresse}
          </Text>
        )}
        
        {contrat.formule && (
          <Text style={[styles.contratInfo, isExpired && styles.expiredText]}>
            💊 {contrat.formule}
          </Text>
        )}

        <View style={styles.datesContainer}>
          <Text style={[styles.dateText, isExpired && styles.expiredText]}>
            📅 Du {contrat.dateDebut} au {contrat.dateFin}
          </Text>
        </View>

        {!isExpired && (
          <>
            <View style={styles.primeContainer}>
              <Text style={styles.primeLabel}>Prochaine prime :</Text>
              <Text style={styles.primeAmount}>{contrat.prochainePrime}</Text>
              <Text style={styles.primeDate}>le {contrat.dateProchainePrime}</Text>
            </View>

            <View style={styles.garantiesContainer}>
              <Text style={styles.garantiesTitle}>Garanties principales :</Text>
              <View style={styles.garantiesList}>
                {contrat.garanties.slice(0, 2).map((garantie, index) => (
                  <View key={index} style={styles.garantieTag}>
                    <Text style={styles.garantieText}>{garantie}</Text>
                  </View>
                ))}
                {contrat.garanties.length > 2 && (
                  <View style={styles.garantieTag}>
                    <Text style={styles.garantieText}>+{contrat.garanties.length - 2}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.franchiseContainer}>
              <Text style={styles.franchiseText}>Franchise : {contrat.franchise}</Text>
            </View>
          </>
        )}

        {isExpired && contrat.motifArret && (
          <Text style={styles.motifArret}>Motif : {contrat.motifArret}</Text>
        )}
      </View>

      <View style={styles.contratActions}>
        {!isExpired ? (
          <>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={16} color="#3b82f6" />
              <Text style={styles.actionText}>Voir détails</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="archive-outline" size={16} color="#6b7280" />
            <Text style={styles.actionText}>Archiver</Text>
          </TouchableOpacity>
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
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Contrats actifs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>-25%</Text>
          <Text style={styles.statLabel}>vs marché</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'actifs' && styles.activeTab]}
          onPress={() => setActiveTab('actifs')}
        >
          <Text style={[styles.tabText, activeTab === 'actifs' && styles.activeTabText]}>
            Contrats Actifs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expires' && styles.activeTab]}
          onPress={() => setActiveTab('expires')}
        >
          <Text style={[styles.tabText, activeTab === 'expires' && styles.activeTabText]}>
            Historique
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'actifs' ? (
          <>
            {contratsActifs.map(contrat => renderContratCard(contrat))}
            
            {/* Suggestion nouveau contrat */}
            <TouchableOpacity style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Ionicons name="bulb-outline" size={24} color="#10b981" />
                <Text style={styles.suggestionTitle}>Suggestion Oremi AI</Text>
              </View>
              <Text style={styles.suggestionText}>
                📱 Vous n'avez pas d'assurance mobile. Protégez votre smartphone dès 8 FCFA/mois !
              </Text>
              <TouchableOpacity style={styles.suggestionButton}>
                <Text style={styles.suggestionButtonText}>Découvrir</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {contratsExpires.map(contrat => renderContratCard(contrat, true))}
            {contratsExpires.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="archive-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyTitle}>Aucun contrat expiré</Text>
                <Text style={styles.emptyText}>Vos anciens contrats apparaîtront ici</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* FAB pour nouveau contrat */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="#ffffff" />
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
    fontSize: 18,
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
    borderBottomColor: '#01548b',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#01548b',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contratCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expiredCard: {
    opacity: 0.7,
  },
  contratHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  contratIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contratHeaderInfo: {
    flex: 1,
  },
  contratType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01548b',
    marginBottom: 2,
  },
  contratNom: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  expiredText: {
    color: '#9ca3af',
  },
  statutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actifBadge: {
    backgroundColor: '#dcfce7',
  },
  expireBadge: {
    backgroundColor: '#fee2e2',
  },
  statutText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actifText: {
    color: '#16a34a',
  },
  expireText: {
    color: '#dc2626',
  },
  contratDetails: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  contratNumero: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  contratInfo: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  datesContainer: {
    marginVertical: 10,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
  primeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  primeLabel: {
    fontSize: 14,
    color: '#374151',
    marginRight: 8,
  },
  primeAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#01548b',
    marginRight: 8,
  },
  primeDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  garantiesContainer: {
    marginVertical: 10,
  },
  garantiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  garantiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  garantieTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  garantieText: {
    fontSize: 11,
    color: '#0284c7',
    fontWeight: '500',
  },
  franchiseContainer: {
    marginTop: 10,
  },
  franchiseText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  motifArret: {
    fontSize: 13,
    color: '#dc2626',
    fontStyle: 'italic',
    marginTop: 8,
  },
  contratActions: {
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
  suggestionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#78716c',
    lineHeight: 20,
    marginBottom: 15,
  },
  suggestionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  suggestionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#01548b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default OremiAssurancesScreen;