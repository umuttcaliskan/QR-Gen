import { View, Text, TouchableOpacity } from 'react-native';
import React, { forwardRef } from 'react';
import { styles } from '../styles';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Barcode from './Barcode';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QRType } from '../types';

interface QRVisualizerProps {
  selectedType: QRType | null;
  qrValue: string;
  qrSize: number;
  qrBackgroundColor: string;
  qrForegroundColor: string;
  qrMargin: number;
  useGradient: boolean;
  gradientColors: string[];
  logoEnabled: boolean;
  logoUri: string | null;
  qrErrorLevel: 'L' | 'M' | 'Q' | 'H';
  wifiName: string;
  onShare: () => void;
}

type QRVisualizerRefType = ViewShot;

const QRVisualizer = forwardRef<QRVisualizerRefType, QRVisualizerProps>(({
  selectedType,
  qrValue,
  qrSize,
  qrBackgroundColor,
  qrForegroundColor,
  qrMargin,
  useGradient,
  gradientColors,
  logoEnabled,
  logoUri,
  qrErrorLevel,
  wifiName,
  onShare
}, ref) => {
  if (!qrValue) return null;

  return (
    <View style={styles.qrContainer}>
      {selectedType === 'barcode' ? (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.barcodeCaption}>Barkod</Text>
          <ViewShot ref={ref as React.RefObject<ViewShot>} options={{ format: 'png', quality: 1 }}>
            <Barcode
              value={qrValue}
              format="CODE128"
              width={280}
              height={100}
              background="white"
              lineColor="black"
              margin={20}
              fontSize={14}
            />
          </ViewShot>
        </View>
      ) : (
        <>
          <View style={{ marginBottom: 15, alignItems: 'center', justifyContent: 'center' }}>
            <ViewShot ref={ref as React.RefObject<ViewShot>} options={{ format: 'png', quality: 1 }}>
              <View style={{ 
                padding: 20, 
                backgroundColor: 'white',
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2
              }}>
                <QRCode
                  value={qrValue}
                  size={qrSize}
                  backgroundColor={qrBackgroundColor}
                  color={qrForegroundColor}
                  quietZone={qrMargin}
                  enableLinearGradient={useGradient}
                  linearGradient={gradientColors}
                  logo={logoEnabled && logoUri ? { uri: logoUri } : undefined}
                  logoSize={logoEnabled && logoUri ? qrSize * 0.2 : 0}
                  logoBackgroundColor="white"
                  logoMargin={5}
                  logoBorderRadius={10}
                  ecl={qrErrorLevel}
                />
              </View>
            </ViewShot>
          </View>
        </>
      )}
      <Text style={styles.qrInfo}>
        {selectedType === 'wifi' 
          ? `WiFi: ${wifiName}`
          : selectedType === 'barcode'
          ? 'Barkod'
          : `${selectedType?.toUpperCase()} QR Kodu`}
      </Text>
      
      {/* İndirme Butonu */}
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onShare();
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="share-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.downloadButtonText}>İndir / Paylaş</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

export default QRVisualizer; 