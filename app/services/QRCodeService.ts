import { QRType } from '../types';

export const QRCodeService = {
  // QR kod değerini oluşturma
  generateQRValue: (
    selectedType: QRType,
    inputValue: string,
    wifiName: string,
    contactInfo: {
      name: string;
      surname: string;
      phone: string;
      email: string;
      title: string;
      company: string;
    },
    smsMessage: string
  ): string => {
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
      case 'location':
        value = `geo:${inputValue}`;
        break;
      case 'sms':
        if (smsMessage) {
          value = `SMSTO:${inputValue}:${smsMessage}`;
        } else {
          value = `smsto:${inputValue}`;
        }
        break;
      case 'youtube':
        if (inputValue.includes('youtube.com') || inputValue.includes('youtu.be')) {
          value = inputValue;
        } else {
          value = `https://www.youtube.com/watch?v=${inputValue}`;
        }
        break;
      case 'instagram':
        if (inputValue.startsWith('@')) {
          value = `https://www.instagram.com/${inputValue.substring(1)}`;
        } else if (inputValue.includes('instagram.com')) {
          value = inputValue;
        } else {
          value = `https://www.instagram.com/${inputValue}`;
        }
        break;
      case 'twitter':
        if (inputValue.startsWith('@')) {
          value = `https://twitter.com/${inputValue.substring(1)}`;
        } else if (inputValue.includes('twitter.com') || inputValue.includes('x.com')) {
          value = inputValue;
        } else {
          value = `https://twitter.com/${inputValue}`;
        }
        break;
      case 'contact':
        // MECARD formatında kişi bilgilerini oluştur
        value = `MECARD:N:${contactInfo.surname},${contactInfo.name};`;
        if (contactInfo.phone) value += `TEL:${contactInfo.phone};`;
        if (contactInfo.email) value += `EMAIL:${contactInfo.email};`;
        if (contactInfo.title) value += `TITLE:${contactInfo.title};`;
        if (contactInfo.company) value += `ORG:${contactInfo.company};`;
        value += `;`;
        break;
      case 'paypal':
        if (inputValue.includes('paypal.me')) {
          value = inputValue;
        } else {
          value = `https://www.paypal.me/${inputValue}`;
        }
        break;
      case 'spotify':
        if (inputValue.includes('spotify')) {
          value = inputValue;
        } else {
          value = `spotify:track:${inputValue}`;
        }
        break;
      default:
        break;
    }
    
    return value;
  },

  // QR kodun boyutunu içeriğe göre optimize etme
  calculateQRSize: (value: string): number => {
    // QR kod boyutunu içeriğe göre optimize et ama minimum 200 piksel olsun
    return Math.min(250, Math.max(200, 250 - value.length / 10));
  }
};

export default QRCodeService; 