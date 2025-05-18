// Sepet işlevselliği
document.addEventListener('DOMContentLoaded', function() {
  // Sepet öğelerini localStorage'dan al
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Sepeti güncelle
  updateCart();
  
  // Sepeti güncelleme fonksiyonu
  function updateCart() {
    const cartItemsContainer = document.querySelector('tbody');
    
    // Sepet boşsa
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <tr>
          <td colspan="6" class="p-5 text-center">Sepetinizde ürün bulunmamaktadır.</td>
        </tr>
      `;
      updateCartTotals(0, 0);
      return;
    }
    
    // Sepeti temizle ve ürünleri ekle
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      
      const row = document.createElement('tr');
      row.className = 'border-b border-gray-200';
      row.innerHTML = `
        <td class="p-3 flex items-center border-l border-gray-200">
          <img src="${item.imageUrl}" alt="${item.name}" class="w-12 h-12 mr-4">
          <span>${item.name}</span>
        </td>
        <td class="p-3 border border-gray-200 text-center">
          <div>Beden: ${item.size || 'N/A'}</div>
          <div>Renk: ${item.color || 'N/A'}</div>
        </td>
        <td class="p-3 border border-gray-200 text-center">
          <div class="flex items-center justify-center">
            <button class="px-2 border rounded decrease-quantity" data-index="${index}">-</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="px-2 border rounded increase-quantity" data-index="${index}">+</button>
          </div>
        </td>
        <td class="p-3 border border-gray-200 text-center">${item.price.toLocaleString('tr-TR')} TL</td>
        <td class="p-3 border border-gray-200 text-center">${itemTotal.toLocaleString('tr-TR')} TL</td>
        <td class="p-3 text-red-500 cursor-pointer text-center border border-gray-200 remove-item" data-index="${index}">✕</td>
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
    
    if (subtotalElement) subtotalElement.textContent = `${total.toLocaleString('tr-TR')} TL`;
    if (totalElement) totalElement.textContent = `${total.toLocaleString('tr-TR')} TL`;
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
      alert('Siparişiniz onaylandı! Teşekkür ederiz.');
      // Sepeti temizle
      cart = [];
      saveCart();
      updateCart();
    });
  }
  
  // Kupon kodu uygulama butonu
  const applyCouponButton = document.querySelector('.bg-white.p-4.rounded-lg.border button');
  if (applyCouponButton) {
    applyCouponButton.addEventListener('click', function() {
      const couponInput = document.querySelector('.bg-white.p-4.rounded-lg.border input');
      if (couponInput && couponInput.value.trim() !== '') {
        alert('Kupon kodu uygulandı!');
      } else {
        alert('Lütfen bir kupon kodu girin.');
      }
    });
  }
}); 