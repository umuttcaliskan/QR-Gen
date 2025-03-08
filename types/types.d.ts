declare module 'react-native-barcode-generator' {
  import { ViewStyle, TextStyle } from 'react-native';
  
  interface BarcodeGeneratorProps {
    value: string;
    format?: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14';
    text?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    lineColor?: string;
    background?: string;
  }
  
  export default function BarcodeGenerator(props: BarcodeGeneratorProps): JSX.Element;
} 