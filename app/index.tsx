import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, SafeAreaView, Modal, StatusBar, Image, Linking } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Barcode from './components/Barcode';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import WifiManager from 'react-native-wifi-reborn';

// Services
import WifiService from './services/WifiService';
import QRCodeService from './services/QRCodeService';

// Types
import { QRType, COLOR_SCHEMES, QR_OPTIONS } from './types';

// Components
import QRTypeSelector from './components/QRTypeSelector';
import QRInputForm from './components/QRInputForm';
import QRVisualizer from './components/QRVisualizer';
import QRStyleOptions from './components/QRStyleOptions';
import QRScanner from './components/QRScanner';
import ImageScanner from './components/ImageScanner';

const HomeScreen = () => {
  const [selectedType, setSelectedType] = useState<QRType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [wifiName, setWifiName] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(200);
  
  // Daha fazla seçeneklerin görünürlüğü için state
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  // QR renk seçenekleri için state değişkenleri
  const [qrForegroundColor, setQrForegroundColor] = useState('#212529');
  const [qrBackgroundColor, setQrBackgroundColor] = useState('white');
  const [useGradient, setUseGradient] = useState(true);
  const [gradientColors, setGradientColors] = useState(['#3B82F6', '#7048E8']);
  
  // QR kod tasarım seçenekleri için state değişkenleri
  const [logoEnabled, setLogoEnabled] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [qrMargin, setQrMargin] = useState(10); // QR kod kenar boşluğu
  const [qrErrorLevel, setQrErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M'); // Hata düzeltme seviyesi
  
  // QR tarama için değişkenler
  const [scannerVisible, setScannerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageScanner, setShowImageScanner] = useState(false);

  // QR kod referansı
  const qrCodeRef = useRef<ViewShot>(null);
  const barcodeRef = useRef<ViewShot>(null);

  // Kişi kartı için yeni state değişkenleri
  const [contactName, setContactName] = useState('');
  const [contactSurname, setContactSurname] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  // SMS için mesaj içeriği
  const [smsMessage, setSmsMessage] = useState('');

  // Kamera izinlerini kontrol et
  useEffect(() => {
    (async () => {
      if (scannerVisible) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'İzin Gerekli',
            'QR kod taramak için kamera izni gereklidir.',
            [{ text: 'Tamam', onPress: () => setScannerVisible(false) }]
          );
        }
      }
    })();
  }, [scannerVisible]);

  // Android için WiFi izinlerini kontrol et
  const requestAndroidWifiPermissions = async () => {
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
  };

  // QR kodu tarama işlevi
  const handleBarCodeScanned = (type: string, data: string) => {
    // Taranan QR kodun türünü belirle ve state'i güncelle
    if (data.startsWith('http')) {
      setSelectedType('url');
      setInputValue(data);
      // URL'ye otomatik yönlendirme
      Linking.canOpenURL(data).then(supported => {
        if (supported) {
          Linking.openURL(data);
        }
      });
    } else if (data.startsWith('tel:')) {
      setSelectedType('phone');
      setInputValue(data.replace('tel:', ''));
      // Telefon numarasını arama ekranına yönlendirme
      Linking.openURL(data);
    } else if (data.startsWith('mailto:')) {
      setSelectedType('email');
      setInputValue(data.replace('mailto:', ''));
      // E-posta uygulamasına yönlendirme
      Linking.openURL(data);
    } else if (data.startsWith('WIFI:')) {
      setSelectedType('wifi');
      const { ssid, password } = WifiService.parseWifiQRCode(data);
      
      if (ssid) setWifiName(ssid);
      if (password) setInputValue(password);

      // WiFi ağına otomatik bağlanmayı dene
      if (ssid) {
        Alert.alert(
          'WiFi Bağlantısı',
          `"${ssid}" ağına bağlanmak istiyor musunuz?`,
          [
            { text: 'İptal' },
            { 
              text: 'Bağlan', 
              onPress: () => WifiService.connectToWifi(ssid, password)
            }
          ]
        );
      } else {
        Alert.alert(
          'WiFi Bilgileri Bulundu',
          `Geçerli WiFi bilgileri bulunamadı.`,
          [{ text: 'Tamam' }]
        );
      }
    } else {
      setSelectedType('text');
      setInputValue(data);
    }
    
    // QR değerini doğrudan ayarla
    setQrValue(data);
    
    // Başarı bildirimi (otomatik yönlendirme yapıldığı için alert'i sadece text türünde gösterelim)
    if (
      !data.startsWith('http') && 
      !data.startsWith('tel:') && 
      !data.startsWith('mailto:') &&
      !data.startsWith('WIFI:')
    ) {
      Alert.alert(
        'QR Kod Bulundu',
        'Görsel içerisindeki QR kod başarıyla tarandı.',
        [{ text: 'Tamam' }]
      );
    }
  };

  // Galeri üzerinden QR kod tarama
  const pickImageAndScan = async () => {
    try {
      // Galeri izni iste
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriden resim seçmek için izin gereklidir.');
        return;
      }
      
      // Resim seçme
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        try {
          // Seçilen görseli işle
          const selectedAsset = result.assets[0];
          
          // Görüntüyü daha iyi işlemek için manipüle et (opsiyonel)
          const manipResult = await ImageManipulator.manipulateAsync(
            selectedAsset.uri,
            [], // herhangi bir dönüşüm uygulamıyoruz
            { compress: 0.8 } // hafif bir sıkıştırma
          );
          
          // Seçilen görseli state'e kaydet
          setSelectedImage(manipResult.uri);
          
          // Kamera tarama ekranını kapat (eğer açıksa)
          setScannerVisible(false);
          
          // Görsel tarama ekranını göster
          setShowImageScanner(true);
          
          // Kullanıcıya bilgi ver
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
        } catch (error) {
          console.error('Görsel işleme hatası:', error);
          Alert.alert(
            'Görsel İşleme Hatası',
            'Seçilen görsel işlenirken bir hata oluştu. Lütfen farklı bir görsel deneyin.',
            [{ text: 'Tamam' }]
          );
        }
      }
    } catch (error) {
      console.error('Görsel seçme hatası:', error);
      Alert.alert(
        'Görsel Seçme Hatası',
        'Galeriden görsel seçerken bir hata oluştu.',
        [{ text: 'Tamam' }]
      );
    }
  };

  // QR tarama modalini aç
  const openScanner = () => {
    setScannerVisible(true);
  };

  const handleTypeSelect = (type: QRType) => {
    setSelectedType(type);
    setInputValue('');
    setQrValue('');
    setWifiName('');
    // Kişi kartı alanlarını temizle
    setContactName('');
    setContactSurname('');
    setContactPhone('');
    setContactEmail('');
    setContactTitle('');
    setContactCompany('');
    // SMS mesaj içeriğini temizle
    setSmsMessage('');
    // Daha fazla seçenekleri kapat
    setShowMoreOptions(false);
  };

  // Renk şeması seçme fonksiyonu
  const handleColorSchemeSelect = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const scheme = COLOR_SCHEMES[index];
    setQrForegroundColor(scheme.foreground);
    setQrBackgroundColor(scheme.background);
    setGradientColors(scheme.gradient);
    setUseGradient(true);
  };

  // Gradyan kullanımını değiştirme
  const toggleGradient = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUseGradient(!useGradient);
  };

  // QR kod kenar boşluğunu değiştirme
  const changeQrMargin = (margin: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQrMargin(margin);
  };

  // QR kod hata düzeltme seviyesini değiştirme
  const changeQrErrorLevel = (level: 'L' | 'M' | 'Q' | 'H') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQrErrorLevel(level);
  };

  // Logo kullanımını değiştirme
  const toggleLogo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (logoEnabled && !logoUri) {
      pickLogo();
    } else {
      setLogoEnabled(!logoEnabled);
    }
  };

  // Galeriden logo seçme
  const pickLogo = async () => {
    try {
      // Galeri izni iste
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriden resim seçmek için izin gereklidir.');
        return;
      }
      
      // Resim seçme
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLogoUri(result.assets[0].uri);
        setLogoEnabled(true);
      }
    } catch (error) {
      console.error('Logo seçimi sırasında hata:', error);
      Alert.alert('Hata', 'Logo seçilirken bir sorun oluştu.');
    }
  };

  const generateQR = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!selectedType) return;
    
    const contactInfo = {
      name: contactName,
      surname: contactSurname,
      phone: contactPhone,
      email: contactEmail,
      title: contactTitle,
      company: contactCompany
    };
    
    const value = QRCodeService.generateQRValue(
      selectedType,
      inputValue,
      wifiName,
      contactInfo,
      smsMessage
    );
    
    setQrValue(value);
    setQrSize(QRCodeService.calculateQRSize(value));
  };

  const renderInputField = () => {
    if (!selectedType) return null;

    const selectedOption = QR_OPTIONS.find(option => option.type === selectedType);
    if (!selectedOption) return null;

    return (
      <View style={styles.inputContainer}>
        {selectedType === 'wifi' && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: '#E9ECEF',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 12,
              color: '#6C757D',
              marginBottom: 4,
              fontWeight: '500',
            }}>WiFi Ağ Adı</Text>
            <TextInput
              style={{
                fontSize: 16,
                color: '#212529',
                paddingVertical: 8,
              }}
              placeholder="WiFi ağ adını girin..."
              value={wifiName}
              onChangeText={setWifiName}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}
        
        {selectedType === 'contact' ? (
          <View>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>Ad</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="Ad girin..."
                value={contactName}
                onChangeText={setContactName}
                autoCorrect={false}
              />
            </View>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>Soyad</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="Soyad girin..."
                value={contactSurname}
                onChangeText={setContactSurname}
                autoCorrect={false}
              />
            </View>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>Telefon</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="Telefon numarası girin..."
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>E-posta</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="E-posta adresi girin..."
                value={contactEmail}
                onChangeText={setContactEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>Unvan</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="Unvan girin (opsiyonel)..."
                value={contactTitle}
                onChangeText={setContactTitle}
                autoCorrect={false}
              />
            </View>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>Şirket</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="Şirket adı girin (opsiyonel)..."
                value={contactCompany}
                onChangeText={setContactCompany}
                autoCorrect={false}
              />
            </View>
          </View>
        ) : selectedType === 'sms' ? (
          <View>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>Telefon Numarası</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="Telefon numarası girin..."
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#6C757D',
                marginBottom: 4,
                fontWeight: '500',
              }}>Mesaj İçeriği</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: '#212529',
                  paddingVertical: 8,
                }}
                placeholder="Mesaj içeriği girin (opsiyonel)..."
                value={smsMessage}
                onChangeText={setSmsMessage}
                multiline={true}
                numberOfLines={3}
                autoCorrect={false}
              />
            </View>
          </View>
        ) : (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: '#E9ECEF',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 12,
              color: '#6C757D',
              marginBottom: 4,
              fontWeight: '500',
            }}>{selectedOption.label}</Text>
            <TextInput
              style={{
                fontSize: 16,
                color: '#212529',
                paddingVertical: 8,
              }}
              placeholder={selectedOption.placeholder}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={selectedOption.keyboardType}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={selectedType === 'wifi'}
            />
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.generateButton, 
            (!inputValue && selectedType !== 'contact' && selectedType !== 'sms') || 
            (selectedType === 'wifi' && !wifiName) || 
            (selectedType === 'contact' && (!contactName || !contactSurname)) ||
            (selectedType === 'sms' && !inputValue)
              ? styles.buttonDisabled 
              : null
          ]} 
          onPress={generateQR}
          disabled={
            (!inputValue && selectedType !== 'contact' && selectedType !== 'sms') || 
            (selectedType === 'wifi' && !wifiName) || 
            (selectedType === 'contact' && (!contactName || !contactSurname)) ||
            (selectedType === 'sms' && !inputValue)
          }
        >
          <Text style={styles.buttonText}>QR Oluştur</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // QR kodu paylaşma fonksiyonu
  const shareQRCode = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      // İşlem türüne göre referansı belirle
      const ref = selectedType === 'barcode' ? barcodeRef : qrCodeRef;
      
      if (ref.current && typeof ref.current.capture === 'function') {
        // QR kodu resim olarak kaydet
        const uri = await ref.current.capture();
        
        // Dosya paylaşılabilir mi kontrol et
        const canShare = await Sharing.isAvailableAsync();
        
        if (canShare) {
          // Dosyayı paylaş
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'QR Kodunu Paylaş',
            UTI: 'public.png'
          });
        } else {
          Alert.alert('Hata', 'Dosya paylaşımı bu cihazda desteklenmiyor.');
        }
      } else {
        Alert.alert('Hata', 'QR kod referansı bulunamadı.');
      }
    } catch (error) {
      console.error('QR kod paylaşımı sırasında hata oluştu:', error);
      Alert.alert('Hata', 'QR kod paylaşılırken bir sorun oluştu.');
    }
  };

  // Seçilen görsel üzerindeki QR kodu manüel olarak tara
  const scanSelectedImage = () => {
    if (!selectedImage) return;
    
    // Manüel tarama işlemi (kullanıcıya alternatif yöntemler sunulur)
    Alert.alert(
      'QR Kodu Tara',
      'Görselinizdeki QR kodu taramak için lütfen bir cihazda gösterin ve kamera ile tarayın veya URL/bilgiyi manuel olarak girin.',
      [
        { 
          text: 'İptal', 
          style: 'cancel',
          onPress: () => {
            setSelectedImage(null);
            setShowImageScanner(false);
          }
        },
        {
          text: 'Kamera ile Tara',
          onPress: () => {
            // Görsel tarayıcıyı kapat, kamera tarayıcıyı aç
            setSelectedImage(null);
            setShowImageScanner(false);
            setScannerVisible(true);
          }
        }
      ]
    );
  };
  
  // Görsel tarayıcıyı kapat
  const closeImageScanner = () => {
    setSelectedImage(null);
    setShowImageScanner(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
        translucent={false}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginVertical: 24
          }}>
            <Ionicons name="qr-code" size={36} color="#3B82F6" style={{ marginRight: 10 }} />
            <Text style={styles.title}>QR-Gen</Text>
          </View>
          
          {/* QR Kod Tara Butonu */}
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={openScanner}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="qr-code-outline" size={22} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.scanButtonText}>QR Kod Tara</Text>
            </View>
          </TouchableOpacity>
          
          {/* QR Kod Türü Seçimi */}
          <QRTypeSelector 
            selectedType={selectedType} 
            onTypeSelect={handleTypeSelect} 
          />
          
          {/* QR Kod İçerik Formu */}
          <QRInputForm
            selectedType={selectedType}
            inputValue={inputValue}
            setInputValue={setInputValue}
            wifiName={wifiName}
            setWifiName={setWifiName}
            contactName={contactName}
            setContactName={setContactName}
            contactSurname={contactSurname}
            setContactSurname={setContactSurname}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            contactTitle={contactTitle}
            setContactTitle={setContactTitle}
            contactCompany={contactCompany}
            setContactCompany={setContactCompany}
            smsMessage={smsMessage}
            setSmsMessage={setSmsMessage}
            generateQR={generateQR}
          />
          
          {/* QR Kod Gösterimi */}
          {qrValue && (
            <>
              <QRVisualizer
                ref={selectedType === 'barcode' ? barcodeRef : qrCodeRef}
                selectedType={selectedType}
                qrValue={qrValue}
                qrSize={qrSize}
                qrBackgroundColor={qrBackgroundColor}
                qrForegroundColor={qrForegroundColor}
                qrMargin={qrMargin}
                useGradient={useGradient}
                gradientColors={gradientColors}
                logoEnabled={logoEnabled}
                logoUri={logoUri}
                qrErrorLevel={qrErrorLevel}
                wifiName={wifiName}
                onShare={shareQRCode}
              />
              
              {/* QR Kod Stil Seçenekleri (Barkod türü seçili değilse) */}
              {selectedType !== 'barcode' && (
                <QRStyleOptions
                  useGradient={useGradient}
                  toggleGradient={toggleGradient}
                  qrForegroundColor={qrForegroundColor}
                  gradientColors={gradientColors}
                  onColorSchemeSelect={handleColorSchemeSelect}
                  qrMargin={qrMargin}
                  changeQrMargin={changeQrMargin}
                  qrErrorLevel={qrErrorLevel}
                  changeQrErrorLevel={changeQrErrorLevel}
                  logoEnabled={logoEnabled}
                  toggleLogo={toggleLogo}
                  logoUri={logoUri}
                  pickLogo={pickLogo}
                />
              )}
            </>
          )}
          
          {/* QR Kod Tarama Modalı */}
          <QRScanner
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            onCodeScanned={handleBarCodeScanned}
            onImagePick={pickImageAndScan}
          />
          
          {/* Galeriden Seçilen Görsel QR Tarama Modalı */}
          <ImageScanner
            visible={showImageScanner}
            onClose={closeImageScanner}
            onScan={scanSelectedImage}
            selectedImage={selectedImage}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 24,
    color: '#212529',
    letterSpacing: 0.5,
  },
  // QR Kod Tara Butonu Stilleri
  scanButton: {
    width: '100%',
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#212529',
    letterSpacing: 0.3,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  selectedOptionText: {
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  generateButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ADB5BD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 16,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  qrInfo: {
    marginTop: 16,
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },
  // Kamera ve Modal Stilleri
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#343A40',
    margin: 8,
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#3B82F6',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    padding: 24,
    fontWeight: '600',
  },
  barcodeCaption: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#495057',
  },
  downloadButton: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  gradientToggle: {
    backgroundColor: '#E9ECEF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientActive: {
    backgroundColor: '#3B82F6',
  },
  gradientToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  gradientActiveText: {
    color: '#fff',
  },
  colorSchemeButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 100,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  colorSchemeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  designOption: {
    backgroundColor: '#E9ECEF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  designOptionActive: {
    backgroundColor: '#3B82F6',
  },
  designOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  designOptionActiveText: {
    color: '#fff',
  },
  designOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  designOptionButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#fff',
    flex: 1,
  },
  designOptionButtonActive: {
    borderColor: '#3B82F6',
  },
  designOptionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginTop: 4,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    justifyContent: 'space-between',
  },
  imageModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '90%',
    height: '70%',
    borderRadius: 8,
  },
  imageInstructions: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
  },
  imageModalButtons: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
