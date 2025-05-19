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
  
  // Kart bilgileri formatlama
  setupCardFormatting();
  
  // Ödeme yap butonuna tıklama olayı
  const paymentButton = document.querySelector('button.w-full.bg-green-600');
  if (paymentButton) {
    paymentButton.addEventListener('click', function() {
      // Form validasyonu
      if (!validateCardForm()) {
        return;
      }
      
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
  
  // Kart formatlama ayarları
  function setupCardFormatting() {
    // Kart numarası formatlama
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', function(e) {
        // Sadece rakamları al
        let value = e.target.value.replace(/\D/g, '');
        
        // 16 karakterden uzunsa kısalt
        if (value.length > 16) {
          value = value.slice(0, 16);
        }
        
        // Her 4 rakamda bir boşluk ekle
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
          if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
          }
          formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
      });
    }
    
    // Son kullanma tarihi formatlama (AA/YY)
    const expiryDateInput = document.getElementById('expiry-date');
    if (expiryDateInput) {
      expiryDateInput.addEventListener('input', function(e) {
        // Sadece rakamları al
        let value = e.target.value.replace(/\D/g, '');
        
        // 4 karakterden uzunsa kısalt
        if (value.length > 4) {
          value = value.slice(0, 4);
        }
        
        // AA/YY formatı
        if (value.length > 2) {
          value = value.slice(0, 2) + '/' + value.slice(2);
        }
        
        e.target.value = value;
      });
    }
    
    // CVV - sadece 3 rakam
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
      cvvInput.addEventListener('input', function(e) {
        // Sadece rakamları al
        let value = e.target.value.replace(/\D/g, '');
        
        // 3 karakterden uzunsa kısalt
        if (value.length > 3) {
          value = value.slice(0, 3);
        }
        
        e.target.value = value;
      });
    }
  }
  
  // Kart bilgileri validasyonu
  function validateCardForm() {
    const cardName = document.getElementById('card-name');
    const cardNumber = document.getElementById('card-number');
    const expiryDate = document.getElementById('expiry-date');
    const cvv = document.getElementById('cvv');
    
    // Kart sahibi adı kontrolü
    if (!cardName || !cardName.value.trim()) {
      showMessage('Lütfen kart sahibinin adını giriniz', 'error');
      return false;
    }
    
    // Kart numarası kontrolü (boşluklar olmadan 16 rakam)
    if (!cardNumber || cardNumber.value.replace(/\s/g, '').length !== 16) {
      showMessage('Lütfen geçerli bir kart numarası giriniz', 'error');
      return false;
    }
    
    // Son kullanma tarihi kontrolü (AA/YY formatında)
    if (!expiryDate || !expiryDate.value.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
      showMessage('Lütfen geçerli bir son kullanma tarihi giriniz (AA/YY)', 'error');
      return false;
    }
    
    // CVV kontrolü (3 rakam)
    if (!cvv || !cvv.value.match(/^[0-9]{3}$/)) {
      showMessage('Lütfen geçerli bir CVV numarası giriniz', 'error');
      return false;
    }
    
    return true;
  }
  
  // Sipariş özeti toplamlarını güncelle
  function updateOrderSummary(total, discount) {
    const totalElement = document.querySelector('.lg\\:w-1\\/3 .flex.justify-between.text-lg.font-bold span:last-child');
    
    if (totalElement) {
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