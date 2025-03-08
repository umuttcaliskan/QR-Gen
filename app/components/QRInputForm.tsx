import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../styles';
import { QROption, QRType, QR_OPTIONS } from '../types';

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
          !isFormValid() ? styles.buttonDisabled : null
        ]} 
        onPress={generateQR}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>QR Oluştur</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRInputForm; 