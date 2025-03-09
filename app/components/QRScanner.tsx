import { View, Text, Modal, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { StyleSheet } from 'react-native';

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onCodeScanned: (type: string, data: string) => void;
  onImagePick: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ visible, onClose, onCodeScanned, onImagePick }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  // Kamera izinlerini kontrol et
  useEffect(() => {
    (async () => {
      if (visible) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          Alert.alert(
            'İzin Gerekli',
            'QR kod taramak için kamera izni gereklidir.',
            [{ text: 'Tamam', onPress: onClose }]
          );
        }
        // Tarayıcı her açıldığında scanned durumunu sıfırla
        setScanned(false);
      }
    })();
  }, [visible, onClose]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCodeScanned(result.type, result.data);
  };

  // Tarayıcı kapatıldığında yapılacak işlemler
  const handleClose = () => {
    setScanned(false); // scanned durumunu sıfırla
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar
          backgroundColor="black" 
          barStyle="light-content"
          translucent={true}
        />
        {hasPermission === null ? (
          <Text style={styles.modalText}>Kamera izni isteniyor...</Text>
        ) : hasPermission === false ? (
          <Text style={styles.modalText}>Kamera erişimi bulunmuyor.</Text>
        ) : (
          <View style={styles.cameraContainer}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            <View style={styles.scanOverlay}>
              <View style={styles.scanFrame} />
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                marginTop: 30,
                textAlign: 'center',
                width: '80%',
              }}>
                QR kodu çerçeve içine yerleştirin
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={styles.modalButton} 
            onPress={handleClose}
          >
            <Text style={styles.modalButtonText}>İptal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalButton, styles.galleryButton]} 
            onPress={onImagePick}
          >
            <Text style={styles.modalButtonText}>Galeriden Seç</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default QRScanner; 