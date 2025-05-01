/**
 * Admin Panel Ana JavaScript Dosyası
 */

// API servisini import et
import apiService from '../../js/api-service.js';

/**
 * Admin UI işlemlerini yöneten sınıf
 */
class AdminUI {
    constructor() {
        this.initToast();
        this.setupEventListeners();
    }

    /**
     * Sayfa yüklendiğinde çalışacak
     */
    init() {
        // Aktif sayfayı belirle
        this.setActivePage();

        // Sayfa URL'sine göre ilgili yükleme fonksiyonunu çağır
        const currentPath = window.location.pathname;
        if (currentPath.includes('categories.html')) {
            this.loadCategories();
        } else if (currentPath.includes('products.html')) {
            this.loadProducts();
            this.loadCategoriesForSelect();
        } else if (currentPath.includes('dashboard.html')) {
            this.loadDashboardData();
        }
    }

    /**
     * Aktif sayfayı belirle
     */
    setActivePage() {
        const currentLocation = window.location.href;
        const menuItems = document.querySelectorAll('.sidebar-menu a');
        
        menuItems.forEach(item => {
            if(item.href === currentLocation) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Toast mesajını oluştur
     */
    initToast() {
        // Toast mesajı zaten sayfada mevcut mu kontrol et
        let toast = document.getElementById('toast');
        
        // Toast mesajı yoksa oluştur
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style = 'position: fixed; top: 20px; right: 20px; background-color: var(--primary-color); color: white; padding: 15px; border-radius: 4px; z-index: 1000; display: none; box-shadow: 0 4px 8px rgba(0,0,0,0.1);';
            
            const toastContent = document.createElement('div');
            toastContent.style = 'display: flex; align-items: center; gap: 10px;';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-check-circle';
            
            const message = document.createElement('span');
            message.id = 'toast-message';
            message.textContent = 'İşlem başarılı!';
            
            toastContent.appendChild(icon);
            toastContent.appendChild(message);
            toast.appendChild(toastContent);
            
            document.body.appendChild(toast);
        }
    }

    /**
     * Toast mesajı göster
     * @param {string} message - Gösterilecek mesaj
     * @param {boolean} success - Başarılı mesajı mı?
     */
    showToast(message, success = true) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        // Icon ve arkaplan rengini ayarla
        const icon = toast.querySelector('i');
        if (success) {
            toast.style.backgroundColor = 'var(--primary-color)';
            icon.className = 'fas fa-check-circle';
        } else {
            toast.style.backgroundColor = '#dc3545';
            icon.className = 'fas fa-exclamation-circle';
        }
        
        toastMessage.textContent = message;
        toast.style.display = 'block';
        
        // Belirli bir süre sonra gizle
        setTimeout(function() {
            toast.style.display = 'none';
        }, 3000);
    }

    /**
     * Tüm genel event listenerları kur
     */
    setupEventListeners() {
        // Çıkış yapma işlemi için toast mesajı
        const logoutLink = document.querySelector('.sidebar-menu a[href="../index.html"]');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Toast mesajını göster
                this.showToast('Admin çıkış yaptı!');
                
                // 1.5 saniye sonra yönlendirme yap
                setTimeout(function() {
                    window.location.href = '../index.html';
                }, 1500);
            });
        }
    }

    /**
     * KATEGORİ İŞLEMLERİ
     */

    /**
     * Kategorileri yükler ve tabloya ekler
     */
    async loadCategories() {
        try {
            const categories = await apiService.getCategories();
            const tableBody = document.querySelector('.table tbody');
            
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>${category.description || ''}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-button edit-button" data-id="${category.id}"><i class="fas fa-edit"></i></button>
                            <button class="action-button delete-button" data-id="${category.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Düzenle ve sil butonları için event listenerları ekle
            this.attachCategoryEventListeners();
            
        } catch (error) {
            console.error('Kategorileri yükleme hatası:', error);
            this.showToast('Kategorileri yüklerken bir hata oluştu', false);
        }
    }

    /**
     * Kategori sayfasındaki butonların event listenerlarını ekler
     */
    attachCategoryEventListeners() {
        // Kategori ekleme butonu
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        const categoryForm = document.getElementById('categoryForm');
        const closeFormBtn = document.getElementById('closeFormBtn');
        const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
        const newCategoryForm = document.getElementById('newCategoryForm');
        
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => this.openCategoryForm());
        }
        
        if (closeFormBtn) {
            closeFormBtn.addEventListener('click', () => {
                if (categoryForm) categoryForm.style.display = 'none';
            });
        }
        
        if (cancelCategoryBtn) {
            cancelCategoryBtn.addEventListener('click', () => {
                if (categoryForm) categoryForm.style.display = 'none';
            });
        }
        
        if (newCategoryForm) {
            newCategoryForm.addEventListener('submit', (e) => this.submitCategoryForm(e));
        }
        
        // Düzenle butonları için olay dinleyicisi ekle
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.getAttribute('data-id');
                this.editCategory(categoryId);
            });
        });
        
        // Sil butonları için olay dinleyicisi ekle
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.getAttribute('data-id');
                if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
                    this.deleteCategory(categoryId);
                }
            });
        });
        
        // Arama işlevi
        const searchInput = document.querySelector('input[placeholder="Kategori ara..."]');
        const searchButton = searchInput?.nextElementSibling;
        
        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchCategories());
        }
        
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.searchCategories();
                }
            });
        }
    }

    /**
     * Kategori formunu açar (yeni ekle veya düzenle)
     */
    openCategoryForm(category = null) {
        const categoryForm = document.getElementById('categoryForm');
        const categoryNameInput = document.getElementById('categoryName');
        const categoryDescriptionInput = document.getElementById('categoryDescription');
        
        if (!categoryForm || !categoryNameInput || !categoryDescriptionInput) return;
        
        // Form verileri
        this.editMode = !!category;
        this.editingCategoryId = category ? category.id : null;
        
        // Formu temizle
        categoryNameInput.value = category ? category.name : '';
        categoryDescriptionInput.value = category ? (category.description || '') : '';
        
        // Form başlığını değiştir
        const formTitle = document.querySelector('#categoryForm .card-header h2');
        if (formTitle) {
            formTitle.textContent = category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle';
        }
        
        // Formu göster
        categoryForm.style.display = 'block';
    }

    /**
     * Kategori formu gönderim işlemi
     */
    async submitCategoryForm(e) {
        e.preventDefault();
        
        const categoryNameInput = document.getElementById('categoryName');
        const categoryDescriptionInput = document.getElementById('categoryDescription');
        const newCategoryForm = document.getElementById('newCategoryForm');
        const categoryForm = document.getElementById('categoryForm');
        
        if (!categoryNameInput || !categoryDescriptionInput || !newCategoryForm || !categoryForm) return;
        
        // Form verilerini topla
        const formData = {
            name: categoryNameInput.value,
            description: categoryDescriptionInput.value
        };

        try {
            if (this.editMode) {
                await apiService.updateCategory(this.editingCategoryId, formData);
                this.showToast('Kategori başarıyla güncellendi!');
            } else {
                await apiService.createCategory(formData);
                this.showToast('Kategori başarıyla eklendi!');
            }
            
            // Form sıfırlama ve kapatma
            newCategoryForm.reset();
            categoryForm.style.display = 'none';
            
            // Kategori listesini yeniden yükle
            this.loadCategories();
            
        } catch (error) {
            console.error('Form gönderme hatası:', error);
            this.showToast(error.message, false);
        }
    }

    /**
     * Kategori düzenleme için veri alma
     */
    async editCategory(categoryId) {
        try {
            const category = await apiService.getCategoryById(categoryId);
            this.openCategoryForm(category);
        } catch (error) {
            console.error('Kategori bilgilerini alma hatası:', error);
            this.showToast('Kategori bilgilerini alırken bir hata oluştu', false);
        }
    }

    /**
     * Kategori silme
     */
    async deleteCategory(categoryId) {
        try {
            await apiService.deleteCategory(categoryId);
            this.showToast('Kategori başarıyla silindi');
            this.loadCategories(); // Kategori listesini yeniden yükle
        } catch (error) {
            console.error('Kategori silme hatası:', error);
            this.showToast('Kategori silinirken bir hata oluştu', false);
        }
    }

    /**
     * Kategorilerde arama yap
     */
    searchCategories() {
        const searchInput = document.querySelector('input[placeholder="Kategori ara..."]');
        if (!searchInput) return;
        
        const searchText = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('.table tbody tr');
        
        rows.forEach(row => {
            const categoryName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const categoryDescription = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            // Arama metni kategori adı veya açıklamasında varsa göster, yoksa gizle
            if (categoryName.includes(searchText) || categoryDescription.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    /**
     * ÜRÜN İŞLEMLERİ
     */
    
    // Sayfalama değişkenleri
    currentPage = 0;
    pageSize = 10;
    totalPages = 1;

    /**
     * Ürünleri yükler ve tabloya ekler
     */
    async loadProducts(page = 0) {
        try {
            const data = await apiService.getProducts(page, this.pageSize);
            const products = data.content;
            this.totalPages = data.totalPages;
            this.currentPage = data.currentPage;
            
            const tableBody = document.querySelector('.table tbody');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>
                        <img src="${product.imageUrl || '../img/shoe.png'}" alt="Ürün Görseli" width="40" height="40" style="object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>${product.name}</td>
                    <td>${product.categoryName || ''}</td>
                    <td>${product.price.toLocaleString('tr-TR')} TL</td>
                    <td>${product.size || 'N/A'}</td>
                    <td data-color="${product.color || ''}">${product.color || 'N/A'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-button edit-button" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                            <button class="action-button delete-button" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Sayfalama düğmelerini güncelle
            this.updatePagination();
            
            // Düzenle ve sil butonları için event listener'ları ekle
            this.attachProductEventListeners();
            
        } catch (error) {
            console.error('Ürünleri yükleme hatası:', error);
            this.showToast('Ürünleri yüklerken bir hata oluştu', false);
        }
    }

    /**
     * Sayfalama düğmelerini güncelle
     */
    updatePagination() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        
        pagination.innerHTML = '';
        
        // Önceki sayfa düğmesi
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn';
        prevBtn.innerHTML = '&laquo;';
        prevBtn.style.backgroundColor = this.currentPage === 0 ? '#e9ecef' : 'var(--primary-color)';
        prevBtn.style.color = this.currentPage === 0 ? 'var(--secondary-color)' : 'white';
        prevBtn.style.border = 'none';
        prevBtn.disabled = this.currentPage === 0;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 0) {
                this.loadProducts(this.currentPage - 1);
            }
        });
        pagination.appendChild(prevBtn);
        
        // Sayfa numaraları
        for (let i = 0; i < this.totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'btn';
            pageBtn.textContent = i + 1;
            pageBtn.style.backgroundColor = i === this.currentPage ? 'var(--primary-color)' : '#e9ecef';
            pageBtn.style.color = i === this.currentPage ? 'white' : 'var(--secondary-color)';
            pageBtn.style.border = 'none';
            
            pageBtn.addEventListener('click', () => {
                this.loadProducts(i);
            });
            
            pagination.appendChild(pageBtn);
        }
        
        // Sonraki sayfa düğmesi
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn';
        nextBtn.innerHTML = '&raquo;';
        nextBtn.style.backgroundColor = this.currentPage === this.totalPages - 1 ? '#e9ecef' : 'var(--primary-color)';
        nextBtn.style.color = this.currentPage === this.totalPages - 1 ? 'var(--secondary-color)' : 'white';
        nextBtn.style.border = 'none';
        nextBtn.disabled = this.currentPage === this.totalPages - 1;
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages - 1) {
                this.loadProducts(this.currentPage + 1);
            }
        });
        pagination.appendChild(nextBtn);
    }

    /**
     * Select için kategorileri yükle
     */
    async loadCategoriesForSelect() {
        try {
            const categories = await apiService.getCategories();
            const categorySelect = document.getElementById('productCategory');
            
            if (!categorySelect) return;
            
            // Önce mevcut seçenekleri temizle
            categorySelect.innerHTML = '<option value="">Kategori Seçin</option>';
            
            // Kategori seçeneklerini ekle
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Kategorileri yükleme hatası:', error);
            this.showToast('Kategorileri yüklerken bir hata oluştu', false);
        }
    }

    /**
     * Ürün sayfasındaki butonların event listenerlarını ekler
     */
    attachProductEventListeners() {
        // Ürün ekleme butonu
        const addProductBtn = document.getElementById('addProductBtn');
        const productForm = document.getElementById('productForm');
        const closeFormBtn = document.getElementById('closeFormBtn');
        const cancelProductBtn = document.getElementById('cancelProductBtn');
        const newProductForm = document.getElementById('newProductForm');
        
        // Önce tüm eski event listener'ları temizle
        this.removeOldEventListeners();
        
        if (addProductBtn) {
            addProductBtn.addEventListener('click', this.openProductFormHandler = () => this.openProductForm());
        }
        
        if (closeFormBtn) {
            closeFormBtn.addEventListener('click', this.closeFormHandler = () => {
                if (productForm) productForm.style.display = 'none';
            });
        }
        
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', this.cancelProductHandler = () => {
                if (productForm) productForm.style.display = 'none';
            });
        }
        
        if (newProductForm) {
            newProductForm.addEventListener('submit', this.submitProductFormHandler = (e) => this.submitProductForm(e));
        }
        
        // Düzenle butonları için olay dinleyicisi ekle
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                this.editProduct(productId);
            });
        });
        
        // Sil butonları için olay dinleyicisi ekle
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
                    this.deleteProduct(productId);
                }
            });
        });
        
        // Arama işlevi
        const searchInput = document.querySelector('input[placeholder="Ürün ara..."]');
        const searchButton = searchInput?.nextElementSibling;
        
        if (searchButton) {
            searchButton.addEventListener('click', this.searchProductsHandler = () => this.searchProducts());
        }
        
        if (searchInput) {
            searchInput.addEventListener('keyup', this.searchInputHandler = (e) => {
                if (e.key === 'Enter') {
                    this.searchProducts();
                }
            });
        }
    }

    /**
     * Eski event listener'ları temizler
     */
    removeOldEventListeners() {
        const addProductBtn = document.getElementById('addProductBtn');
        const closeFormBtn = document.getElementById('closeFormBtn');
        const cancelProductBtn = document.getElementById('cancelProductBtn');
        const newProductForm = document.getElementById('newProductForm');
        const searchInput = document.querySelector('input[placeholder="Ürün ara..."]');
        const searchButton = searchInput?.nextElementSibling;
        
        // Event listener'ları temizleme
        if (addProductBtn && this.openProductFormHandler) {
            addProductBtn.removeEventListener('click', this.openProductFormHandler);
        }
        
        if (closeFormBtn && this.closeFormHandler) {
            closeFormBtn.removeEventListener('click', this.closeFormHandler);
        }
        
        if (cancelProductBtn && this.cancelProductHandler) {
            cancelProductBtn.removeEventListener('click', this.cancelProductHandler);
        }
        
        if (newProductForm && this.submitProductFormHandler) {
            newProductForm.removeEventListener('submit', this.submitProductFormHandler);
        }
        
        if (searchButton && this.searchProductsHandler) {
            searchButton.removeEventListener('click', this.searchProductsHandler);
        }
        
        if (searchInput && this.searchInputHandler) {
            searchInput.removeEventListener('keyup', this.searchInputHandler);
        }
    }

    /**
     * Ürün formunu açar (yeni ekle veya düzenle)
     */
    openProductForm(product = null) {
        const productForm = document.getElementById('productForm');
        
        if (!productForm) return;
        
        // Form verileri
        this.editMode = !!product;
        this.editingProductId = product ? product.id : null;
        
        // Formu temizle veya doldur
        document.getElementById('productName').value = product ? product.name : '';
        document.getElementById('productCategory').value = product ? product.categoryId : '';
        document.getElementById('productPrice').value = product ? product.price : '';
        document.getElementById('productColorText').value = product ? (product.color || '') : '';
        document.getElementById('productSizeText').value = product ? (product.size || '') : '';
        document.getElementById('productDescription').value = product ? (product.description || '') : '';
        
        // Form başlığını değiştir
        const formTitle = document.querySelector('#productForm .card-header h2');
        if (formTitle) {
            formTitle.textContent = product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle';
        }
        
        // Formu göster
        productForm.style.display = 'block';
    }

    /**
     * Ürün formu gönderim işlemi
     */
    async submitProductForm(e) {
        e.preventDefault();
        
        const productNameInput = document.getElementById('productName');
        const productCategorySelect = document.getElementById('productCategory');
        const productPriceInput = document.getElementById('productPrice');
        const productColorInput = document.getElementById('productColorText');
        const productSizeInput = document.getElementById('productSizeText');
        const productDescriptionInput = document.getElementById('productDescription');
        const newProductForm = document.getElementById('newProductForm');
        const productForm = document.getElementById('productForm');
        const imageInput = document.getElementById('productImages');
        
        // Gerekli alanları kontrol et
        if (!productNameInput || !productCategorySelect || !productPriceInput || !newProductForm || !productForm) return;
        
        let imageUrl = null;
        
        if (imageInput?.files.length > 0) {
            // Gerçek uygulamada burada bir resim yükleme API'si kullanılır
            // Şimdilik sadece dosya adını alıyoruz
            imageUrl = imageInput.files[0].name;
        }
        
        // Form verilerini topla
        const formData = {
            name: productNameInput.value,
            description: productDescriptionInput?.value || '',
            price: parseFloat(productPriceInput.value),
            categoryId: parseInt(productCategorySelect.value),
            stockQuantity: 100, // Örnek bir değer, gerçek uygulamada bir alan eklenebilir
            imageUrl: imageUrl || "urun-resmi.jpg",
            color: productColorInput?.value || '',
            size: productSizeInput?.value || ''
        };

        try {
            if (this.editMode) {
                await apiService.updateProduct(this.editingProductId, formData);
                this.showToast('Ürün başarıyla güncellendi!');
            } else {
                await apiService.createProduct(formData);
                this.showToast('Ürün başarıyla eklendi!');
            }
            
            // Form sıfırlama ve kapatma
            newProductForm.reset();
            productForm.style.display = 'none';
            
            // Ürün listesini yeniden yükle
            this.loadProducts(this.currentPage);
            
        } catch (error) {
            console.error('Form gönderme hatası:', error);
            this.showToast(error.message, false);
        }
    }

    /**
     * Ürün düzenleme için veri alma
     */
    async editProduct(productId) {
        try {
            const product = await apiService.getProductById(productId);
            this.openProductForm(product);
        } catch (error) {
            console.error('Ürün bilgilerini alma hatası:', error);
            this.showToast('Ürün bilgilerini alırken bir hata oluştu', false);
        }
    }

    /**
     * Ürün silme
     */
    async deleteProduct(productId) {
        try {
            await apiService.deleteProduct(productId);
            this.showToast('Ürün başarıyla silindi');
            this.loadProducts(this.currentPage); // Ürün listesini yeniden yükle
        } catch (error) {
            console.error('Ürün silme hatası:', error);
            this.showToast('Ürün silinirken bir hata oluştu', false);
        }
    }

    /**
     * Ürünlerde arama yap
     */
    async searchProducts() {
        const searchInput = document.querySelector('input[placeholder="Ürün ara..."]');
        if (!searchInput) return;
        
        const searchText = searchInput.value.toLowerCase();
        
        if (!searchText) {
            // Arama alanı boşsa tüm ürünleri yükle
            this.loadProducts(0);
            return;
        }
        
        try {
            // API'de arama endpointi olmadığından burada ekledik
            // Gerçek bir uygulamada API ile arama yapılabilir
            const data = await apiService.getProducts(0, 100); // Daha fazla ürün al
            const allProducts = data.content;
            
            // İsimde arama yapıyoruz
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchText)
            );
            
            // Sonuçları tabloya ekle
            const tableBody = document.querySelector('.table tbody');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                // Sonuç bulunamadıysa mesaj göster
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 20px;">
                            Arama sonucu bulunamadı
                        </td>
                    </tr>
                `;
                
                // Sayfalamayı gizle
                const pagination = document.querySelector('.pagination');
                if (pagination) pagination.style.display = 'none';
                return;
            }
            
            // Sayfalamayı göster
            const pagination = document.querySelector('.pagination');
            if (pagination) pagination.style.display = 'inline-flex';
            
            filteredProducts.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>
                        <img src="${product.imageUrl || '../img/shoe.png'}" alt="Ürün Görseli" width="40" height="40" style="object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>${product.name}</td>
                    <td>${product.categoryName || ''}</td>
                    <td>${product.price.toLocaleString('tr-TR')} TL</td>
                    <td>${product.size || 'N/A'}</td>
                    <td data-color="${product.color || ''}">${product.color || 'N/A'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-button edit-button" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                            <button class="action-button delete-button" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Event listenerları yeniden ekle
            this.attachProductEventListeners();
            
        } catch (error) {
            console.error('Arama hatası:', error);
            this.showToast('Ürünleri ararken bir hata oluştu', false);
        }
    }

    /**
     * DASHBOARD VERİLERİ
     */
    async loadDashboardData() {
        try {
            // Burada gerçek API çağrıları yapılacak
            // Örnek olarak kategoriler ve ürünleri yükle
            const categories = await apiService.getCategories();
            const products = await apiService.getProducts(0, 5); // Son 5 ürün
            
            // Dashboard istatistiklerini güncelle
            this.updateDashboardStats(categories.length, products.content.length);
            
        } catch (error) {
            console.error('Dashboard verilerini yükleme hatası:', error);
            this.showToast('Dashboard verilerini yüklerken bir hata oluştu', false);
        }
    }

    /**
     * Dashboard istatistiklerini günceller
     */
    updateDashboardStats(categoryCount, productCount) {
        const categoryCountEl = document.getElementById('categoryCount');
        const productCountEl = document.getElementById('productCount');
        
        if (categoryCountEl) categoryCountEl.textContent = categoryCount;
        if (productCountEl) productCountEl.textContent = productCount;
    }
}

// Sayfadaki DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    const adminUI = new AdminUI();
    adminUI.init();
    
    // Global erişim için
    window.adminUI = adminUI;
});

export default AdminUI;