import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

interface SignupModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const SignupModal: React.FC<SignupModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <Text style={styles.title}>Create your free Bytedata account</Text>
            <Text style={styles.description}>
              Save purchases, top up faster, and unlock rewards.
            </Text>
            
            <View style={styles.benefits}>
              <Text style={styles.benefit}>✓ Instant wallet top-ups</Text>
              <Text style={styles.benefit}>✓ Transaction history</Text>
              <Text style={styles.benefit}>✓ Exclusive discounts</Text>
              <Text style={styles.benefit}>✓ Referral rewards</Text>
            </View>
            
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => {
                  onClose();
                  router.push('/auth/signup');
                }}>
                <Text style={styles.createButtonText}>Create Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.laterButton} onPress={onClose}>
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  content: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  benefits: {
    marginBottom: 32,
  },
  benefit: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 8,
  },
  buttons: {
    gap: 12,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  laterButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  laterButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});