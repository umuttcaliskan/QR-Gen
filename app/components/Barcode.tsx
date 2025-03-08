import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';

interface BarcodeProps {
  value: string;
  format?: string;
  width: number;
  height: number;
  background?: string;
  lineColor?: string;
  margin?: number;
  fontSize?: number;
}

const generateBarcodeArray = (value: string): number[] => {
  // Basit bir barkod algoritması - gerçek uygulamada daha karmaşık bir algoritma kullanılabilir
  // Bu örnek, rastgele genişliklerde çizgiler oluşturmak içindir
  const barWidths: number[] = [];
  
  // Basit kod128 benzeri bir yapı (sadece görsel örnek için)
  // Başlangıç guard barı
  barWidths.push(1, 1, 1);
  
  // Her karakter için çizgiler oluştur
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    // Karakterin ASCII değerine göre çizgi genişlikleri oluştur
    barWidths.push(charCode % 3 + 1);  // 1, 2 veya 3 birim genişlik
    barWidths.push(1);  // Boşluk
  }
  
  // Bitiş guard barı
  barWidths.push(1, 1, 2);
  
  return barWidths;
};

const Barcode: React.FC<BarcodeProps> = ({
  value,
  format = 'CODE128',
  width = 200,
  height = 80,
  background = 'white',
  lineColor = 'black',
  margin = 10,
  fontSize = 12
}) => {
  const barcodeArray = generateBarcodeArray(value);
  const contentWidth = width - (margin * 2);
  const totalUnits = barcodeArray.reduce((sum, val) => sum + val, 0);
  const unitWidth = contentWidth / totalUnits;

  const renderBars = () => {
    const bars = [];
    let currentX = margin;
    
    for (let i = 0; i < barcodeArray.length; i++) {
      const barWidth = barcodeArray[i] * unitWidth;
      
      // Sadece tek indekslerde çizgi çiz (0, 2, 4, ...)
      if (i % 2 === 0) {
        bars.push(
          <Rect
            key={`bar-${i}`}
            x={currentX}
            y={margin}
            width={barWidth}
            height={height - margin * 3 - fontSize}
            fill={lineColor}
          />
        );
      }
      
      currentX += barWidth;
    }
    
    return bars;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect width={width} height={height} fill={background} />
        <G>{renderBars()}</G>
        <SvgText
          fill={lineColor}
          fontSize={fontSize}
          fontWeight="normal"
          x={width / 2}
          y={height - margin}
          textAnchor="middle"
        >
          {value}
        </SvgText>
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