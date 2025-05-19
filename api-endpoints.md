# LuxeTrend REST API Endpoints

Bu dokümantasyon, LuxeTrend uygulamasının REST API endpointlerini listelemektedir.

## Ürün Endpointleri

### Ürünleri Listeleme
- **URL**: `/api/urunler`
- **Method**: `GET`
- **URL Parametreleri**: 
  - `page` (opsiyonel) - Sayfa numarası (default: 0)
  - `size` (opsiyonel) - Sayfa başına ürün sayısı (default: 10)
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "totalItems": 100, "content": [{ "id": 7, "name": "Tablet Pad 10", "description": "10 inç ekranlı tablet", "price": 8000.00, "categoryId": 1, "stockQuantity": 40, "color": "Gri", "status": true, "size": null, "imageUrl": "tablet-resmi.jpg" }, ...], "totalPages": 10, "currentPage": 0 }`

### Kategoriye Göre Ürünleri Listeleme
- **URL**: `/api/urunler/kategori/{kategoriId}`
- **Method**: `GET`
- **URL Parametreleri**: 
  - `kategoriId` - Kategori ID'si
  - `page` (opsiyonel) - Sayfa numarası (default: 0)
  - `size` (opsiyonel) - Sayfa başına ürün sayısı (default: 10)
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "totalItems": 100, "content": [...], "totalPages": 10, "currentPage": 0 }`

### Ürün Detayı
- **URL**: `/api/urunler/{id}`
- **Method**: `GET`
- **URL Parametreleri**: `id` - Ürün ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 7, "name": "Tablet Pad 10", "description": "10 inç ekranlı tablet", "price": 8000.00, "categoryId": 1, "stockQuantity": 40, "color": "Gri", "status": true, "size": null, "imageUrl": "tablet-resmi.jpg" }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Ürün bulunamadı" }`

### Ürün Kaydetme
- **URL**: `/api/urunler`
- **Method**: `POST`
- **Yetki**: Admin
- **Request Body**:
```json
{
  "name": "Ürün Adı",
  "description": "Ürün Açıklaması",
  "price": 1299.99,
  "categoryId": 1,
  "stockQuantity": 100,
  "imageUrl": "urun-resmi.jpg"
}
```
- **Başarılı Yanıt**:
  - Kod: 201 Created
  - İçerik: `{ "id": 1, "name": "Ürün Adı", ... }`

### Ürün Düzenleme
- **URL**: `/api/urunler/{id}`
- **Method**: `PUT`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Ürün ID'si
- **Request Body**:
```json
{
  "name": "Güncellenmiş Ürün Adı",
  "description": "Güncellenmiş Açıklama",
  "price": 1399.99,
  "categoryId": 1,
  "stockQuantity": 90,
  "imageUrl": "yeni-resim.jpg"
}
```
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "name": "Güncellenmiş Ürün Adı", ... }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Ürün bulunamadı" }`

### Ürün Silme
- **URL**: `/api/urunler/{id}`
- **Method**: `DELETE`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Ürün ID'si
- **Başarılı Yanıt**:
  - Kod: 204 No Content
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Ürün bulunamadı" }`

## Kategori Endpointleri

### Kategorileri Listeleme
- **URL**: `/api/kategoriler`
- **Method**: `GET`
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `[{ "id": 1, "name": "Kategori Adı", ... }, ...]`

### Kategori Detayı
- **URL**: `/api/kategoriler/{id}`
- **Method**: `GET`
- **URL Parametreleri**: `id` - Kategori ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "name": "Kategori Adı", ... }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Kategori bulunamadı" }`

### Kategori Ekleme
- **URL**: `/api/kategoriler`
- **Method**: `POST`
- **Yetki**: Admin
- **Request Body**:
```json
{
  "name": "Yeni Kategori",
  "description": "Kategori Açıklaması"
}
```
- **Başarılı Yanıt**:
  - Kod: 201 Created
  - İçerik: `{ "id": 1, "name": "Yeni Kategori", ... }`

### Kategori Düzenleme
- **URL**: `/api/kategoriler/{id}`
- **Method**: `PUT`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Kategori ID'si
- **Request Body**:
```json
{
  "name": "Güncellenmiş Kategori",
  "description": "Güncellenmiş Açıklama"
}
```
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "name": "Güncellenmiş Kategori", ... }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Kategori bulunamadı" }`

