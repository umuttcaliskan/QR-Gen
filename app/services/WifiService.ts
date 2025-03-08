import { Platform, Alert } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

export const WifiService = {
  // Android için WiFi izinlerini kontrol et
  requestAndroidWifiPermissions: async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const { PermissionsAndroid } = require('react-native');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'WiFi bağlantısı için konum izni gerekli',
          message: 'Bu uygulama, WiFi ağlarını taramak ve bağlanmak için konum izni gerektirir.',
          buttonNegative: 'REDDET',
          buttonPositive: 'İZİN VER',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  },

  // WiFi ağına bağlanma fonksiyonu
  connectToWifi: async (ssid: string, password: string): Promise<void> => {
    try {
      // Android için konum izni kontrol et
      const hasPermission = await WifiService.requestAndroidWifiPermissions();
      if (!hasPermission && Platform.OS === 'android') {
        Alert.alert(
          'İzin Gerekli',
          'WiFi ağına bağlanmak için konum izni gereklidir.',
          [{ text: 'Tamam' }]
        );
        return;
      }
      
      // Wifi'ya bağlan
      await WifiManager.connectToProtectedSSID(ssid, password, false, false);
      Alert.alert(
        'Bağlantı Başarılı',
        `"${ssid}" ağına başarıyla bağlandınız.`,
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      console.error('WiFi bağlantı hatası:', error);
      let errorMessage = 'WiFi ağına bağlanırken bir hata oluştu.';
      
      // Hata kodlarına göre özel mesajlar
      if (error === 'locationPermissionMissing') {
        errorMessage = 'Konum izni eksik. WiFi ağlarını taramak için konum izni gereklidir.';
      } else if (error === 'locationServicesOff') {
        errorMessage = 'Konum servisleri kapalı. WiFi ağlarını taramak için konum servislerini açın.';
      } else if (error === 'couldNotEnableWifi') {
        errorMessage = 'WiFi açılamadı. Lütfen manuel olarak WiFi\'yı açın.';
      } else if (error === 'couldNotScan') {
        errorMessage = 'WiFi ağları taranamadı. Lütfen daha sonra tekrar deneyin.';
      } else if (error === 'didNotFindNetwork') {
        errorMessage = 'WiFi ağı bulunamadı. Lütfen ağın kapsama alanında olduğunuzdan emin olun.';
      } else if (error === 'authenticationErrorOccurred') {
        errorMessage = 'Kimlik doğrulama hatası. Şifre yanlış olabilir.';
      } else if (error === 'unableToConnect') {
        errorMessage = 'Ağa bağlanılamadı. Bilinmeyen bir hata oluştu.';
      }
      
      Alert.alert('Bağlantı Hatası', errorMessage, [{ text: 'Tamam' }]);
    }
  },

  // QR kod içindeki WiFi bilgilerini ayıklama
  parseWifiQRCode: (data: string): { ssid: string, password: string } => {
    const ssidMatch = data.match(/S:(.*?);/);
    const passwordMatch = data.match(/P:(.*?);/);
    
    return {
      ssid: ssidMatch?.[1] || '',
      password: passwordMatch?.[1] || ''
    };
  }
};

export default WifiService; 