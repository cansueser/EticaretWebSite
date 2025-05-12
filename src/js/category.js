const BASE_URL = 'http://localhost:8080/api';
let currentPage = 0;
let selectedCategoryId = null;
const pageSize = 12; // 4x3 grid
let minPrice = 100;
let maxPrice = 3000;

// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
  // Kategorileri yükle
  loadCategories();
  
  // İlk yüklemede tüm ürünleri göster
  loadProducts(null, 0);
  
  // Sayfalama butonlarını ayarla
  setupPagination();

  // Fiyat filtresi için slider ayarla
  setupPriceFilter();
});

// Kategorileri yükleme fonksiyonu
async function loadCategories() {
  try {
    const response = await fetch(`${BASE_URL}/kategoriler`);
    if (!response.ok) {
      throw new Error('Kategoriler yüklenemedi');
    }
    
    const categories = await response.json();
    const categoryList = document.getElementById('category-list');
    
    // Önce "Tüm Kategoriler" seçeneğini ekle
    categoryList.innerHTML = `
      <li class="group category-item active" data-category-id="null">
        <div class="flex justify-between items-center cursor-pointer py-1">
          <span class="text-green-button group-hover:text-green-button font-medium">Tüm Kategoriler</span>
        </div>
      </li>
    `;
    
    // Diğer kategorileri ekle
    categories.forEach(category => {
      const li = document.createElement('li');
      li.className = 'group category-item';
      li.setAttribute('data-category-id', category.id);
      
      li.innerHTML = `
        <div class="flex justify-between items-center cursor-pointer py-1">
          <span class="group-hover:text-green-button font-medium">${category.name}</span>
        </div>
      `;
      
      categoryList.appendChild(li);
    });
    
    // Kategori tıklama olaylarını ekle
    setupCategoryClickEvents();
    
  } catch (error) {
    console.error('Kategoriler yüklenirken hata oluştu:', error);
    // Hata durumunda örnek kategoriler göster
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = `
      <li class="group category-item active" data-category-id="null">
        <div class="flex justify-between items-center cursor-pointer py-1">
          <span class="text-green-button group-hover:text-green-button font-medium">Tüm Kategoriler</span>
        </div>
      </li>
      <li class="group category-item" data-category-id="1">
        <div class="flex justify-between items-center cursor-pointer py-1">
          <span class="group-hover:text-green-button font-medium">Aksesuar</span>
        </div>
      </li>
      <li class="group category-item" data-category-id="2">
        <div class="flex justify-between items-center cursor-pointer py-1">
          <span class="group-hover:text-green-button font-medium">Elbiseler</span>
        </div>
      </li>
    `;
    
    setupCategoryClickEvents();
  }
}

// Ürünleri yükleme fonksiyonu
async function loadProducts(categoryId, page, applyPriceFilter = true) {
  currentPage = page;
  selectedCategoryId = categoryId;
  
  try {
    // API URL'i oluştur - kategori varsa kategori filtresi ekle
    let apiUrl = `${BASE_URL}/urunler?page=${page}&size=${pageSize}`;
    if (categoryId) {
      apiUrl = `${BASE_URL}/urunler/kategori/${categoryId}?page=${page}&size=${pageSize}`;
    }
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Ürünler yüklenemedi');
    }
    
    const data = await response.json();
    const productsContainer = document.getElementById('products-container');
    
    // Ürünleri temizle
    productsContainer.innerHTML = '';
    
    // Ürünleri filtrele ve ekle
    let filteredProducts = data.content;
    
    // Fiyat filtresini uygula
    if (applyPriceFilter) {
      filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price);
        return price >= minPrice && price <= maxPrice;
      });
    }
    
    // Filtrelenmiş ürünleri ekle
    filteredProducts.forEach(product => {
      productsContainer.innerHTML += createProductTemplate(product);
    });
    
    // Boş ürün göster (grid'in tamamlanması için)
    const remainingSlots = pageSize - filteredProducts.length;
    for (let i = 0; i < remainingSlots; i++) {
      productsContainer.innerHTML += `
        <div class="relative w-full h-full opacity-0">
          <!-- Boş slot -->
        </div>
      `;
    }
    
    // Sayfa durumunu güncelle ve toplam sayfa sayısını al
    // Filtrelenmiş ürünlere göre sayfalama yapmak daha karmaşık olacağından
    // burada basitlik için orijinal sayfalama bilgisi kullanılıyor
    updatePagination(data.currentPage, data.totalPages);
    
  } catch (error) {
    console.error('Ürünler yüklenirken hata oluştu:', error);
    // Hata durumunda örnek ürünler göster
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
      const defaultProduct = {
        name: "Bordo Rengi Topuklu Ayakkabı",
        price: 250,
        imageUrl: "/img/shoe.png",
        rating: 4
      };
      productsContainer.innerHTML += createProductTemplate(defaultProduct);
    }
    
    // Varsayılan sayfalama
    updatePagination(0, 5);
  }
}

