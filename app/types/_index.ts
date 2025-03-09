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
  { name: 'Varsayılan', foreground: '#4F46E5', background: 'white', gradient: ['#4F46E5', '#818CF8'] },
  { name: 'Klasik', foreground: '#1E293B', background: 'white', gradient: ['#1E293B', '#475569'] },
  { name: 'Kırmızı', foreground: '#EF4444', background: 'white', gradient: ['#EF4444', '#F87171'] },
  { name: 'Yeşil', foreground: '#10B981', background: 'white', gradient: ['#10B981', '#34D399'] },
  { name: 'Mavi', foreground: '#3B82F6', background: 'white', gradient: ['#3B82F6', '#60A5FA'] },
  { name: 'Mor', foreground: '#8B5CF6', background: 'white', gradient: ['#8B5CF6', '#A78BFA'] },
  { name: 'Turuncu', foreground: '#F97316', background: 'white', gradient: ['#F97316', '#FB923C'] },
  { name: 'Pembe', foreground: '#EC4899', background: 'white', gradient: ['#EC4899', '#F472B6'] },
  { name: 'Beyaz', foreground: 'white', background: '#000000', gradient: ['white', '#f8fafc'] },
];

// Expo Router'un uyarısını gidermek için boş bir bileşen ekliyorum
export default function TypesPage() {
  return null;
} 