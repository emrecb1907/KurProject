import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, AlertCircleIcon, BulbIcon, Video01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

export default function ChestScreen() {
  const router = useRouter();
  const { themeVersion } = useTheme();
  
  // Dynamic styles that update when theme changes
  const styles = useMemo(() => getStyles(), [themeVersion]);
  
  // Temporary mock data - AdMob requires dev build
  const currentLives = 5;
  const maxLives = 5;
  const livesPerAd = 1;

  const adSlots = [
    { id: 1, title: '❤️ Can Kazan', description: 'Reklam izle, +1 can kazan' },
    { id: 2, title: '❤️ Can Kazan', description: 'Reklam izle, +1 can kazan' },
    { id: 3, title: '❤️ Can Kazan', description: 'Reklam izle, +1 can kazan' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButtonContainer}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={colors.secondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Sandık</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Lives Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <HugeiconsIcon icon={FavouriteIcon} size={48} color={colors.error} />
          </View>
          <Text style={styles.statusText}>
            {currentLives} / {maxLives}
          </Text>
          <Text style={styles.statusLabel}>Can</Text>
          {currentLives >= maxLives ? (
            <Text style={styles.statusSubtext}>Can sayın maksimumda! 🎉</Text>
          ) : (
            <Text style={styles.statusSubtext}>
              Reklam izleyerek can kazanabilirsin
            </Text>
          )}
        </View>

        {/* Info Message */}
        <View style={styles.infoBanner}>
          <HugeiconsIcon icon={AlertCircleIcon} size={24} color={colors.backgroundDarker} />
          <Text style={styles.infoBannerText}>
            AdMob geliştirme derlemesi gerektirir. Özellik yakında!
          </Text>
        </View>

        {/* Ad Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoTitleContainer}>
            <HugeiconsIcon icon={BulbIcon} size={24} color={colors.textPrimary} />
            <Text style={styles.infoTitle}>Nasıl Çalışır?</Text>
          </View>
          <Text style={styles.infoText}>
            • Her reklam izlediğinde +{livesPerAd} can kazanırsın{'\n'}
            • Günde maksimum 3 reklam izleyebilirsin{'\n'}
            • Canların maksimuma ulaştığında reklam izleyemezsin{'\n'}
            • Reklam izlemeden de oyuna devam edebilirsin!
          </Text>
        </View>

        {/* Ad Slots */}
        <Text style={styles.sectionTitle}>Reklam Slotları</Text>
        
        {adSlots.map((slot) => (
          <View key={slot.id} style={styles.adCard}>
            <View style={styles.adCardIcon}>
              <HugeiconsIcon icon={Video01Icon} size={24} color={colors.textPrimary} />
            </View>
            <View style={styles.adCardInfo}>
              <Text style={styles.adCardTitle}>{slot.title}</Text>
              <Text style={styles.adCardDescription}>{slot.description}</Text>
            </View>
            <Pressable style={[styles.adButton, styles.adButtonDisabled]} disabled>
              <Text style={styles.adButtonText}>Yakında</Text>
            </Pressable>
          </View>
        ))}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: colors.backgroundDarker,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 32,
    marginBottom: 16,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: colors.warningDark,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.backgroundDarker,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
  },
  adCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adCardInfo: {
    flex: 1,
  },
  adCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  adCardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  adButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderBottomWidth: 3,
    borderBottomColor: colors.buttonOrangeBorder,
  },
  adButtonDisabled: {
    backgroundColor: colors.locked,
    borderBottomColor: colors.lockedBorder,
  },
  adButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
});
