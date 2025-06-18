import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OremiBonusWalletScreen = () => {
  const [walletBalance, setWalletBalance] = useState(125);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [usageAmount, setUsageAmount] = useState('');

  const usageOptions = [
    {
      id: 1,
      title: 'Franchise Sinistre',
      description: 'Payer ma franchise en cas de sinistre',
      icon: 'shield-outline',
      color: '#ef4444',
      maxAmount: walletBalance,
    },
    {
      id: 2,
      title: 'Frais d\'Expert',
      description: 'Couvrir les frais d\'expertise',
      icon: 'person-outline',
      color: '#3b82f6',
      maxAmount: Math.min(walletBalance, 50),
    },
    {
      id: 3,
      title: 'Frais de Dossier',
      description: 'Régler les frais administratifs',
      icon: 'document-text-outline',
      color: '#f59e0b',
      maxAmount: Math.min(walletBalance, 30),
    },
    {
      id: 4,
      title: 'Cotisation Mensuelle',
      description: 'Réduire ma prochaine facture',
      icon: 'card-outline',
      color: '#10b981',
      maxAmount: walletBalance,
    },
  ];

  const transactionHistory = [
    {
      id: 1,
      date: '15/12/2024',
      type: 'Commission',
      description: 'Filleul Marie D. - Souscription auto',
      amount: '+25€',
      status: 'completed',
      icon: 'cash',
      color: '#10b981',
    },
    {
      id: 2,
      date: '12/12/2024',
      type: 'Bonus Qualité',
      description: 'Taux de conversion > 25%',
      amount: '+10€',
      status: 'completed',
      icon: 'star',
      color: '#f59e0b',
    },
    {
      id: 3,
      date: '10/12/2024',
      type: 'Commission',
      description: 'Filleul Pierre L. - Souscription habitation',
      amount: '+25€',
      status: 'completed',
      icon: 'cash',
      color: '#10b981',
    },
    {
      id: 4,
      date: '08/12/2024',
      type: 'Utilisation',
      description: 'Franchise sinistre auto - Dossier SIN123456',
      amount: '-15€',
      status: 'completed',
      icon: 'shield',
      color: '#ef4444',
    },
    {
      id: 5,
      date: '05/12/2024',
      type: 'Commission',
      description: 'Filleul Sophie M. - Souscription auto',
      amount: '+25€',
      status: 'completed',
      icon: 'cash',
      color: '#10b981',
    },
    {
      id: 6,
      date: '01/12/2024',
      type: 'Bonus Volume',
      description: 'Plus de 10 filleuls actifs',
      amount: '+20€',
      status: 'completed',
      icon: 'trophy',
      color: '#8b5cf6',
    },
  ];

  const handleUsage = (option) => {
    setSelectedUsage(option);
    setShowUsageModal(true);
  };

  const confirmUsage = () => {
    const amount = parseFloat(usageAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    }
    if (amount > selectedUsage.maxAmount) {
      Alert.alert('Erreur', `Montant maximum: ${selectedUsage.maxAmount}€`);
      return;
    }
    if (amount > walletBalance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return;
    }

    setWalletBalance(prev => prev - amount);
    setShowUsageModal(false);
    setUsageAmount('');
    setSelectedUsage(null);
    
    Alert.alert(
      'Utilisation confirmée !',
      `${amount}€ ont été utilisés pour ${selectedUsage.title.toLowerCase()}`
    );
  };

  const nextEarnings = [
    { name: 'Thomas R.', amount: '25€', status: 'En attente validation', date: '20/12/2024' },
    { name: 'Julie K.', amount: '30€', status: 'Souscription en cours', date: '22/12/2024' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bonus Wallet</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.walletIconLarge}>
              <Ionicons name="wallet" size={32} color="#f59e0b" />
            </View>
            <Text style={styles.balanceLabel}>Solde Disponible</Text>
          </View>
          <Text style={styles.balanceAmount}>{walletBalance}€</Text>
          <Text style={styles.balanceDescription}>
            Tes commissions d'affiliation utilisables pour tes frais d'assurance
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>75€</Text>
            <Text style={styles.statLabel}>Gagné ce mois</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>15€</Text>
            <Text style={styles.statLabel}>Utilisé ce mois</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>680€</Text>
            <Text style={styles.statLabel}>Total 2024</Text>
          </View>
        </View>

        {/* Usage Options */}
        <View style={styles.usageContainer}>
          <Text style={styles.sectionTitle}>Utiliser mes Bonus</Text>
          <Text style={styles.sectionSubtitle}>
            Paye tes frais d'assurance avec tes commissions
          </Text>
          
          <View style={styles.usageGrid}>
            {usageOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.usageCard}
                onPress={() => handleUsage(option)}
                disabled={option.maxAmount <= 0}
              >
                <View style={[styles.usageIcon, { backgroundColor: `${option.color}20` }]}>
                  <Ionicons name={option.icon} size={24} color={option.color} />
                </View>
                <Text style={styles.usageTitle}>{option.title}</Text>
                <Text style={styles.usageDescription}>{option.description}</Text>
                <Text style={styles.usageMax}>Max: {option.maxAmount}€</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next Earnings */}
        <View style={styles.nextEarningsContainer}>
          <Text style={styles.sectionTitle}>Prochains Gains</Text>
          {nextEarnings.map((earning, index) => (
            <View key={index} style={styles.earningCard}>
              <View style={styles.earningLeft}>
                <View style={styles.earningIcon}>
                  <Ionicons name="time-outline" size={20} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.earningName}>{earning.name}</Text>
                  <Text style={styles.earningStatus}>{earning.status}</Text>
                </View>
              </View>
              <View style={styles.earningRight}>
                <Text style={styles.earningAmount}>{earning.amount}</Text>
                <Text style={styles.earningDate}>{earning.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Transaction History */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Historique Complet</Text>
          {transactionHistory.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: `${transaction.color}20` }
                ]}>
                  <Ionicons 
                    name={transaction.icon} 
                    size={20} 
                    color={transaction.color} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>{transaction.type}</Text>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.amount.startsWith('+') ? 
                  styles.positiveAmount : styles.negativeAmount
              ]}>
                {transaction.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Help Section */}
        <View style={styles.helpContainer}>
          <View style={styles.helpCard}>
            <Ionicons name="help-circle" size={24} color="#3b82f6" />
            <View style={styles.helpText}>
              <Text style={styles.helpTitle}>Comment ça marche ?</Text>
              <Text style={styles.helpDescription}>
                Tes commissions d'affiliation sont automatiquement créditées dans ton Bonus Wallet. 
                Tu peux les utiliser pour régler tes franchises, frais de dossier ou réduire tes cotisations.
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Usage Modal */}
      <Modal
        visible={showUsageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUsageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedUsage?.title}
              </Text>
              <TouchableOpacity onPress={() => setShowUsageModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              {selectedUsage?.description}
            </Text>
            
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Montant à utiliser</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  value={usageAmount}
                  onChangeText={setUsageAmount}
                  placeholder="0"
                  keyboardType="numeric"
                />
                <Text style={styles.euroSymbol}>€</Text>
              </View>
              <Text style={styles.maxAmountText}>
                Maximum disponible: {selectedUsage?.maxAmount}€
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowUsageModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmUsage}
              >
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  walletIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  balanceDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  usageContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  usageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  usageCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  usageIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  usageDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  usageMax: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  nextEarningsContainer: {
    marginTop: 30,
  },
  earningCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  earningLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  earningIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  earningName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  earningStatus: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 2,
  },
  earningRight: {
    alignItems: 'flex-end',
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  earningDate: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  historyContainer: {
    marginTop: 30,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  transactionDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    lineHeight: 16,
  },
  transactionDate: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#10b981',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  helpContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  helpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  helpText: {
    flex: 1,
    marginLeft: 15,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  helpDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 25,
    lineHeight: 20,
  },
  amountContainer: {
    marginBottom: 30,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  euroSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  maxAmountText: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default OremiBonusWalletScreen;