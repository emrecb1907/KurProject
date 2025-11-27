import { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@constants/colors';

const { width, height } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
  transparent?: boolean;
}

export function Modal({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  transparent = false,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        {Platform.OS === 'ios' && transparent ? (
          <BlurView intensity={80} tint="dark" style={styles.modalContainer}>
            <View style={styles.content}>
              {title && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  {showCloseButton && (
                    <Pressable onPress={onClose} style={styles.closeButton}>
                      <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              )}
              {children}
            </View>
          </BlurView>
        ) : (
          <View style={[styles.modalContainer, styles.solidBackground]}>
            <View style={styles.content}>
              {title && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  {showCloseButton && (
                    <Pressable onPress={onClose} style={styles.closeButton}>
                      <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              )}
              {children}
            </View>
          </View>
        )}
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backdrop: {
    position: 'absolute',
    width: width,
    height: height,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  solidBackground: {
    backgroundColor: colors.surface,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
});

