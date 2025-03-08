import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, SafeAreaView, Modal, StatusBar } from 'react-native';
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

type QRType = 'text' | 'url' | 'phone' | 'email' | 'wifi' | 'barcode';

interface QROption {
  type: QRType;
  label: string;
  placeholder: string;
  keyboardType: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
}

const QR_OPTIONS: QROption[] = [
  { type: 'text', label: 'Metin', placeholder: 'Metin girin...', keyboardType: 'default' },
  { type: 'url', label: 'URL', placeholder: 'URL girin... (örn: google.com)', keyboardType: 'url' },
  { type: 'phone', label: 'Telefon', placeholder: 'Telefon numarası girin...', keyboardType: 'phone-pad' },
  { type: 'email', label: 'E-posta', placeholder: 'E-posta adresi girin...', keyboardType: 'email-address' },
  { type: 'wifi', label: 'WiFi', placeholder: 'WiFi şifresi girin...', keyboardType: 'default' },
  { type: 'barcode', label: 'Barkod', placeholder: 'Barkod numarası girin...', keyboardType: 'numeric' },
];

const HomeScreen = () => {
  const [selectedType, setSelectedType] = useState<QRType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [wifiName, setWifiName] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(200);
  
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
  
  // Artık kullanılmayan ama kod içinde referansları kaldırılmamış olabilecek değişkenler
  const [qrShape, setQrShape] = useState('square');
  const [qrStyle, setQrStyle] = useState('dots');
  const [qrEyeStyle, setQrEyeStyle] = useState('square');
  
  // Önceden tanımlanmış renk şemaları
  const COLOR_SCHEMES = [
    { name: 'Varsayılan', foreground: '#212529', background: 'white', gradient: ['#3B82F6', '#7048E8'] },
    { name: 'Klasik', foreground: 'black', background: 'white', gradient: ['black', '#333333'] },
    { name: 'Kırmızı', foreground: '#E53E3E', background: 'white', gradient: ['#E53E3E', '#C53030'] },
    { name: 'Yeşil', foreground: '#38A169', background: 'white', gradient: ['#38A169', '#2F855A'] },
    { name: 'Mavi', foreground: '#3182CE', background: 'white', gradient: ['#3182CE', '#2B6CB0'] },
    { name: 'Mor', foreground: '#805AD5', background: 'white', gradient: ['#805AD5', '#6B46C1'] },
    { name: 'Turuncu', foreground: '#DD6B20', background: 'white', gradient: ['#DD6B20', '#C05621'] },
    { name: 'Pembe', foreground: '#D53F8C', background: 'white', gradient: ['#D53F8C', '#B83280'] },
  ];
  
  // QR tarama için değişkenler
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);

  // QR kod referansı
  const qrCodeRef = useRef<ViewShot>(null);
  const barcodeRef = useRef<ViewShot>(null);

  // Kamera izinlerini kontrol et
  useEffect(() => {
    (async () => {
      if (scannerVisible) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
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

  // QR kodu tarama işlevi
  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScannerVisible(false);
    
    // Taranan QR kodun türünü belirle ve state'i güncelle
    if (data.startsWith('http')) {
      setSelectedType('url');
      setInputValue(data);
    } else if (data.startsWith('tel:')) {
      setSelectedType('phone');
      setInputValue(data.replace('tel:', ''));
    } else if (data.startsWith('mailto:')) {
      setSelectedType('email');
      setInputValue(data.replace('mailto:', ''));
    } else if (data.startsWith('WIFI:')) {
      setSelectedType('wifi');
      const ssidMatch = data.match(/S:(.*?);/);
      const passwordMatch = data.match(/P:(.*?);/);
      
      if (ssidMatch && ssidMatch[1]) setWifiName(ssidMatch[1]);
      if (passwordMatch && passwordMatch[1]) setInputValue(passwordMatch[1]);
    } else {
      setSelectedType('text');
      setInputValue(data);
    }
    
    // QR değerini doğrudan ayarla
    setQrValue(data);
  };

  // Galeri üzerinden QR kod tarama
  const pickImageAndScan = async () => {
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
      Alert.alert(
        'QR Kod Tarama',
        'Şu anda galeriden seçilen görsellerden QR tarama özelliği sınırlıdır. Lütfen QR kodu doğrudan kamera ile tarayın.',
        [{ text: 'Tamam' }]
      );
      // Not: Gerçek uygulamada galeriden seçilen resimden QR kodu taramak için
      // ek kütüphaneler veya özel bir çözüm gerekebilir.
    }
  };

  // QR tarama modalini aç
  const openScanner = () => {
    setScanned(false);
    setScannerVisible(true);
  };

  const handleTypeSelect = (type: QRType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(type);
    setInputValue('');
    setWifiName('');
    setQrValue('');
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
    let value = '';
    
    switch (selectedType) {
      case 'text':
        value = inputValue;
        break;
      case 'url':
        let url = inputValue;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        value = url;
        break;
      case 'phone':
        value = `tel:${inputValue}`;
        break;
      case 'email':
        value = `mailto:${inputValue}`;
        break;
      case 'wifi':
        value = `WIFI:S:${wifiName};T:WPA;P:${inputValue};;`;
        break;
      case 'barcode':
        value = inputValue; // Sayısal değeri doğrudan kullan
        break;
      default:
        break;
    }
    
    setQrValue(value);
    // QR kod boyutunu içeriğe göre optimize et ama minimum 200 piksel olsun
    setQrSize(Math.min(250, Math.max(200, 250 - value.length / 10))); 
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
        
        <TouchableOpacity 
          style={[
            styles.generateButton, 
            (!inputValue || (selectedType === 'wifi' && !wifiName)) ? styles.buttonDisabled : null
          ]} 
          onPress={generateQR}
          disabled={!inputValue || (selectedType === 'wifi' && !wifiName)}
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
          
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>QR Kod Türü Seçin</Text>
            <View style={styles.optionsGrid}>
              {QR_OPTIONS.map((option) => (
                <TouchableOpacity 
                  key={option.type}
                  style={[
                    styles.optionButton, 
                    selectedType === option.type && styles.selectedOption
                  ]} 
                  onPress={() => handleTypeSelect(option.type)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedType === option.type && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {renderInputField()}
          
          {qrValue ? (
            <View style={styles.qrContainer}>
              {selectedType === 'barcode' ? (
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.barcodeCaption}>Barkod</Text>
                  <ViewShot ref={barcodeRef} options={{ format: 'png', quality: 1 }}>
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
                    <ViewShot ref={qrCodeRef} options={{ format: 'png', quality: 1 }}>
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
                  
                  {/* Renk Seçenekleri */}
                  <View style={{ width: '100%', marginBottom: 15 }}>
                    <Text style={styles.sectionTitle}>Renk Seçenekleri</Text>
                    
                    {/* Gradyan Açma/Kapama */}
                    <TouchableOpacity 
                      style={[styles.gradientToggle, useGradient ? styles.gradientActive : {}]}
                      onPress={toggleGradient}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons 
                          name={useGradient ? "color-fill" : "color-fill-outline"} 
                          size={20} 
                          color={useGradient ? "white" : "#495057"} 
                          style={{ marginRight: 8 }} 
                        />
                        <Text style={[styles.gradientToggleText, useGradient ? styles.gradientActiveText : {}]}>
                          {useGradient ? 'Gradyan Açık' : 'Gradyan Kapalı'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    {/* Renk Şemaları */}
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={{ marginTop: 15 }}
                      contentContainerStyle={{ paddingHorizontal: 5 }}
                    >
                      {COLOR_SCHEMES.map((scheme, index) => (
                        <TouchableOpacity
                          key={scheme.name}
                          style={[
                            styles.colorSchemeButton,
                            {
                              borderColor: 
                                qrForegroundColor === scheme.foreground && 
                                gradientColors[0] === scheme.gradient[0] ? 
                                '#3B82F6' : 'transparent'
                            }
                          ]}
                          onPress={() => handleColorSchemeSelect(index)}
                        >
                          <View style={[
                            styles.colorPreview, 
                            { 
                              backgroundColor: scheme.gradient[0],
                              borderWidth: 1,
                              borderColor: '#E9ECEF'
                            },
                            useGradient && {
                              backgroundColor: 'white',
                              overflow: 'hidden'
                            }
                          ]}>
                            {useGradient && (
                              <View style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundColor: scheme.gradient[0],
                                transform: [{ rotate: '45deg' }],
                                width: '200%',
                                height: '200%',
                                marginLeft: -20,
                                marginTop: -20,
                              }} />
                            )}
                            {useGradient && (
                              <View style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundColor: scheme.gradient[1],
                                transform: [{ rotate: '-45deg' }],
                                width: '200%',
                                height: '200%',
                                marginLeft: -20,
                                marginTop: -20,
                                opacity: 0.8
                              }} />
                            )}
                          </View>
                          <Text style={styles.colorSchemeName}>{scheme.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  
                  {/* Tasarım Seçenekleri */}
                  <View style={{ width: '100%', marginBottom: 15 }}>
                    <Text style={styles.sectionTitle}>Tasarım Seçenekleri</Text>
                    
                    {/* Logo Ekleme */}
                    <TouchableOpacity 
                      style={[styles.designOption, logoEnabled ? styles.designOptionActive : {}]}
                      onPress={logoUri ? toggleLogo : pickLogo}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons 
                          name={logoEnabled ? "image" : "image-outline"} 
                          size={20} 
                          color={logoEnabled ? "white" : "#495057"} 
                          style={{ marginRight: 8 }} 
                        />
                        <Text style={[
                          styles.designOptionText, 
                          logoEnabled ? styles.designOptionActiveText : {}
                        ]}>
                          {logoUri ? (logoEnabled ? 'Logo Açık' : 'Logo Kapalı') : 'Logo Ekle'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    {/* QR Kod Kenar Boşluğu */}
                    <View style={{ marginTop: 15 }}>
                      <Text style={styles.optionLabel}>Kenar Boşluğu</Text>
                      <View style={styles.designOptionsRow}>
                        {[5, 10, 15, 20].map((margin) => (
                          <TouchableOpacity 
                            key={`margin-${margin}`}
                            style={[
                              styles.designOptionButton, 
                              qrMargin === margin ? styles.designOptionButtonActive : {}
                            ]}
                            onPress={() => changeQrMargin(margin)}
                          >
                            <View style={{
                              width: 24,
                              height: 24,
                              borderWidth: margin === 5 ? 1 : margin === 10 ? 2 : margin === 15 ? 3 : 4,
                              borderColor: qrMargin === margin ? "#3B82F6" : "#ADB5BD",
                              backgroundColor: 'white',
                            }} />
                            <Text style={styles.designOptionButtonText}>{margin}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    
                    {/* QR Kod Hata Düzeltme Seviyesi */}
                    <View style={{ marginTop: 15 }}>
                      <Text style={styles.optionLabel}>Hata Düzeltme</Text>
                      <View style={styles.designOptionsRow}>
                        {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                          <TouchableOpacity 
                            key={`level-${level}`}
                            style={[
                              styles.designOptionButton, 
                              qrErrorLevel === level ? styles.designOptionButtonActive : {}
                            ]}
                            onPress={() => changeQrErrorLevel(level)}
                          >
                            <Ionicons 
                              name={
                                level === 'L' ? "shield-outline" : 
                                level === 'M' ? "shield-half-outline" : 
                                level === 'Q' ? "shield" : "shield-checkmark"
                              } 
                              size={24} 
                              color={qrErrorLevel === level ? "#3B82F6" : "#ADB5BD"} 
                            />
                            <Text style={styles.designOptionButtonText}>
                              {level === 'L' ? 'Düşük' : 
                               level === 'M' ? 'Orta' : 
                               level === 'Q' ? 'Yüksek' : 'En Yüksek'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
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
                onPress={shareQRCode}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="share-outline" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.downloadButtonText}>İndir / Paylaş</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          
          {/* QR Kod Tarama Modalı */}
          <Modal
            visible={scannerVisible}
            animationType="slide"
            onRequestClose={() => setScannerVisible(false)}
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
                  onPress={() => setScannerVisible(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.galleryButton]} 
                  onPress={pickImageAndScan}
                >
                  <Text style={styles.modalButtonText}>Galeriden Seç</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>
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
});

export default HomeScreen;
