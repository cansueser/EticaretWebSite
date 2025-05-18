// Sepet işlevselliği
document.addEventListener('DOMContentLoaded', function() {
  // Sepet öğelerini localStorage'dan al
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let couponDiscount = 0;
  let appliedCouponCode = ''; // Uygulanan kupon kodunu sakla
  
  // Sepeti güncelle
  updateCart();
  
  // Sepeti güncelleme fonksiyonu
  function updateCart() {
    const cartItemsContainer = document.querySelector('tbody');
    const tableContainer = document.querySelector('.overflow-x-auto');
    
    // Sepet boşsa
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <tr>
          <td colspan="6" class="p-4 text-center">Sepetinizde ürün bulunmamaktadır.</td>
        </tr>
      `;
      // Konteyner yüksekliğini küçült
      tableContainer.style.maxHeight = '100px';
      updateCartTotals(0, 0);
      return;
    }
    
    // Sepeti temizle ve ürünleri ekle
    cartItemsContainer.innerHTML = '';
    
    // Sepet dolu ise uygun yüksekliği ayarla (her ürün için yaklaşık 80px)
    const calculatedHeight = Math.min(800, Math.max(200, cart.length * 80 + 80)); // başlık için 80px ekstra
    tableContainer.style.maxHeight = `${calculatedHeight}px`;
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      
      const row = document.createElement('tr');
      row.className = 'border-b border-gray-200 hover:bg-gray-50';
      row.innerHTML = `
        <td class="px-3 py-4 flex items-center border-l border-gray-200">
          <img src="${item.imageUrl}" alt="${item.name}" class="w-14 h-14 mr-4">
          <span class="text-base">${item.name}</span>
        </td>
        <td class="px-3 py-4 border border-gray-200 text-center text-base">
          <div>Beden: ${item.size || 'N/A'}</div>
          <div>Renk: ${item.color || 'N/A'}</div>
        </td>
        <td class="px-3 py-4 border border-gray-200 text-center">
          <div class="flex items-center justify-center">
            <button class="px-2 py-1 border rounded text-base decrease-quantity" data-index="${index}">-</button>
            <span class="mx-3 text-base">${item.quantity}</span>
            <button class="px-2 py-1 border rounded text-base increase-quantity" data-index="${index}">+</button>
          </div>
        </td>
        <td class="px-3 py-4 border border-gray-200 text-center text-base">${item.price.toLocaleString('tr-TR')} TL</td>
        <td class="px-3 py-4 border border-gray-200 text-center text-base">${itemTotal.toLocaleString('tr-TR')} TL</td>
        <td class="px-3 py-4 text-red-500 cursor-pointer text-center border border-gray-200 remove-item text-lg font-bold" data-index="${index}">✕</td>
      `;
      
      cartItemsContainer.appendChild(row);
    });
    
    // Adet arttırma butonlarına tıklama olayı ekle
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart[index].quantity += 1;
        saveCart();
        updateCart();
      });
    });
    
    // Adet azaltma butonlarına tıklama olayı ekle
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          saveCart();
          updateCart();
        }
      });
    });
    
    // Ürün silme butonlarına tıklama olayı ekle
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart.splice(index, 1);
        saveCart();
        updateCart();
      });
    });
    
    // Toplam fiyatı güncelle
    updateCartTotals(totalPrice, cart.length);
  }
  
  // Sepet toplamlarını güncelle
  function updateCartTotals(total, itemCount) {
    // Direkt olarak HTML elementlerini seçelim
    const subtotalElement = document.querySelector('.space-y-3.mb-3.text-base div:first-child span:last-child');
    const totalElement = document.querySelector('.border-t.pt-3 div span:last-child');
    
    // Kupon indirimi göster/gizle
    const discountRow = document.querySelector('.coupon-discount-row');
    if (!discountRow && couponDiscount > 0) {
      // Kupon indirimi satırı yoksa ve indirim varsa ekle
      const discountHTML = `
        <div class="flex justify-between coupon-discount-row">
          <span>Kupon İndirimi (${appliedCouponCode}):</span>
          <span class="text-green-600">-${couponDiscount.toLocaleString('tr-TR')} TL</span>
        </div>
      `;
      
      const parentElement = document.querySelector('.space-y-3.mb-3.text-base');
      if (parentElement) {
        parentElement.insertAdjacentHTML('beforeend', discountHTML);
      }
    } else if (discountRow && couponDiscount > 0) {
      // Kupon indirimi satırı var ve indirim varsa güncelle
      const discountNameElement = discountRow.querySelector('span:first-child');
      const discountValueElement = discountRow.querySelector('span:last-child');
      if (discountNameElement && discountValueElement) {
        discountNameElement.textContent = `Kupon İndirimi (${appliedCouponCode}):`;
        discountValueElement.textContent = `-${couponDiscount.toLocaleString('tr-TR')} TL`;
      }
    } else if (discountRow && couponDiscount === 0) {
      // Kupon indirimi satırı var ama indirim yoksa kaldır
      discountRow.remove();
    }
    
    // Sepet toplamını güncelle
    const finalTotal = Math.max(0, total - couponDiscount);
    
    // Toplam değerlerini güncelle
    if (subtotalElement) {
      subtotalElement.textContent = `${total.toLocaleString('tr-TR')} TL`;
      console.log('Ara toplam güncellendi:', subtotalElement.textContent);
    } else {
      console.error('Ara toplam elementi bulunamadı!');
    }
    
    if (totalElement) {
      totalElement.textContent = `${finalTotal.toLocaleString('tr-TR')} TL`;
      console.log('Toplam güncellendi:', totalElement.textContent);
    } else {
      console.error('Toplam elementi bulunamadı!');
    }
  }
  
  // Kupon kodunu doğrula
  async function validateCoupon(couponCode) {
    try {
      // Kupon kodu boş ise hata göster
      if (!couponCode.trim()) {
        showMessage('Lütfen bir kupon kodu girin', 'error');
        return false;
      }
      
      // API'den kupon doğrulama
      const response = await fetch(`http://localhost:8080/api/kuponlar/dogrula/${couponCode}`);
      const data = await response.json();
      
      if (response.ok && data.valid) {
        // Kupon geçerli
        couponDiscount = data.discountValue || 0;
        appliedCouponCode = couponCode;
        
        // Kupon bilgilerini localStorage'a kaydet
        localStorage.setItem('couponDiscount', couponDiscount);
        localStorage.setItem('appliedCouponCode', appliedCouponCode);
        
        showMessage('Kupon başarıyla uygulandı', 'success');
        
        // Sepet toplamını güncelle
        const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        updateCartTotals(cartTotalPrice, cart.length);
        return true;
      } else {
        // Kupon geçersiz
        showMessage(data.message || 'Geçersiz kupon kodu', 'error');
        return false;
      }
    } catch (error) {
      console.error('Kupon doğrulanırken hata:', error);
      
      // Gerçek API çalışmıyorsa mock response kullan
      // Test amaçlı bazı kupon kodlarını kabul et
      if (couponCode === 'YENIUYE20') {
        couponDiscount = 20;
        appliedCouponCode = couponCode;
        
        // Kupon bilgilerini localStorage'a kaydet
        localStorage.setItem('couponDiscount', couponDiscount);
        localStorage.setItem('appliedCouponCode', appliedCouponCode);
        
        showMessage('Kupon başarıyla uygulandı', 'success');
        
        // Sepet toplamını güncelle
        const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        updateCartTotals(cartTotalPrice, cart.length);
        return true;
      } else if (couponCode === 'YENIUYE25') {
        couponDiscount = 25;
        appliedCouponCode = couponCode;
        
        // Kupon bilgilerini localStorage'a kaydet
        localStorage.setItem('couponDiscount', couponDiscount);
        localStorage.setItem('appliedCouponCode', appliedCouponCode);
        
        showMessage('Kupon başarıyla uygulandı', 'success');
        
        // Sepet toplamını güncelle
        const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        updateCartTotals(cartTotalPrice, cart.length);
        return true;
      } else {
        showMessage('Geçersiz kupon kodu', 'error');
        return false;
      }
    }
  }
  
  // Mesaj gösterme fonksiyonu
  function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
  
  // Sepeti localStorage'a kaydet
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Butonlara tıklama olayları ekle
  const continueShoppingButton = document.querySelector('button.bg-white.text-green-600');
  const confirmCartButton = document.querySelector('button.bg-green-600.text-white:not(.bg-white.p-4.rounded-lg.border button)');
  
  if (continueShoppingButton) {
    continueShoppingButton.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  if (confirmCartButton) {
    confirmCartButton.addEventListener('click', function() {
      // Sepet boşsa işlem yapma
      if (cart.length === 0) {
        showMessage('Sepetinizde ürün bulunmamaktadır!', 'error');
        return;
      }
      
      // Sepeti onaylayıp ödeme sayfasına yönlendir
      window.location.href = 'payment.html';
    });
  }
  
  // Kupon kodu uygulama butonu
  const applyCouponButton = document.querySelector('.bg-white.p-4.rounded-lg.border button');
  const couponInput = document.querySelector('.bg-white.p-4.rounded-lg.border input');
  
  if (applyCouponButton && couponInput) {
    applyCouponButton.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Kupon kodunu doğrula
      const couponCode = couponInput.value;
      await validateCoupon(couponCode);
    });
    
    // Enter tuşuna basıldığında da kupon uygula
    couponInput.addEventListener('keypress', async function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const couponCode = couponInput.value;
        await validateCoupon(couponCode);
      }
    });
  }
}); 