import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles';
import { QRType, QR_OPTIONS } from '../types';

interface QRTypeSelectorProps {
  onTypeSelect: (type: QRType) => void;
  selectedType: QRType | null;
}

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ onTypeSelect, selectedType }) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  return (
    <View style={styles.optionsContainer}>
      <Text style={styles.sectionTitle}>QR Kod Türü Seçin</Text>
      <View style={styles.optionsGrid}>
        {/* Ana QR kod türleri */}
        {QR_OPTIONS.slice(0, 5).map((option) => (
          <TouchableOpacity 
            key={option.type}
            style={[
              styles.optionButton, 
              selectedType === option.type && styles.selectedOption
            ]} 
            onPress={() => onTypeSelect(option.type)}
          >
            <Text style={[
              styles.optionText,
              selectedType === option.type && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Daha fazla seçeneği butonu */}
        <TouchableOpacity 
          style={[
            styles.optionButton, 
            showMoreOptions && styles.selectedOption
          ]} 
          onPress={() => setShowMoreOptions(!showMoreOptions)}
        >
          <Text style={[
            styles.optionText,
            showMoreOptions && styles.selectedOptionText
          ]}>
            {showMoreOptions ? "Daha Az" : "Daha Fazla"}
          </Text>
        </TouchableOpacity>

        {/* Diğer QR kod türleri (showMoreOptions true olduğunda görünür) */}
        {showMoreOptions && QR_OPTIONS.slice(5).map((option) => (
          <TouchableOpacity 
            key={option.type}
            style={[
              styles.optionButton, 
              selectedType === option.type && styles.selectedOption
            ]} 
            onPress={() => onTypeSelect(option.type)}
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
  );
};

export default QRTypeSelector; 