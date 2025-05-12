// Get product ID from URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Fetch product data from API
async function fetchProductDetail() {
  const productId = getProductIdFromUrl();
  
  if (!productId) {
    console.error('No product ID found in URL');
    return;
  }
  
  try {
    console.log(`Fetching product ID: ${productId}`);
    const response = await fetch(`http://localhost:8080/api/urunler/${productId}`);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    
    const product = await response.json();
    console.log('Product data:', product);
    displayProductDetail(product);
    fetchSimilarProducts(product.categoryId);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    // Hata durumunda örnek ürün bilgilerini göster
    const defaultProduct = {
      id: productId,
      name: "Bordo Rengi Topuklu Ayakkabı",
      description: "Premium deri malzeme, ortopedik taban desteği",
      price: 1250,
      imageUrl: "/img/shoe.png"
    };
    displayProductDetail(defaultProduct);
  }
}

// Display product detail on page
function displayProductDetail(product) {
  // Update product title
  const titleElement = document.querySelector('h1.text-2xl.font-bold.text-gray-800');
  if (titleElement) {
    titleElement.textContent = product.name;
  }
  
  // Update product description if available
  const descriptionEl = document.querySelector('p.text-gray-600.mt-1');
  if (descriptionEl && product.description) {
    descriptionEl.textContent = product.description;
  }
  
  // Update product price
  const priceEl = document.querySelector('span.text-2xl.font-bold.text-gray-900');
  if (priceEl) {
    const price = product.price || 0;
    priceEl.textContent = `${price.toLocaleString('tr-TR')} TL`;
  }
  
  // Update product images
  const mainImage = document.querySelector('.product-img-container .product-img');
  if (mainImage) {
    mainImage.src = product.imageUrl || '/img/shoe.png';
    mainImage.alt = product.name;
  }
  
  // Update thumbnails
  const thumbnails = document.querySelectorAll('.thumbnail-container .product-img-container .product-img');
  thumbnails.forEach(thumbnail => {
    thumbnail.src = product.imageUrl || '/img/shoe.png';
    thumbnail.alt = product.name;
  });
  
  // Update product description in the detailed section
  const detailedDescriptionEl = document.querySelector('.mt-6.pb-6.border-b.border-gray-200 p');
  if (detailedDescriptionEl && product.description) {
    detailedDescriptionEl.innerHTML = product.description.split('\n').join('<br><br>');
  }
}

// Fetch similar products in the same category
async function fetchSimilarProducts(categoryId) {
  if (!categoryId) return;
  
  try {
    console.log(`Fetching similar products for category: ${categoryId}`);
    const response = await fetch(`http://localhost:8080/api/urunler/kategori/${categoryId}?page=0&size=4`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch similar products: ${response.status}`);
    }
    
    const data = await response.json();
    const products = data.content || [];
    console.log('Similar products:', products);
    displaySimilarProducts(products);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    // Hata durumunda benzer ürün örnekleri göster
    const defaultProducts = [];
    for (let i = 0; i < 4; i++) {
      defaultProducts.push({
        id: i + 1,
        name: "Bordo Rengi Topuklu Ayakkabı",
        price: 1250,
        imageUrl: "/img/shoe.png"
      });
    }
    displaySimilarProducts(defaultProducts);
  }
}

// Display similar products
function displaySimilarProducts(products) {
  const similarProductsContainer = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4.gap-4');
  
  if (!similarProductsContainer) return;
  
  similarProductsContainer.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'bg-white p-4 rounded-lg shadow cursor-pointer';
    
    const imageUrl = product.imageUrl || '/img/shoe.png';
    const price = product.price || 0;
    
    productCard.innerHTML = `
      <div class="h-60 bg-gray-200 rounded mb-2 product-img-container">
        <img src="${imageUrl}" alt="${product.name}" class="product-img">
      </div>
      <h3 class="font-medium">${product.name}</h3>
      <p class="text-gray-900 font-bold mt-1">${price.toLocaleString('tr-TR')} TL</p>
    `;
    
    // Add click event to navigate to product detail
    productCard.addEventListener('click', () => {
      window.location.href = `./productDetail.html?id=${product.id}`;
    });
    
    similarProductsContainer.appendChild(productCard);
  });
}

// Initialize page
document.addEventListener('DOMContentLoaded', fetchProductDetail); 