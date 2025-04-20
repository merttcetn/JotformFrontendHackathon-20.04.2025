# JotForm Frontend Hackathon E-commerce Project

Bu proje JotForm Frontend Hackathon için geliştirilmiş modern bir e-ticaret uygulamasıdır.

## Özellikler

-   JotForm API entegrasyonu ile ürün listesi çekme
-   Kategoriye göre ürün filtreleme
-   Ürün arama özelliği
-   Ürün detay sayfası ve benzer ürün önerileri
-   Sepet yönetimi ve checkout akışı
-   Redux state yönetimi
-   LocalStorage persistence (sayfa yenilendiğinde sepet bilgilerinin korunması)

## Kullanılan Teknolojiler

-   React.js - UI geliştirme
-   Redux Toolkit - State yönetimi
-   React Router - Sayfa yönlendirmeleri
-   Material UI - Icon ve UI bileşenleri
-   JotForm API - Ürün ve form verileri
-   LocalStorage - Veri saklama

## Redux ve LocalStorage Entegrasyonu

Projede sepet yönetimi için Redux Toolkit kullanılmıştır. Böylece uygulama genelinde sepet verilerine erişim sağlanabilir ve bileşenler arasında veri paylaşımı kolaylaşır.

### Redux Store Yapısı

-   **cartSlice**: Sepet öğeleri, toplam fiyat ve JotForm submission için formatlanan ürün listesi için state yönetimi
-   **productSlice**: Tüm ürün listesi için state yönetimi

### LocalStorage Entegrasyonu

Kullanıcı deneyimini iyileştirmek için, sepet verileri tarayıcının localStorage'ında saklanmaktadır. Bu sayede:

-   Kullanıcı sayfayı yenilediğinde sepet içeriği korunur
-   Tarayıcı kapatılıp açıldığında bile sepet bilgileri kaybolmaz
-   Kullanıcı oturumu sonlandırmadan alışverişe devam edebilir

Entegrasyon, Redux action'ları çalıştırıldığında otomatik olarak localStorage'ı güncelleme prensibine dayanır.

## Kurulum

1. Projeyi klonlayın:

```bash
git clone https://github.com/your-username/jotform-frontend-hackathon.git
cd jotform-frontend-hackathon
```

2. Gerekli paketleri yükleyin:

```bash
npm install
```

3. Redux ve gerekli bağımlılıkları yükleyin:

```bash
npm install @reduxjs/toolkit react-redux
```

4. Uygulamayı başlatın:

```bash
npm start
```

## Kullanım

1. Ana sayfada ürünleri görüntüleyin
2. Arama kutusu ile ürün arayın
3. Kategoriye göre filtreleme yapın
4. Ürün kartına tıklayarak detayları görüntüleyin
5. Benzer ürünleri inceleyin
6. Sepete ürün ekleyip, sepetinizi yönetin
7. Checkout işlemi ile siparişi tamamlayın

## Lisans

MIT