### Kategori Silme
- **URL**: `/api/kategoriler/{id}`
- **Method**: `DELETE`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Kategori ID'si
- **Başarılı Yanıt**:
  - Kod: 204 No Content
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Kategori bulunamadı" }`

## Kimlik Doğrulama Endpointleri

### Giriş (Login)
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
```json
{
  "username": "kullanici@ornek.com",
  "password": "sifre123"
}
```
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "success": true, "user": { "id": 1, "username": "kullanici@ornek.com", "permission": true } }`
- **Hata Yanıtı**:
  - Kod: 401 Unauthorized
  - İçerik: `{ "success": false, "message": "Hatalı kullanıcı adı veya şifre" }`

## Kupon Endpointleri

### Kuponları Listeleme
- **URL**: `/api/kuponlar`
- **Method**: `GET`
- **Yetki**: Admin
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `[{ "id": 1, "code": "YENIUYE20", "discountValue": 20.00, "startDate": "2023-01-01T00:00:00", "endDate": "2023-12-31T23:59:59" }, ...]`

### Kupon Detayı
- **URL**: `/api/kuponlar/{id}`
- **Method**: `GET`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Kupon ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "code": "YENIUYE20", "discountValue": 20.00, "startDate": "2023-01-01T00:00:00", "endDate": "2023-12-31T23:59:59" }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Kupon bulunamadı" }`

### Kupon Ekleme
- **URL**: `/api/kuponlar`
- **Method**: `POST`
- **Yetki**: Admin
- **Request Body**:
```json
{
  "code": "YENIUYE20",
  "discountValue": 20.00,
  "startDate": "2023-01-01T00:00:00",
  "endDate": "2023-12-31T23:59:59"
}
```
- **Başarılı Yanıt**:
  - Kod: 201 Created
  - İçerik: `{ "id": 1, "code": "YENIUYE20", "discountValue": 20.00, "startDate": "2023-01-01T00:00:00", "endDate": "2023-12-31T23:59:59" }`

### Kupon Düzenleme
- **URL**: `/api/kuponlar/{id}`
- **Method**: `PUT`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Kupon ID'si
- **Request Body**:
```json
{
  "code": "YENIUYE25",
  "discountValue": 25.00,
  "startDate": "2023-01-01T00:00:00",
  "endDate": "2023-12-31T23:59:59"
}
```
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "code": "YENIUYE25", "discountValue": 25.00, "startDate": "2023-01-01T00:00:00", "endDate": "2023-12-31T23:59:59" }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Kupon bulunamadı" }`

### Kupon Silme
- **URL**: `/api/kuponlar/{id}`
- **Method**: `DELETE`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Kupon ID'si
- **Başarılı Yanıt**:
  - Kod: 204 No Content
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Kupon bulunamadı" }`

### Kupon Doğrulama
- **URL**: `/api/kuponlar/dogrula/{kuponKodu}`
- **Method**: `GET`
- **URL Parametreleri**: `kuponKodu` - Kupon Kodu
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "valid": true, "discountValue": 20.00 }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "valid": false, "message": "Geçersiz kupon kodu" }`

## Müşteri Endpointleri

### Müşterileri Listeleme
- **URL**: `/api/musteriler`
- **Method**: `GET`
- **Yetki**: Admin
- **URL Parametreleri**: 
  - `page` (opsiyonel) - Sayfa numarası (default: 0)
  - `size` (opsiyonel) - Sayfa başına müşteri sayısı (default: 10)
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "totalItems": 50, "content": [{ "id": 1, "name": "Ahmet Yılmaz", "email": "ahmet@example.com", "address": "İstanbul, Türkiye", "phone": "05001234567" }, ...], "totalPages": 5, "currentPage": 0 }`

### Müşteri Detayı
- **URL**: `/api/musteriler/{id}`
- **Method**: `GET`
- **Yetki**: Admin veya İlgili Müşteri
- **URL Parametreleri**: `id` - Müşteri ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "name": "Ahmet Yılmaz", "email": "ahmet@example.com", "address": "İstanbul, Türkiye", "phone": "05001234567" }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Müşteri bulunamadı" }`

