# QR-Gen: Gelişmiş QR Kod Üretici ve Tarayıcı

QR-Gen, tek bir uygulama içinde kapsamlı QR kod oluşturma ve tarama özellikleri sunan modern bir mobil uygulamadır. Kullanıcılar basit metinden gelişmiş kişisel kartvizitlere kadar çeşitli içerik türleri için özelleştirilebilir QR kodları oluşturabilir, tarayabilir ve paylaşabilirler.

## ✨ Özellikler

### QR Kod Oluşturma
- **Çoklu İçerik Desteği**: Metin, URL, Telefon, E-posta, WiFi, Barkod, Konum, SMS, YouTube, Instagram, Twitter, Kişi Bilgisi, PayPal ve Spotify bağlantıları için özel QR kodları
- **İleri Düzey Özelleştirme**: QR kodlarını renk şemaları, gradyan efektleri ve logo eklemek dahil olmak üzere kişiselleştirme
- **Hata Düzeltme Seviyesi**: Farklı hata düzeltme seviyeleri ile QR kodun güvenilirliğini ayarlama
- **Barkod Desteği**: Standart barkod oluşturma seçeneği

### QR Kod Tarama
- **Kamera Tarayıcısı**: Gerçek zamanlı QR kod tarama özelliği
- **Galeri Taraması**: Telefon galerisinden seçilen görsellerden QR kod ve barkod tarama
- **Çoklu Format Desteği**: Farklı QR kod formatlarını ve barkodları tanıma ve işleme

### Ek Özellikler
- **Paylaşım Seçenekleri**: Oluşturulan QR kodlarını görüntü olarak paylaşma
- **Doğrudan Erişim**: WiFi QR kodları için otomatik bağlanma desteği
- **Modern Arayüz**: Kullanımı kolay, sezgisel ve estetik kullanıcı arayüzü
- **Otomatik Boyutlandırma**: İçerik uzunluğuna göre otomatik QR kod boyutu optimizasyonu

## 🚀 Başlangıç

### Gereksinimler
- Node.js 16 veya üzeri
- Expo CLI
- Android Studio (Android geliştirme için)
- Xcode (iOS geliştirme için)

### Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/username/qr-gen.git
cd qr-gen

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

## 📱 Kullanım Kılavuzu

1. **QR Kod Oluşturma**:
   - Ana ekranda istediğiniz QR kod türünü seçin
   - İlgili bilgileri girin (URL, telefon numarası, vb.)
   - Renk, boyut ve diğer görsel özellikleri ayarlayın
   - QR kodunuzu paylaşın veya kaydedin

2. **QR Kod Tarama**:
   - Tarayıcı simgesine tıklayarak kamera tarayıcısını açın
   - Galeriden bir QR kod görüntüsü seçmek için "Galeriden Seç" seçeneğini kullanın
   - Taranan bilgiyi görüntüleyin ve ilgili eylemleri gerçekleştirin

## 🛠️ Teknik Detaylar

QR-Gen, aşağıdaki teknolojileri kullanmaktadır:

- **React Native & Expo**: Modern mobil uygulama geliştirme çerçevesi
- **Expo Router**: Sayfa yönlendirmeleri için kullanılan sistem
- **Expo Barcode Scanner & Camera**: QR kod tarama ve kamera işlevleri
- **React Native QRCode SVG**: Yüksek kaliteli QR kod oluşturma
- **React Native Barcode Generator**: Barkod oluşturma
- **TypeScript**: Tip güvenliği için

## 🔒 İzinler

Uygulama aşağıdaki izinleri kullanır:
- Kamera erişimi (QR kod tarama için)
- Galeri erişimi (QR kod görsellerini kaydetmek ve galeriden tarama yapmak için)
- Konum erişimi (Android'de WiFi tarama için gerekli)
- WiFi erişimi (WiFi QR kodlarını okumak ve bağlanmak için)

## 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## ✍️ İletişim

Geliştirici: Umut Çalışkan
GitHub: https://github.com/umuttcaliskan
E-posta: destek@picksoso.com

Sorularınız veya geri bildirimleriniz için lütfen iletişime geçin.