// Payment sayfası için sipariş özeti işlemleri
document.addEventListener('DOMContentLoaded', function() {
  // Sepet öğelerini localStorage'dan al
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const couponDiscount = localStorage.getItem('couponDiscount') ? parseFloat(localStorage.getItem('couponDiscount')) : 0;
  const appliedCouponCode = localStorage.getItem('appliedCouponCode') || '';
  
  // Sipariş özeti konteynerini seç
  const orderSummaryContainer = document.querySelector('.lg\\:w-1\\/3 .space-y-3');
  const productContainer = document.querySelector('.lg\\:w-1\\/3 .border-b.border-gray-200.pb-4.mb-4 .space-y-3');
  
  if (orderSummaryContainer && productContainer) {
    // Sepet boşsa
    if (cart.length === 0) {
      productContainer.innerHTML = `
        <div class="flex justify-between text-gray-600">
          <span>Sepetinizde ürün bulunmamaktadır.</span>
          <span>0 TL</span>
        </div>
      `;
      
      // Toplamları güncelle
      updateOrderSummary(0, couponDiscount);
      return;
    }
    
    // Ürünleri ve toplamı hesapla
    let totalPrice = 0;
    productContainer.innerHTML = '';
    
    // Her ürün için bir satır ekle
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      
      const productRow = document.createElement('div');
      productRow.className = 'flex justify-between text-gray-600';
      productRow.innerHTML = `
        <span>${item.name} x ${item.quantity}</span>
        <span>${itemTotal.toLocaleString('tr-TR')} TL</span>
      `;
      
      productContainer.appendChild(productRow);
    });
    
    // Toplamları güncelle
    updateOrderSummary(totalPrice, couponDiscount);
  }
  
  // Ödeme yap butonuna tıklama olayı
  const paymentButton = document.querySelector('button.w-full.bg-green-600');
  if (paymentButton) {
    paymentButton.addEventListener('click', function() {
      // Sepeti temizle
      localStorage.removeItem('cart');
      localStorage.removeItem('couponDiscount');
      localStorage.removeItem('appliedCouponCode');
      
      // Başarılı ödeme mesajı göster
      showMessage('Ödemeniz başarıyla tamamlandı!', 'success');
      
      // 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    });
  }
  
  // Sipariş özeti toplamlarını güncelle
  function updateOrderSummary(total, discount) {
    const subtotalElement = document.querySelector('.lg\\:w-1\\/3 .space-y-3 div:first-child span:last-child');
    const totalElement = document.querySelector('.lg\\:w-1\\/3 .flex.justify-between.text-lg.font-bold span:last-child');
    
    if (subtotalElement && totalElement) {
      // Ara toplamı güncelle
      subtotalElement.textContent = `${total.toLocaleString('tr-TR')} TL`;
      
      // Kupon indirimi varsa göster
      let discountElement = document.querySelector('.coupon-discount-row');
      
      if (discount > 0 && !discountElement) {
        // Kupon indirimi satırı ekle
        const discountHTML = `
          <div class="flex justify-between coupon-discount-row">
            <span class="text-gray-700">Kupon İndirimi (${appliedCouponCode})</span>
            <span class="text-green-600 font-medium">-${discount.toLocaleString('tr-TR')} TL</span>
          </div>
        `;
        
        orderSummaryContainer.insertAdjacentHTML('beforeend', discountHTML);
      } else if (discount > 0 && discountElement) {
        // Mevcut kupon satırını güncelle
        const discountValueElement = discountElement.querySelector('span:last-child');
        if (discountValueElement) {
          discountValueElement.textContent = `-${discount.toLocaleString('tr-TR')} TL`;
        }
      }
      
      // Genel toplamı güncelle (indirimli)
      const finalTotal = Math.max(0, total - discount);
      totalElement.textContent = `${finalTotal.toLocaleString('tr-TR')} TL`;
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
}); 