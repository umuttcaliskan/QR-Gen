import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { styles } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLOR_SCHEMES } from '../types';

interface QRStyleOptionsProps {
  useGradient: boolean;
  toggleGradient: () => void;
  qrForegroundColor: string;
  gradientColors: string[];
  onColorSchemeSelect: (index: number) => void;
  qrMargin: number;
  changeQrMargin: (margin: number) => void;
  qrErrorLevel: 'L' | 'M' | 'Q' | 'H';
  changeQrErrorLevel: (level: 'L' | 'M' | 'Q' | 'H') => void;
  logoEnabled: boolean;
  toggleLogo: () => void;
  logoUri: string | null;
  pickLogo: () => void;
}

const QRStyleOptions: React.FC<QRStyleOptionsProps> = ({
  useGradient,
  toggleGradient,
  qrForegroundColor,
  gradientColors,
  onColorSchemeSelect,
  qrMargin,
  changeQrMargin,
  qrErrorLevel,
  changeQrErrorLevel,
  logoEnabled,
  toggleLogo,
  logoUri,
  pickLogo
}) => {
  return (
    <>
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
              onPress={() => onColorSchemeSelect(index)}
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
  );
};

export default QRStyleOptions; 