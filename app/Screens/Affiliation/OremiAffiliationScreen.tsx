import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from 'expo-router/build/global-state/routing';

const OremiAffiliationScreen = () => {
  const [userStats, setUserStats] = useState({
    filleuls: 12,
    reductionActuelle: 25, // % de réduction sur les contrats
    economiesAnnuelles: 340, // € économisés sur l'année
    reductionDisponible: 35, // % de réduction disponible pour le prochain renouvellement
    conversionRate: 28,
    nextLevel: 'Leader',
    nextLevelTarget: 21,
  });

  const [referralCode] = useState('SARAH2024');

  const shareReferralCode = async () => {
    const message = `🚗 Salut ! Tu paies combien ton assurance auto ? Moi j'ai -${userStats.reductionActuelle}% avec le parrainage Oremi ! Utilise mon code ${referralCode} pour avoir une réduction aussi sur ta première assurance 💰\n\nhttps://oremi.app/join?ref=${referralCode}`;
    
    try {
      await Share.share({
        message: message,
        title: 'Économise sur ton assurance avec Oremi',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const copyReferralCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copié !', 'Ton code de parrainage a été copié');
  };

  const filleulsList = [
    { name: 'Marie D.', date: '15/12/2024', status: 'Actif', reduction: '+5%' },
    { name: 'Pierre L.', date: '10/12/2024', status: 'Actif', reduction: '+5%' },
    { name: 'Sophie M.', date: '05/12/2024', status: 'En cours', reduction: '0%' },
    { name: 'Thomas R.', date: '28/11/2024', status: 'Actif', reduction: '+5%' },
  ];

  const reductionHistory = [
    { date: '15/12/2024', type: 'Nouveau Filleul', amount: '+5%', from: 'Marie D.' },
    { date: '10/12/2024', type: 'Nouveau Filleul', amount: '+5%', from: 'Pierre L.' },
    { date: '01/12/2024', type: 'Utilisation', amount: '-25%', from: 'Renouvellement Auto' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={()=>goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={16} color="#ffffff" />
            <Text style={styles.levelText}>{userStats.level}</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.filleuls}</Text>
              <Text style={styles.statLabel}>Filleuls actifs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.reductionActuelle}%</Text>
              <Text style={styles.statLabel}>Réduction actuelle</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.conversionRate}%</Text>
              <Text style={styles.statLabel}>Conversion</Text>
            </View>
          </View>

          {/* Progress to next level */}
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>
              Progression vers {userStats.nextLevel}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(userStats.filleuls / userStats.nextLevelTarget) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {userStats.filleuls}/{userStats.nextLevelTarget} filleuls
            </Text>
          </View>
        </View>

        

        {/* Referral Code */}
        <View style={styles.codeContainer}>
          <Text style={styles.sectionTitle}>Ton code de parrainage</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity onPress={copyReferralCode}>
              <Ionicons name="copy-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={shareReferralCode}>
              <View style={styles.actionIcon}>
                <Ionicons name="share-social" size={24} color="#10b981" />
              </View>
              <Text style={styles.actionText}>Partager</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={copyReferralCode}>
              <View style={styles.actionIcon}>
                <Ionicons name="copy" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.actionText}>Copier Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Filleuls */}
        <View style={styles.filleulsContainer}>
          <Text style={styles.sectionTitle}>Filleuls récents</Text>
          {filleulsList.map((filleul, index) => (
            <View key={index} style={styles.filleulCard}>
              <View style={styles.filleulInfo}>
                <Text style={styles.filleulName}>{filleul.name}</Text>
                <Text style={styles.filleulDate}>{filleul.date}</Text>
              </View>
              <View style={styles.filleulStatus}>
                <View style={[
                  styles.statusBadge,
                  filleul.status === 'Actif' ? styles.activeBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    filleul.status === 'Actif' ? styles.activeText : styles.pendingText
                  ]}>
                    {filleul.status}
                  </Text>
                </View>
                <Text style={styles.commissionText}>{filleul.reduction}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Réduction History */}
        <View style={styles.bonusContainer}>
          <Text style={styles.sectionTitle}>Historique réductions</Text>
          {reductionHistory.slice(0, 4).map((bonus, index) => (
            <View key={index} style={styles.bonusItem}>
              <View style={styles.bonusLeft}>
                <View style={[
                  styles.bonusTypeIcon,
                  bonus.type === 'Nouveau Filleul' ? styles.commissionIcon :
                  bonus.type === 'Bonus Fidélité' ? styles.bonusIcon : styles.useIcon
                ]}>
                  <Ionicons 
                    name={
                      bonus.type === 'Nouveau Filleul' ? "person-add" :
                      bonus.type === 'Bonus Fidélité' ? "star" : "pricetag"
                    } 
                    size={16} 
                    color="#ffffff" 
                  />
                </View>
                <View>
                  <Text style={styles.bonusType}>{bonus.type}</Text>
                  <Text style={styles.bonusFrom}>{bonus.from}</Text>
                </View>
              </View>
              <View style={styles.bonusRight}>
                <Text style={[
                  styles.bonusAmount,
                  bonus.amount.startsWith('+') ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {bonus.amount}
                </Text>
                <Text style={styles.bonusDate}>{bonus.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Simulateur d'Économies */}
        <View style={styles.calculatorContainer}>
          <Text style={styles.sectionTitle}>Simulateur d'économies</Text>
          <View style={styles.calculatorCard}>
            <Text style={styles.calculatorTitle}>
              Si tu parraines 15 amis de plus :
            </Text>
            <Text style={styles.calculatorResult}>
              Tu obtiens -10% sur ton prochain contrat assurance auto !
            </Text>
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
  helpButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  levelText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  progressSection: {
    marginTop: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
  },
  walletCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  walletInfo: {
    flex: 1,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  walletAmount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  walletDescription: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  codeContainer: {
    marginTop: 25,
  },
  codeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a',
    letterSpacing: 2,
  },
  filleulsContainer: {
    marginTop: 25,
  },
  filleulCard: {
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
  filleulInfo: {
    flex: 1,
  },
  filleulName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  filleulDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  filleulStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeText: {
    color: '#16a34a',
  },
  pendingText: {
    color: '#d97706',
  },
  commissionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  bonusContainer: {
    marginTop: 25,
  },
  bonusItem: {
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
  bonusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bonusTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commissionIcon: {
    backgroundColor: '#10b981',
  },
  bonusIcon: {
    backgroundColor: '#f59e0b',
  },
  useIcon: {
    backgroundColor: '#ef4444',
  },
  bonusType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  bonusFrom: {
    fontSize: 12,
    color: '#6b7280',
  },
  bonusRight: {
    alignItems: 'flex-end',
  },
  bonusAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#10b981',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  bonusDate: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  calculatorContainer: {
    marginTop: 25,
    marginBottom: 30,
  },
  calculatorCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  calculatorTitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  calculatorResult: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 5,
    textAlign:'center',
  },
  calculatorDetail: {
    fontSize: 12,
    color: '#cbd5e1',
    textAlign: 'center',
  },
});

export default OremiAffiliationScreen;