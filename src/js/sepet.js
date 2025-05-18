// Sepet işlevselliği
document.addEventListener('DOMContentLoaded', function() {
  // Sepet öğelerini localStorage'dan al
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let couponDiscount = 0;
  
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
    const subtotalElement = document.querySelector('div.space-y-2.mb-3 div:nth-child(1) span:nth-child(2)');
    const totalElement = document.querySelector('div.border-t.pt-3 div span:nth-child(2)');
    
    // Kupon indirimi göster/gizle
    const discountRow = document.querySelector('.coupon-discount-row');
    if (!discountRow && couponDiscount > 0) {
      // Kupon indirimi satırı yoksa ve indirim varsa ekle
      const discountHTML = `
        <div class="flex justify-between coupon-discount-row">
          <span>Kupon İndirimi:</span>
          <span class="text-green-600">-${couponDiscount.toLocaleString('tr-TR')} TL</span>
        </div>
      `;
      
      const parentElement = document.querySelector('div.space-y-2.mb-3');
      if (parentElement) {
        parentElement.insertAdjacentHTML('beforeend', discountHTML);
      }
    } else if (discountRow && couponDiscount > 0) {
      // Kupon indirimi satırı var ve indirim varsa güncelle
      const discountValueElement = discountRow.querySelector('span:nth-child(2)');
      if (discountValueElement) {
        discountValueElement.textContent = `-${couponDiscount.toLocaleString('tr-TR')} TL`;
      }
    } else if (discountRow && couponDiscount === 0) {
      // Kupon indirimi satırı var ama indirim yoksa kaldır
      discountRow.remove();
    }
    
    // Sepet toplamını güncelle
    const finalTotal = Math.max(0, total - couponDiscount);
    
    if (subtotalElement) subtotalElement.textContent = `${total.toLocaleString('tr-TR')} TL`;
    if (totalElement) totalElement.textContent = `${finalTotal.toLocaleString('tr-TR')} TL`;
  }
  
  // Sepeti localStorage'a kaydet
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Butonlara tıklama olayları ekle
  const continueShoppingButton = document.querySelector('button.bg-white.text-green-600');
  const confirmCartButton = document.querySelector('button.bg-green-600.text-white');
  
  if (continueShoppingButton) {
    continueShoppingButton.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  if (confirmCartButton) {
    confirmCartButton.addEventListener('click', function() {
      // Sepeti temizle
      cart = [];
      couponDiscount = 0;
      saveCart();
      updateCart();
      
      // Sepet onaylandı mesajını göster
      const message = document.createElement('div');
      message.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg';
      message.textContent = 'Siparişiniz onaylandı!';
      document.body.appendChild(message);
      
      // Mesajı 3 saniye sonra kaldır
      setTimeout(() => {
        message.remove();
      }, 3000);
    });
  }
  
  // Kupon kodu uygulama butonu
  const applyCouponButton = document.querySelector('.bg-white.p-4.rounded-lg.border button');
  if (applyCouponButton) {
    applyCouponButton.addEventListener('click', function() {
      const couponInput = document.querySelector('.bg-white.p-4.rounded-lg.border input');
      if (couponInput && couponInput.value.trim() !== '') {
        // Örnek kupon kodları
        const coupons = {
          'INDIRIM10': 100,
          'INDIRIM20': 200,
          'INDIRIM30': 300,
          'INDIRIM50': 500
        };
        
        const couponCode = couponInput.value.trim().toUpperCase();
        if (coupons[couponCode]) {
          couponDiscount = coupons[couponCode];
          
          // Kupon başarı mesajını göster
          const feedbackSpan = document.createElement('span');
          feedbackSpan.className = 'text-green-600 text-sm block mt-2';
          feedbackSpan.textContent = 'Kupon uygulandı!';
          
          // Önceki feedback mesajını temizle
          const previousFeedback = couponInput.parentElement.querySelector('.text-green-600, .text-red-600');
          if (previousFeedback) previousFeedback.remove();
          
          couponInput.parentElement.appendChild(feedbackSpan);
          
          // Sepet toplamlarını güncelle
          const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          updateCartTotals(cartTotal, cart.length);
        } else {
          // Geçersiz kupon mesajını göster
          const feedbackSpan = document.createElement('span');
          feedbackSpan.className = 'text-red-600 text-sm block mt-2';
          feedbackSpan.textContent = 'Geçersiz kupon kodu!';
          
          // Önceki feedback mesajını temizle
          const previousFeedback = couponInput.parentElement.querySelector('.text-green-600, .text-red-600');
          if (previousFeedback) previousFeedback.remove();
          
          couponInput.parentElement.appendChild(feedbackSpan);
        }
      } else {
        // Kupon kodu boş mesajını göster
        const feedbackSpan = document.createElement('span');
        feedbackSpan.className = 'text-red-600 text-sm block mt-2';
        feedbackSpan.textContent = 'Lütfen bir kupon kodu girin!';
        
        // Önceki feedback mesajını temizle
        const previousFeedback = couponInput.parentElement.querySelector('.text-green-600, .text-red-600');
        if (previousFeedback) previousFeedback.remove();
        
        couponInput.parentElement.appendChild(feedbackSpan);
      }
    });
  }
}); 