// Fiyat filtresini ayarla
function setupPriceFilter() {
  const priceSlider = document.getElementById('price-slider');
  const minPriceDisplay = document.getElementById('min-price-display');
  const maxPriceDisplay = document.getElementById('max-price-display');
  
  // Slider değerini değiştirince fiyat aralığını güncelle
  priceSlider.addEventListener('input', function() {
    // Slider değeri yüzde olarak gelir (0-100)
    const sliderValue = parseInt(this.value);
    
    // Slider değerini fiyat aralığına dönüştür (100 TL - 3000 TL)
    const priceRange = 3000 - 100;
    const price = Math.round(100 + (sliderValue / 100) * priceRange);
    
    // Görüntülenen maksimum fiyatı güncelle
    maxPrice = price;
    maxPriceDisplay.textContent = `${maxPrice} TL`;
  });
  
  // Slider bırakıldığında ürünleri yeniden yükle
  priceSlider.addEventListener('change', function() {
    loadProducts(selectedCategoryId, 0, true);
  });
}

// Ürün template oluşturma fonksiyonu
function createProductTemplate(product) {
  // product.imageUrl yoksa varsayılan resmi kullan
  const imageUrl = product.imageUrl || '/img/shoe.png';
  
  // Yıldız rating'i oluştur (0-5 arasında)
  const rating = product.rating || Math.floor(Math.random() * 5) + 1;
  let ratingHtml = '';
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      ratingHtml += '<img src="/img/star.png" class="w-3 h-3" alt="Yıldız">';
    } else {
      ratingHtml += '<img src="/img/starEmpty.png" class="w-3 h-3" alt="Yıldız">';
    }
  }
  
  return `
    <div class="relative w-full h-full group">
      <img src="${imageUrl}" class="w-full h-72 hover:cursor-pointer object-cover">
      
      <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <img src="/img/favorite.png" class="w-6 h-6 hover:cursor-pointer hover:scale-110 transition-transform" alt="Favorilere ekle">
        <img src="/img/cartIcon.png" class="w-6 h-6 hover:cursor-pointer hover:scale-110 transition-transform" alt="Sepete ekle">
      </div>

      <div class="mt-2">
        <p class="text-[14px] font-medium">${product.name}</p>
      </div>
      <div>
        <p class="text-green-600 font-bold">${product.price} TL</p>
      </div>
      <div class="flex gap-1 mt-1">
        ${ratingHtml}
      </div>
    </div>
  `;
}

// Kategori tıklama olaylarını ayarla
function setupCategoryClickEvents() {
  const categoryItems = document.querySelectorAll('.category-item');
  
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      // Önce tüm active sınıflarını kaldır
      categoryItems.forEach(cat => {
        cat.classList.remove('active');
        cat.querySelector('span').classList.remove('text-green-button');
      });
      
      // Tıklanan öğeyi aktif olarak işaretle
      this.classList.add('active');
      this.querySelector('span').classList.add('text-green-button');
      
      // Kategori ID'sini al ve ürünleri yükle
      const categoryId = this.getAttribute('data-category-id');
      loadProducts(categoryId === 'null' ? null : categoryId, 0);
    });
  });
}

// Sayfalama sistemini ayarla
function setupPagination() {
  const paginationContainer = document.getElementById('pagination-container');
  
  // Sayfalama butonlarına tıklama olayları ekle (hali hazırda HTML'de varsa)
  paginationContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
      const action = e.target.getAttribute('data-action');
      
      if (action === 'next') {
        loadProducts(selectedCategoryId, currentPage + 1);
      } else if (action === 'prev') {
        if (currentPage > 0) {
          loadProducts(selectedCategoryId, currentPage - 1);
        }
      } else if (action === 'last') {
        const lastPage = parseInt(paginationContainer.getAttribute('data-total-pages')) - 1;
        loadProducts(selectedCategoryId, lastPage);
      } else if (action === 'first') {
        loadProducts(selectedCategoryId, 0);
      } else {
        // Sayfa numarasına tıklandı
        const pageNumber = parseInt(e.target.textContent) - 1;
        loadProducts(selectedCategoryId, pageNumber);
      }
    }
  });
}

// Sayfalama bilgisini güncelle
function updatePagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.setAttribute('data-total-pages', totalPages);
  
  let paginationHTML = '';
  
  // Sayfa 1 ekle (1-indexed gösterim)
  paginationHTML += `<button class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:text-green-button ${currentPage === 0 ? 'text-green-button' : ''}" data-action="first">1</button>`;
  
  // Toplam sayfa sayısı 5'ten azsa, tüm sayfaları göster
  if (totalPages <= 5) {
    for (let i = 1; i < totalPages; i++) {
      paginationHTML += `<button class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:text-green-button ${currentPage === i ? 'text-green-button' : ''}" data-action="page">${i + 1}</button>`;
    }
  } else {
    // Orta sayfalar
    const startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 4));
    const endPage = Math.min(startPage + 2, totalPages - 1);
    
    for (let i = startPage; i < endPage; i++) {
      paginationHTML += `<button class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:text-green-button ${currentPage === i ? 'text-green-button' : ''}" data-action="page">${i + 1}</button>`;
    }
    
    // "..." ve son sayfa
    paginationHTML += `<button class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:text-green-button" data-action="ellipsis">...</button>`;
    paginationHTML += `<button class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:text-green-button ${currentPage === totalPages - 1 ? 'text-green-button' : ''}" data-action="last">${totalPages}</button>`;
  }
  
  // Sonraki ve son sayfa butonları
  paginationHTML += `<button class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:text-green-button" data-action="next">></button>`;
  paginationHTML += `<button class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:text-green-button" data-action="last">>></button>`;
  
  paginationContainer.innerHTML = paginationHTML;
} 