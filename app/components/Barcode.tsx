import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, G, Text as SvgText } from 'react-native-svg';

interface BarcodeProps {
  value: string;
  format?: 'CODE128' | 'EAN13' | 'UPC';
  width?: number;
  height?: number;
  background?: string;
  lineColor?: string;
  margin?: number;
  fontSize?: number;
}

// React Native için basit bir barkod bileşeni
const Barcode = (props: BarcodeProps) => {
  const {
    value,
    format = 'CODE128',
    width = 280,
    height = 80,
    background = '#ffffff',
    lineColor = '#000000',
    margin = 20,
    fontSize = 12
  } = props;
  
  // Barkod çizgileri oluşturma fonksiyonu
  const generateBars = () => {
    if (!value || value.length === 0) return [];
    
    const bars = [];
    let xPos = margin;
    const narrowBar = 2;
    const wideBar = 4;
    const gap = 2;
    
    // Başlangıç çizgileri (quiet zone)
    bars.push(
      <Line
        key="start1"
        x1={margin / 2}
        y1={margin}
        x2={margin / 2}
        y2={height - margin - 20}
        stroke={lineColor}
        strokeWidth={narrowBar}
      />
    );
    bars.push(
      <Line
        key="start2"
        x1={margin / 2 + narrowBar + gap}
        y1={margin}
        x2={margin / 2 + narrowBar + gap}
        y2={height - margin - 20}
        stroke={lineColor}
        strokeWidth={narrowBar}
      />
    );
    
    xPos = margin + narrowBar * 3 + gap * 3;
    
    // Değere bağlı olarak barkod çizgileri
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      
      // Algoritma: Her karakter için ASCII değerine göre çizgi genişliği belirleme
      const barCount = format === 'EAN13' || format === 'UPC' ? 7 : 4; // Barkod formatına göre
      
      for (let j = 0; j < barCount; j++) {
        // Her karakter için farklı kalınlıkta çizgiler oluştur
        const mod = (char + j) % 4;
        const barWidth = mod < 2 ? narrowBar : wideBar;
        const isBar = j % 2 === 0; // Çizgiler ve boşluklar için
        
        if (isBar) {
          bars.push(
            <Line
              key={`bar-${i}-${j}`}
              x1={xPos}
              y1={margin}
              x2={xPos}
              y2={height - margin - 20}
              stroke={lineColor}
              strokeWidth={barWidth}
            />
          );
        }
        
        xPos += barWidth + gap;
      }
      
      // Karakterler arasında boşluk
      xPos += gap * 2;
    }
    
    // Bitiş çizgileri (quiet zone)
    bars.push(
      <Line
        key="end1"
        x1={width - margin / 2 - narrowBar - gap}
        y1={margin}
        x2={width - margin / 2 - narrowBar - gap}
        y2={height - margin - 20}
        stroke={lineColor}
        strokeWidth={narrowBar}
      />
    );
    bars.push(
      <Line
        key="end2"
        x1={width - margin / 2}
        y1={margin}
        x2={width - margin / 2}
        y2={height - margin - 20}
        stroke={lineColor}
        strokeWidth={narrowBar}
      />
    );
    
    return bars;
  };
  
  return (
    <View style={styles.container}>
      <Svg height={height} width={width} style={{ backgroundColor: background }}>
        <G>
          {generateBars()}
          <SvgText
            x={width / 2}
            y={height - margin + 5}
            textAnchor="middle"
            fontWeight="bold"
            fontSize={fontSize}
            fill={lineColor}
          >
            {value}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Barcode; 