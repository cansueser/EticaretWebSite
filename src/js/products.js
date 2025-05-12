const BASE_URL = 'http://localhost:8080/api';

// Ürün template'i oluşturan fonksiyon
function createProductTemplate(product) {
  // product.imageUrl yoksa varsayılan resmi kullan
  const imageUrl = product.imageUrl || '/img/shoe.png';
  
  // Yıldız rating'i oluştur (0-5 arasında)
  const rating = product.rating || Math.floor(Math.random() * 5) + 1; // Eğer rating yoksa random değer ata
  let ratingHtml = '';
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      ratingHtml += '<img src="/img/star.png" class="w-3 h-3" alt="Yıldız">';
    } else {
      ratingHtml += '<img src="/img/starEmpty.png" class="w-3 h-3" alt="Yıldız">';
    }
  }
  
  // Ürün kartı HTML'i
  const productElement = document.createElement('div');
  productElement.className = 'relative w-full h-full group';
  productElement.innerHTML = `
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
  `;
  
  // Ürüne tıklandığında ürün detay sayfasına yönlendir
  productElement.addEventListener('click', function() {
    console.log("Ürün tıklandı: ", product.id);
    window.location.href = `./productDetail.html?id=${product.id}`;
  });
  
  return productElement;
}

// En çok satan ürünleri getiren fonksiyon
async function getTopProducts() {
  try {
    const response = await fetch(`${BASE_URL}/urunler?page=0&size=4`);
    if (!response.ok) {
      throw new Error('API çağrısı başarısız oldu');
    }
    
    const data = await response.json();
    const topProductsContainer = document.getElementById('top-products');
    
    // İlk 4 ürünü göster
    data.content.forEach(product => {
      topProductsContainer.appendChild(createProductTemplate(product));
    });
  } catch (error) {
    console.error('Ürün verileri alınamadı:', error);
    // Hata durumunda örnek veriler göster
    const topProductsContainer = document.getElementById('top-products');
    for (let i = 0; i < 4; i++) {
      const defaultProduct = {
        id: i + 100,
        name: "Bordo Rengi Topuklu Ayakkabı",
        price: 250,
        imageUrl: "/img/shoe.png"
      };
      topProductsContainer.appendChild(createProductTemplate(defaultProduct));
    }
  }
}

// Öne çıkan ürünleri getiren fonksiyon
async function getFeaturedProducts() {
  try {
    const response = await fetch(`${BASE_URL}/urunler?page=0&size=10`);
    if (!response.ok) {
      throw new Error('API çağrısı başarısız oldu');
    }
    
    const data = await response.json();
    const featuredProductsContainer = document.getElementById('featured-products');
    
    // En fazla 10 ürün göster
    data.content.forEach(product => {
      featuredProductsContainer.appendChild(createProductTemplate(product));
    });
  } catch (error) {
    console.error('Ürün verileri alınamadı:', error);
    // Hata durumunda örnek veriler göster
    const featuredProductsContainer = document.getElementById('featured-products');
    for (let i = 0; i < 10; i++) {
      const defaultProduct = {
        id: i + 200,
        name: "Bordo Rengi Topuklu Ayakkabı",
        price: 250,
        imageUrl: "/img/shoe.png"
      };
      featuredProductsContainer.appendChild(createProductTemplate(defaultProduct));
    }
  }
}

// Sayfa yüklendiğinde ürünleri getir
window.onload = function() {
  getTopProducts();
  getFeaturedProducts();
}; 