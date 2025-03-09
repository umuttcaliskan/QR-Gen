import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles';
import { QRType, QR_OPTIONS } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface QRTypeSelectorProps {
  onTypeSelect: (type: QRType) => void;
  selectedType: QRType | null;
}

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ onTypeSelect, selectedType }) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // QR tipi için ikon seçimi
  const getIconForType = (type: QRType) => {
    switch (type) {
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
    <View style={styles.optionsContainer}>
      <Text style={styles.sectionTitle}>QR Kod Türü Seçin</Text>
      <Text style={styles.sectionSubtitle}>
        Oluşturmak istediğiniz QR kodunun türünü aşağıdan seçebilirsiniz.
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
        style={{ marginBottom: 16 }}
      >
        {/* Ana QR Kod Türleri */}
        {QR_OPTIONS.slice(0, 5).map((option) => (
          <TouchableOpacity 
            key={option.type}
            style={[
              {
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 16,
                marginRight: 12,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: selectedType === option.type ? '#4F46E5' : '#F8FAFC',
                borderWidth: 1,
                borderColor: selectedType === option.type ? '#4F46E5' : '#E2E8F0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }
            ]} 
            onPress={() => onTypeSelect(option.type)}
          >
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: selectedType === option.type ? '#EEF2FF' : '#EFF6FF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10
            }}>
              <Ionicons 
                name={getIconForType(option.type)} 
                size={18} 
                color={selectedType === option.type ? '#4F46E5' : '#64748B'} 
              />
            </View>
            <Text style={[
              {
                fontSize: 14,
                fontWeight: '600',
                color: selectedType === option.type ? '#FFFFFF' : '#475569',
              }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Daha Fazla Seçenek Butonu */}
        <TouchableOpacity 
          style={[
            {
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 16,
              marginRight: 12,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: showMoreOptions ? '#4F46E5' : '#F8FAFC',
              borderWidth: 1,
              borderColor: showMoreOptions ? '#4F46E5' : '#E2E8F0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }
          ]} 
          onPress={() => setShowMoreOptions(!showMoreOptions)}
        >
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: showMoreOptions ? '#EEF2FF' : '#EFF6FF',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Ionicons 
              name={showMoreOptions ? "chevron-up" : "chevron-down"} 
              size={18} 
              color={showMoreOptions ? '#4F46E5' : '#64748B'} 
            />
          </View>
          <Text style={[
            {
              fontSize: 14,
              fontWeight: '600',
              color: showMoreOptions ? '#FFFFFF' : '#475569',
            }
          ]}>
            {showMoreOptions ? "Daha Az" : "Daha Fazla"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Diğer QR Kod Türleri */}
      {showMoreOptions && (
        <View style={styles.optionsGrid}>
          {QR_OPTIONS.slice(5).map((option) => (
            <TouchableOpacity 
              key={option.type}
              style={[
                styles.optionButton, 
                selectedType === option.type && styles.selectedOption
              ]} 
              onPress={() => onTypeSelect(option.type)}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: selectedType === option.type ? '#EEF2FF' : '#F8FAFC',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <Ionicons 
                  name={getIconForType(option.type)} 
                  size={20} 
                  color={selectedType === option.type ? '#FFFFFF' : '#64748B'} 
                />
              </View>
              <Text style={[
                styles.optionText,
                selectedType === option.type && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default QRTypeSelector; 