import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../styles';
import { QRType, QR_OPTIONS } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface QRInputFormProps {
  selectedType: QRType | null;
  inputValue: string;
  setInputValue: (value: string) => void;
  wifiName: string;
  setWifiName: (value: string) => void;
  contactName: string;
  setContactName: (value: string) => void;
  contactSurname: string;
  setContactSurname: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactTitle: string;
  setContactTitle: (value: string) => void;
  contactCompany: string;
  setContactCompany: (value: string) => void;
  smsMessage: string;
  setSmsMessage: (value: string) => void;
  generateQR: () => void;
}

const QRInputForm: React.FC<QRInputFormProps> = ({
  selectedType,
  inputValue,
  setInputValue,
  wifiName,
  setWifiName,
  contactName,
  setContactName,
  contactSurname,
  setContactSurname,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  contactTitle,
  setContactTitle,
  contactCompany,
  setContactCompany,
  smsMessage,
  setSmsMessage,
  generateQR
}) => {
  if (!selectedType) return null;

  const selectedOption = QR_OPTIONS.find(option => option.type === selectedType);
  if (!selectedOption) return null;

  const isFormValid = () => {
    if (selectedType === 'wifi' && !wifiName) return false;
    if (selectedType === 'contact' && (!contactName || !contactSurname)) return false;
    if (selectedType === 'sms' && !inputValue) return false;
    if (selectedType !== 'contact' && selectedType !== 'sms' && !inputValue) return false;
    return true;
  };

  // Seçilen tür için ikon seçimi
  const getIconForType = () => {
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
      default: return 'information-circle';
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.sectionTitle}>{selectedOption.label} QR Kodu Oluştur</Text>
      <Text style={styles.sectionSubtitle}>
        Aşağıdaki bilgileri doldurarak {selectedOption.label.toLowerCase()} QR kodunuzu oluşturabilirsiniz.
      </Text>

      {selectedType === 'wifi' && (
        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>WiFi Ağ Adı</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="wifi" size={18} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.inputText}
              placeholder="WiFi ağ adını girin..."
              value={wifiName}
              onChangeText={setWifiName}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
      )}
      
      {selectedType === 'contact' ? (
        <View>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Ad</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.inputText}
                placeholder="Ad girin..."
                value={contactName}
                onChangeText={setContactName}
                autoCorrect={false}
              />
            </View>
          </View>
          
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Soyad</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.inputText}
                placeholder="Soyad girin..."
                value={contactSurname}
                onChangeText={setContactSurname}
                autoCorrect={false}
              />
            </View>
          </View>
          
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Telefon</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.inputText}
                placeholder="Telefon numarası girin..."
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
          </View>
          
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>E-posta</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.inputText}
                placeholder="E-posta adresi girin..."
                value={contactEmail}
                onChangeText={setContactEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
          
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Unvan</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="briefcase" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.inputText}
                placeholder="Unvan girin (opsiyonel)..."
                value={contactTitle}
                onChangeText={setContactTitle}
                autoCorrect={false}
              />
            </View>
          </View>
          
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Şirket</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.inputText}
                placeholder="Şirket adı girin (opsiyonel)..."
                value={contactCompany}
                onChangeText={setContactCompany}
                autoCorrect={false}
              />
            </View>
          </View>
        </View>
      ) : selectedType === 'sms' ? (
        <View>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Telefon Numarası</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.inputText}
                placeholder="Telefon numarası girin..."
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
          </View>
          
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Mesaj İçeriği</Text>
            <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 8 }]}>
              <Ionicons name="chatbubble" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.inputText, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Mesaj içeriği girin (opsiyonel)..."
                value={smsMessage}
                onChangeText={setSmsMessage}
                multiline={true}
                numberOfLines={4}
                autoCorrect={false}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>{selectedOption.label}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name={getIconForType()} size={18} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.inputText}
              placeholder={selectedOption.placeholder}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={selectedOption.keyboardType}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={selectedType === 'wifi'}
            />
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={[
          styles.generateButton, 
          !isFormValid() ? styles.buttonDisabled : null
        ]} 
        onPress={generateQR}
        disabled={!isFormValid()}
      >
        <Ionicons name="qr-code" size={18} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>QR Oluştur</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRInputForm; 