### Müşteri Ekleme
- **URL**: `/api/musteriler`
- **Method**: `POST`
- **Request Body**:
```json
{
  "name": "Ayşe Demir",
  "email": "ayse@example.com",
  "address": "Ankara, Türkiye",
  "phone": "05009876543"
}
```
- **Başarılı Yanıt**:
  - Kod: 201 Created
  - İçerik: `{ "id": 2, "name": "Ayşe Demir", "email": "ayse@example.com", "address": "Ankara, Türkiye", "phone": "05009876543" }`

### Müşteri Güncelleme
- **URL**: `/api/musteriler/{id}`
- **Method**: `PUT`
- **Yetki**: Admin veya İlgili Müşteri
- **URL Parametreleri**: `id` - Müşteri ID'si
- **Request Body**:
```json
{
  "name": "Ayşe Demir",
  "email": "ayse.yeni@example.com",
  "address": "İzmir, Türkiye",
  "phone": "05009876543"
}
```
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 2, "name": "Ayşe Demir", "email": "ayse.yeni@example.com", "address": "İzmir, Türkiye", "phone": "05009876543" }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Müşteri bulunamadı" }`

### Müşteri Silme
- **URL**: `/api/musteriler/{id}`
- **Method**: `DELETE`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Müşteri ID'si
- **Başarılı Yanıt**:
  - Kod: 204 No Content
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Müşteri bulunamadı" }`

## Sipariş Endpointleri

### Siparişleri Listeleme
- **URL**: `/api/siparisler`
- **Method**: `GET`
- **Yetki**: Admin
- **URL Parametreleri**: 
  - `page` (opsiyonel) - Sayfa numarası (default: 0)
  - `size` (opsiyonel) - Sayfa başına sipariş sayısı (default: 10)
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "totalItems": 100, "content": [{ "id": 1, "orderCode": "ORD12345", "customerId": 1, "customerName": "Ahmet Yılmaz", "orderDate": "2023-01-15", "status": "TESLİM EDİLDİ", "totalAmount": 2500.50 }, ...], "totalPages": 10, "currentPage": 0 }`

### Müşteriye Göre Siparişleri Listeleme
- **URL**: `/api/siparisler/musteri/{musteriId}`
- **Method**: `GET`
- **Yetki**: Admin veya İlgili Müşteri
- **URL Parametreleri**: 
  - `musteriId` - Müşteri ID'si
  - `page` (opsiyonel) - Sayfa numarası (default: 0)
  - `size` (opsiyonel) - Sayfa başına sipariş sayısı (default: 10)
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "totalItems": 5, "content": [{ "id": 1, "orderCode": "ORD12345", "orderDate": "2023-01-15", "status": "TESLİM EDİLDİ", "totalAmount": 2500.50 }, ...], "totalPages": 1, "currentPage": 0 }`

### Sipariş Detayı
- **URL**: `/api/siparisler/{id}`
- **Method**: `GET`
- **Yetki**: Admin veya Sipariş Sahibi Müşteri
- **URL Parametreleri**: `id` - Sipariş ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "orderCode": "ORD12345", "customerId": 1, "customerName": "Ahmet Yılmaz", "orderDate": "2023-01-15", "status": "TESLİM EDİLDİ", "cargoId": 2, "cargoName": "Aras Kargo", "trackingCode": "ARS987654", "couponId": 1, "couponCode": "INDIRIM20", "discountValue": 20.00, "totalAmount": 2500.50, "details": [{ "productId": 5, "productName": "Akıllı Telefon Model X", "quantity": 1, "unitPrice": 2500.50, "totalPrice": 2500.50 }] }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Sipariş bulunamadı" }`

### Sipariş Oluşturma
- **URL**: `/api/siparisler`
- **Method**: `POST`
- **Request Body**:
```json
{
  "customerId": 1,
  "cargoId": 2,
  "couponCode": "INDIRIM20",
  "items": [
    {
      "productId": 5,
      "quantity": 1
    },
    {
      "productId": 8,
      "quantity": 2
    }
  ],
  "shippingAddress": "İstanbul, Türkiye"
}
```
- **Başarılı Yanıt**:
  - Kod: 201 Created
  - İçerik: `{ "id": 2, "orderCode": "ORD67890", "orderDate": "2023-04-20", "status": "HAZIRLANIYOR" }`

### Sipariş Durumu Güncelleme
- **URL**: `/api/siparisler/{id}/durum`
- **Method**: `PUT`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Sipariş ID'si
- **Request Body**:
```json
{
  "status": "KARGOYA VERİLDİ"
}
```
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 2, "orderCode": "ORD67890", "status": "KARGOYA VERİLDİ" }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Sipariş bulunamadı" }`

