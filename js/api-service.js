/**
 * API servisi - Tüm API çağrıları için merkezi servis
 * Bu dosya, uygulamanın tüm API isteklerini yönetir
 */

class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:8080/api';
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    /**
     * API'ye GET isteği gönderir
     * @param {string} endpoint - API endpoint'i (/urunler, /kategoriler gibi)
     * @param {Object} params - URL parametreleri (opsiyonel)
     * @returns {Promise<any>} - API yanıtı
     */
    async get(endpoint, params = {}) {
        try {
            // URL parametrelerini oluştur
            const urlParams = new URLSearchParams();
            for (const key in params) {
                urlParams.append(key, params[key]);
            }

            // Parametre varsa URL'ye ekle
            const url = `${this.baseUrl}${endpoint}${params ? '?' + urlParams.toString() : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });

            // Yanıt başarılı değilse hata fırlat
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API isteği başarısız oldu');
            }

            return await response.json();
        } catch (error) {
            console.error('API GET hatası:', error);
            throw error;
        }
    }

    /**
     * API'ye POST isteği gönderir
     * @param {string} endpoint - API endpoint'i (/urunler, /kategoriler gibi)
     * @param {Object} data - Gönderilecek veri
     * @returns {Promise<any>} - API yanıtı
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            // Yanıt başarılı değilse hata fırlat
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API isteği başarısız oldu');
            }

            return await response.json();
        } catch (error) {
            console.error('API POST hatası:', error);
            throw error;
        }
    }

    /**
     * API'ye PUT isteği gönderir
     * @param {string} endpoint - API endpoint'i (/urunler/1, /kategoriler/2 gibi)
     * @param {Object} data - Gönderilecek veri
     * @returns {Promise<any>} - API yanıtı
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            // Yanıt başarılı değilse hata fırlat
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API isteği başarısız oldu');
            }

            return await response.json();
        } catch (error) {
            console.error('API PUT hatası:', error);
            throw error;
        }
    }

    /**
     * API'ye DELETE isteği gönderir
     * @param {string} endpoint - API endpoint'i (/urunler/1, /kategoriler/2 gibi)
     * @returns {Promise<any>} - API yanıtı
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.headers
            });

            // Yanıt başarılı değilse hata fırlat
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API isteği başarısız oldu');
            }

            // 204 No Content durumunda boş bir obje döndür
            if (response.status === 204) {
                return {};
            }

            return await response.json();
        } catch (error) {
            console.error('API DELETE hatası:', error);
            throw error;
        }
    }

    // Kategori endpointleri
    async getCategories() {
        return this.get('/kategoriler');
    }

    async getCategoryById(id) {
        return this.get(`/kategoriler/${id}`);
    }

    async createCategory(categoryData) {
        return this.post('/kategoriler', categoryData);
    }

    async updateCategory(id, categoryData) {
        return this.put(`/kategoriler/${id}`, categoryData);
    }

    async deleteCategory(id) {
        return this.delete(`/kategoriler/${id}`);
    }

    // Ürün endpointleri
    async getProducts(page = 0, size = 10) {
        return this.get('/urunler', { page, size });
    }

    async getProductsByCategoryId(categoryId, page = 0, size = 10) {
        return this.get(`/urunler/kategori/${categoryId}`, { page, size });
    }

    async getProductById(id) {
        return this.get(`/urunler/${id}`);
    }

    async createProduct(productData) {
        return this.post('/urunler', productData);
    }

    async updateProduct(id, productData) {
        return this.put(`/urunler/${id}`, productData);
    }

    async deleteProduct(id) {
        return this.delete(`/urunler/${id}`);
    }

    // Kimlik doğrulama endpointleri
    async login(username, password) {
        return this.post('/auth/login', { username, password });
    }
}

// Singleton olarak kullanılabilecek bir örnek oluştur
const apiService = new ApiService();

// Global olarak erişilebilir olması için window nesnesine ekle
window.apiService = apiService;

// Dışa aktar
export default apiService;