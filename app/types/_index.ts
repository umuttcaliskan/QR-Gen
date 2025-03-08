export type QRType = 'text' | 'url' | 'phone' | 'email' | 'wifi' | 'barcode' | 'location' | 'sms' | 'youtube' | 'instagram' | 'twitter' | 'contact' | 'paypal' | 'spotify';

export interface QROption {
  type: QRType;
  label: string;
  placeholder: string;
  keyboardType: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
}

export const QR_OPTIONS: QROption[] = [
  { type: 'text', label: 'Metin', placeholder: 'Metin girin...', keyboardType: 'default' },
  { type: 'url', label: 'URL', placeholder: 'URL girin... (örn: google.com)', keyboardType: 'url' },
  { type: 'phone', label: 'Telefon', placeholder: 'Telefon numarası girin...', keyboardType: 'phone-pad' },
  { type: 'email', label: 'E-posta', placeholder: 'E-posta adresi girin...', keyboardType: 'email-address' },
  { type: 'wifi', label: 'WiFi', placeholder: 'WiFi şifresi girin...', keyboardType: 'default' },
  { type: 'barcode', label: 'Barkod', placeholder: 'Barkod numarası girin...', keyboardType: 'numeric' },
  { type: 'location', label: 'Koordinat', placeholder: 'Enlem, Boylam (örn: 41.0082,28.9784)', keyboardType: 'default' },
  { type: 'sms', label: 'SMS', placeholder: 'Telefon numarası girin...', keyboardType: 'phone-pad' },
  { type: 'youtube', label: 'YouTube', placeholder: 'YouTube video ID veya URL girin...', keyboardType: 'default' },
  { type: 'instagram', label: 'Instagram', placeholder: 'Instagram kullanıcı adı girin...', keyboardType: 'default' },
  { type: 'twitter', label: 'Twitter', placeholder: 'Twitter kullanıcı adı girin...', keyboardType: 'default' },
  { type: 'contact', label: 'Kişi Kartı', placeholder: 'İsim girin...', keyboardType: 'default' },
  { type: 'paypal', label: 'PayPal', placeholder: 'PayPal.me kullanıcı adı girin...', keyboardType: 'default' },
  { type: 'spotify', label: 'Spotify', placeholder: 'Spotify bağlantısı girin...', keyboardType: 'default' },
];

export interface ColorScheme {
  name: string;
  foreground: string;
  background: string;
  gradient: string[];
}

export const COLOR_SCHEMES: ColorScheme[] = [
  { name: 'Varsayılan', foreground: '#212529', background: 'white', gradient: ['#3B82F6', '#7048E8'] },
  { name: 'Klasik', foreground: 'black', background: 'white', gradient: ['black', '#333333'] },
  { name: 'Kırmızı', foreground: '#E53E3E', background: 'white', gradient: ['#E53E3E', '#C53030'] },
  { name: 'Yeşil', foreground: '#38A169', background: 'white', gradient: ['#38A169', '#2F855A'] },
  { name: 'Mavi', foreground: '#3182CE', background: 'white', gradient: ['#3182CE', '#2B6CB0'] },
  { name: 'Mor', foreground: '#805AD5', background: 'white', gradient: ['#805AD5', '#6B46C1'] },
  { name: 'Turuncu', foreground: '#DD6B20', background: 'white', gradient: ['#DD6B20', '#C05621'] },
  { name: 'Pembe', foreground: '#D53F8C', background: 'white', gradient: ['#D53F8C', '#B83280'] },
];

// Expo Router'un uyarısını gidermek için boş bir bileşen ekliyorum
export default function TypesPage() {
  return null;
} 