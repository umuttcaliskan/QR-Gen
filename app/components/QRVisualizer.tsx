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

  // QR tipi için başlık oluşturma
  const getQRTitle = () => {
    switch (selectedType) {
      case 'text': return 'Metin QR Kodu';
      case 'url': return 'URL QR Kodu';
      case 'phone': return 'Telefon QR Kodu';
      case 'email': return 'E-posta QR Kodu';
      case 'wifi': return `WiFi: ${wifiName}`;
      case 'barcode': return 'Barkod';
      case 'location': return 'Konum QR Kodu';
      case 'sms': return 'SMS QR Kodu';
      case 'youtube': return 'YouTube QR Kodu';
      case 'instagram': return 'Instagram QR Kodu';
      case 'twitter': return 'Twitter QR Kodu';
      case 'contact': return 'Kişi Kartı QR Kodu';
      case 'paypal': return 'PayPal QR Kodu';
      case 'spotify': return 'Spotify QR Kodu';
      default: return 'QR Kodu';
    }
  };

  // QR tipi için ikon seçimi
  const getQRIcon = () => {
    switch (selectedType) {
      case 'text': return 'text';
      case 'url': return 'link';
      case 'phone': return 'call';
      case 'email': return 'mail';
      case 'wifi': return 'wifi';
      case 'barcode': return 'barcode';
      case 'location': return 'location';
      case 'sms': return 'chatbubble';
      case 'youtube': return 'logo-youtube';
      case 'instagram': return 'logo-instagram';
      case 'twitter': return 'logo-twitter';
      case 'contact': return 'person';
      case 'paypal': return 'logo-paypal';
      case 'spotify': return 'musical-notes';
      default: return 'qr-code';
    }
  };

  return (
    <View style={styles.qrVisualizerContainer}>
      {/* QR Kod Başlığı */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        alignSelf: 'stretch'
      }}>
        <View style={{
          backgroundColor: '#EEF2FF',
          padding: 10,
          borderRadius: 12,
          marginRight: 12
        }}>
          <Ionicons name={getQRIcon()} size={20} color="#4F46E5" />
        </View>
        <Text style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#1E293B'
        }}>
          {getQRTitle()}
        </Text>
      </View>

      {selectedType === 'barcode' ? (
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <ViewShot ref={ref as React.RefObject<ViewShot>} options={{ format: 'png', quality: 1 }}>
            <View style={{
              padding: 24,
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3
            }}>
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
            </View>
          </ViewShot>
        </View>
      ) : (
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <ViewShot ref={ref as React.RefObject<ViewShot>} options={{ format: 'png', quality: 1 }}>
            <View style={{ 
              padding: 24, 
              backgroundColor: 'white',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4
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
      )}
      
      {/* QR Kod Açıklaması */}
      <Text style={{
        fontSize: 14,
        color: '#64748B',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 20
      }}>
        Bu QR kodunu taratarak içerdiği bilgilere doğrudan erişebilirsiniz.
      </Text>
      
      {/* İndirme ve Paylaşma Butonu */}
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onShare();
        }}
      >
        <Ionicons name="share-outline" size={20} color="white" />
        <Text style={styles.downloadButtonText}>İndir / Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
});

export default QRVisualizer; 