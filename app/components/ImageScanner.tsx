import { View, Text, Modal, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import React from 'react';
import { styles } from '../styles';

interface ImageScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: () => void;
  selectedImage: string | null;
}

const ImageScanner: React.FC<ImageScannerProps> = ({ visible, onClose, onScan, selectedImage }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar
          backgroundColor="black" 
          barStyle="light-content"
          translucent={true}
        />
        <View style={styles.imageModalContainer}>
          <Text style={styles.imageModalTitle}>Galeriden QR Kod Tarama</Text>
          
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.selectedImage} 
                resizeMode="contain"
              />
              <Text style={styles.imageInstructions}>
                QR kodun bulunduğu görsel seçildi. Bu görseli taramak için "Kamera ile Tara" butonuna basın.
              </Text>
            </View>
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>Görsel seçilmedi</Text>
            </View>
          )}
          
          <View style={styles.imageModalButtons}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>İptal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: '#3B82F6' }]} 
              onPress={onScan}
            >
              <Text style={styles.modalButtonText}>Kamera ile Tara</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ImageScanner; 