### Sipariş İptali
- **URL**: `/api/siparisler/{id}/iptal`
- **Method**: `PUT`
- **Yetki**: Admin veya Sipariş Sahibi Müşteri
- **URL Parametreleri**: `id` - Sipariş ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 2, "orderCode": "ORD67890", "status": "İPTAL EDİLDİ" }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Sipariş bulunamadı" }`
  - Kod: 400 Bad Request
  - İçerik: `{ "message": "Sipariş durumu iptal edilmeye uygun değil" }`

## Sipariş Detayları Endpointleri

### Tüm Sipariş Detaylarını Listeleme
- **URL**: `/api/siparis-detaylari`
- **Method**: `GET`
- **Yetki**: Admin
- **URL Parametreleri**: 
  - `page` (opsiyonel) - Sayfa numarası (default: 0)
  - `size` (opsiyonel) - Sayfa başına detay sayısı (default: 10)
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "totalItems": 150, "content": [{ "id": 1, "orderId": 1, "productId": 5, "productName": "Akıllı Telefon Model X", "quantity": 1, "unitPrice": 2500.50, "totalPrice": 2500.50 }, ...], "totalPages": 15, "currentPage": 0 }`

### Sipariş Detaylarını Listeleme
- **URL**: `/api/siparis-detaylari/siparis/{siparisId}`
- **Method**: `GET`
- **Yetki**: Admin veya Sipariş Sahibi Müşteri
- **URL Parametreleri**: `siparisId` - Sipariş ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `[{ "id": 1, "orderId": 1, "productId": 5, "productName": "Akıllı Telefon Model X", "quantity": 1, "unitPrice": 2500.50, "totalPrice": 2500.50 }, ...]`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Sipariş bulunamadı" }`

### Sipariş Detayı Görüntüleme
- **URL**: `/api/siparis-detaylari/{id}`
- **Method**: `GET`
- **Yetki**: Admin veya Sipariş Sahibi Müşteri
- **URL Parametreleri**: `id` - Sipariş Detay ID'si
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 1, "orderId": 1, "productId": 5, "productName": "Akıllı Telefon Model X", "quantity": 1, "unitPrice": 2500.50, "totalPrice": 2500.50 }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Sipariş detayı bulunamadı" }`

### Sipariş Detayı Ekleme
- **URL**: `/api/siparis-detaylari`
- **Method**: `POST`
- **Yetki**: Admin
- **Request Body**:
```json
{
  "orderId": 1,
  "productId": 8,
  "quantity": 2
}
```
- **Başarılı Yanıt**:
  - Kod: 201 Created
  - İçerik: `{ "id": 3, "orderId": 1, "productId": 8, "productName": "Kablosuz Mouse M3", "quantity": 2, "unitPrice": 350.00, "totalPrice": 700.00 }`
- **Hata Yanıtı**:
  - Kod: 400 Bad Request
  - İçerik: `{ "message": "Ürün stokta yeterli sayıda yok" }`

### Sipariş Detayı Güncelleme
- **URL**: `/api/siparis-detaylari/{id}`
- **Method**: `PUT`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Sipariş Detay ID'si
- **Request Body**:
```json
{
  "orderId": 1,
  "productId": 8,
  "quantity": 3
}
```
- **Başarılı Yanıt**:
  - Kod: 200 OK
  - İçerik: `{ "id": 3, "orderId": 1, "productId": 8, "productName": "Kablosuz Mouse M3", "quantity": 3, "unitPrice": 350.00, "totalPrice": 1050.00 }`
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Sipariş detayı bulunamadı" }`
  - Kod: 400 Bad Request
  - İçerik: `{ "message": "Yeni ürün stokta yeterli sayıda yok" }`

### Sipariş Detayı Silme
- **URL**: `/api/siparis-detaylari/{id}`
- **Method**: `DELETE`
- **Yetki**: Admin
- **URL Parametreleri**: `id` - Sipariş Detay ID'si
- **Başarılı Yanıt**:
  - Kod: 204 No Content
- **Hata Yanıtı**:
  - Kod: 404 Not Found
  - İçerik: `{ "message": "Sipariş detayı bulunamadı" }`