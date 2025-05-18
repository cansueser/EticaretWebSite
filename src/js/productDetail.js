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
  
  // Handle color and size display
  updateColorAndSizeInfo(product);
  
  // Setup quantity buttons
  setupQuantityButtons();
  
  // Setup add to cart button
  setupAddToCartButton(product);
  
  // Update product description in the detailed section with more detailed content
  updateDetailedDescription(product);
}

// Update color and size information
function updateColorAndSizeInfo(product) {
  // Get the container that will hold our color and size info
  const colorSizeContainer = document.querySelector('.mt-6.flex.gap-3');
  if (!colorSizeContainer) return;
  
  // Clear existing content
  colorSizeContainer.innerHTML = '';
  
  // Create a simple div to hold color and size info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'w-full';
  
  let infoHTML = '';
  
  // Add color info if available
  if (product.color) {
    infoHTML += `<p class="text-gray-700 mb-2"><span class="font-medium">Renk:</span> ${product.color}</p>`;
  }
  
  // Add size info if available
  if (product.size) {
    infoHTML += `<p class="text-gray-700"><span class="font-medium">Beden:</span> ${getSizeText(product.size)}</p>`;
  }
  
  // Set the HTML content
  infoDiv.innerHTML = infoHTML;
  
  // Add to the container
  colorSizeContainer.appendChild(infoDiv);
}

// Convert size number to text representation
function getSizeText(sizeNumber) {
  const sizeMap = {
    0: 'XS',
    1: 'S',
    2: 'M',
    3: 'L',
    4: 'XL',
    5: 'XXL'
  };
  return sizeMap[sizeNumber] || sizeNumber;
}

// Setup quantity buttons functionality
function setupQuantityButtons() {
  const decreaseBtn = document.querySelector('.flex.items-center.border.rounded-md button:first-child');
  const increaseBtn = document.querySelector('.flex.items-center.border.rounded-md button:last-child');
  const quantitySpan = document.querySelector('.flex.items-center.border.rounded-md span');
  
  if (!decreaseBtn || !increaseBtn || !quantitySpan) return;
  
  let quantity = 1;
  
  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantitySpan.textContent = quantity;
    }
  });
  
  increaseBtn.addEventListener('click', () => {
    quantity++;
    quantitySpan.textContent = quantity;
  });
}

// Setup add to cart button functionality
function setupAddToCartButton(product) {
  let addToCartBtn = document.querySelector('.add-to-cart-btn');
  
  if (!addToCartBtn) {
    // Buton bulunamadıysa, sepete ekle butonu oluştur
    const buttonsContainer = document.querySelector('.buttons-container');
    if (buttonsContainer) {
      const newBtn = document.createElement('button');
      newBtn.className = 'add-to-cart-btn bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700';
      newBtn.textContent = 'Sepete Ekle';
      buttonsContainer.appendChild(newBtn);
      addToCartBtn = newBtn;
    } else {
      return; // Buton eklenecek konteyner bulunamadı
    }
  }
  
  addToCartBtn.addEventListener('click', () => {
    // Mevcut sepeti localStorage'dan al
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ürün miktarını al
    const quantitySpan = document.querySelector('.flex.items-center.border.rounded-md span');
    const quantity = quantitySpan ? parseInt(quantitySpan.textContent) : 1;
    
    // Sepette aynı ürün var mı kontrol et
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Ürün zaten sepette, miktarı artır
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Ürünü sepete ekle
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        imageUrl: product.imageUrl || '/img/shoe.png',
        size: product.size || '',
        color: product.color || '',
        quantity: quantity
      });
    }
    
    // Sepeti localStorage'a kaydet
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Kullanıcıya bildirim göster
    alert('Ürün sepete eklendi!');
  });
}

// Update detailed product description with enhanced content
function updateDetailedDescription(product) {
  const detailedDescriptionEl = document.querySelector('.mt-6.pb-6.border-b.border-gray-200 p');
  if (!detailedDescriptionEl) return;
  
  // Basic description from product
  let descriptionHTML = product.description || '';
  
  // Add additional detailed information
  const additionalDetails = `
    <br><br><strong>Ürün Özellikleri:</strong><br><br>
    • Yüksek kaliteli malzemeler kullanılarak üretilmiştir<br>
    • Uzun ömürlü ve dayanıklı yapı<br>
    • Ergonomik tasarım ile maksimum konfor<br>
    • Modern ve şık görünüm<br>
    • Günlük kullanım için idealdir<br><br>
    
    <strong>Bakım Talimatları:</strong><br><br>
    • 30°C'de nazikçe yıkayınız<br>
    • Beyazlatıcı kullanmayınız<br>
    • Düşük ısıda ütüleyiniz<br>
    • Kuru temizleme yapmayınız<br>
    • Doğrudan güneş ışığından uzak tutunuz<br><br>
    
    <strong>Ürün Kodu:</strong> ${product.id || 'LT-' + Math.floor(Math.random() * 10000)}<br>
    <strong>Stok Durumu:</strong> ${product.stockQuantity || 'Stokta var'}<br>
    <strong>Garanti:</strong> 2 Yıl
  `;
  
  detailedDescriptionEl.innerHTML = descriptionHTML + additionalDetails;
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