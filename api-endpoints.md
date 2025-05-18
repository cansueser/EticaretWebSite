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