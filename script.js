const products = {
  1: { name: "Coche Rojo", price: 49.99, stock: 10, colors: ["Rojo", "Azul", "Negro"] },
  2: { name: "Carrito Azul", price: 39.99, stock: 15, colors: ["Azul", "Verde", "Rosa"] },
  3: { name: "Triciclo Verde", price: 59.99, stock: 2, colors: ["Verde", "Amarillo", "Blanco"] },
  4: { name: "Scooter Amarillo", price: 29.99, stock: 12, colors: ["Amarillo", "Negro", "Rojo"] },
  5: { name: "Coche en Oferta", price: 39.99, stock: 5, colors: ["Rojo", "Azul"] },
  6: { name: "Scooter en Oferta", price: 24.99, stock: 7, colors: ["Amarillo", "Verde"] },
  7: { name: "Triciclo en Oferta", price: 49.99, stock: 1, colors: ["Verde", "Blanco"] }
};

// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Filtrado de productos por categoría
const categoryCards = document.querySelectorAll('.category-card');
const productCards = document.querySelectorAll('.product-card');
categoryCards.forEach(card => {
  card.addEventListener('click', () => {
    const category = card.getAttribute('data-category');
    productCards.forEach(product => {
      if (category === 'all' || product.getAttribute('data-category') === category) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  });
});

// Barra de búsqueda
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  productCards.forEach(product => {
    const name = product.querySelector('h3').textContent.toLowerCase();
    product.style.display = name.includes(query) ? 'block' : 'none';
  });
});
searchButton.addEventListener('click', () => {
  const query = searchInput.value.toLowerCase();
  productCards.forEach(product => {
    const name = product.querySelector('h3').textContent.toLowerCase();
    product.style.display = name.includes(query) ? 'block' : 'none';
  });
});

// Carrusel
const carouselInner = document.querySelector('.carousel-inner');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let currentIndex = 0;

function showSlide(index) {
  if (index >= carouselItems.length) currentIndex = 0;
  if (index < 0) currentIndex = carouselItems.length - 1;
  carouselItems.forEach(item => item.classList.remove('active'));
  carouselItems[currentIndex].classList.add('active');
  carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevBtn.addEventListener('click', () => {
  currentIndex--;
  showSlide(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex++;
  showSlide(currentIndex);
});

setInterval(() => {
  currentIndex++;
  showSlide(currentIndex);
}, 5000);

// Newsletter
const newsletterSubmit = document.querySelector('#newsletter-submit');
const newsletterEmail = document.querySelector('#newsletter-email');
const newsletterMessage = document.querySelector('#newsletter-message');
newsletterSubmit.addEventListener('click', () => {
  const email = newsletterEmail.value.trim();
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newsletterMessage.classList.remove('hidden', 'text-red-500');
    newsletterMessage.classList.add('text-green-500');
    newsletterMessage.textContent = '¡Gracias por suscribirte! Pronto recibirás nuestras novedades.';
    newsletterEmail.value = '';
  } else {
    newsletterMessage.classList.remove('hidden', 'text-green-500');
    newsletterMessage.classList.add('text-red-500');
    newsletterMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
  }
});

// Carrito y selección de color
const colorModal = document.querySelector('#color-modal');
const cartModal = document.querySelector('#cart-modal');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const selectProductButtons = document.querySelectorAll('.select-product');
const colorSelect = document.querySelector('#color-select');
const quantitySelect = document.querySelector('#quantity-select');
const addToCartButton = document.querySelector('#add-to-cart');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const cartCount = document.querySelector('#cart-count');
const whatsappOrder = document.querySelector('#whatsapp-order');
const whatsappFloating = document.querySelector('#whatsapp-floating');
const cartLink = document.querySelector('#cart-link');
const customerNameInput = document.querySelector('#customer-name');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProductId = null;

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.classList.toggle('hidden', totalItems === 0);
}

function showColorModal(productId) {
  currentProductId = productId;
  const product = products[productId];
  document.querySelector('#modal-product-name').textContent = product.name;
  document.querySelector('#modal-product-price').textContent = `$${product.price.toFixed(2)}`;
  document.querySelector('#modal-product-stock').textContent = `Disponible: ${product.stock}`;
  colorSelect.innerHTML = product.colors.map(color => `<option value="${color}">${color}</option>`).join('');
  quantitySelect.max = product.stock;
  quantitySelect.value = '1';
  colorModal.style.display = 'flex';
}

function showCartModal() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const product = products[item.productId];
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    cartItemsContainer.innerHTML += `
      <div class="flex justify-between items-center mb-2">
        <div>
          <p>${product.name} (${item.color})</p>
          <p class="text-sm text-gray-600">$${product.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div>
          <button class="remove-item text-red-500" data-product-id="${item.productId}" data-color="${item.color}">Eliminar</button>
        </div>
      </div>
    `;
  });
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartModal.style.display = 'flex';
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const color = button.getAttribute('data-color');
      cart = cart.filter(item => !(item.productId === productId && item.color === color));
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      showCartModal();
    });
  });
}

selectProductButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-product-id');
    showColorModal(productId);
  });
});

modalCloseButtons.forEach(button => {
  button.addEventListener('click', () => {
    colorModal.style.display = 'none';
    cartModal.style.display = 'none';
  });
});

addToCartButton.addEventListener('click', () => {
  const quantity = parseInt(quantitySelect.value);
  const product = products[currentProductId];
  if (quantity > product.stock) {
    alert('Cantidad excede los productos disponibles en stock');
    return;
  }
  const existingItem = cart.find(item => item.productId === currentProductId && item.color === colorSelect.value);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: currentProductId,
      color: colorSelect.value,
      quantity: quantity
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  colorModal.style.display = 'none';
  alert('Producto agregado al carrito');
});

cartLink.addEventListener('click', (e) => {
  e.preventDefault();
  showCartModal();
});

function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  const customerName = customerNameInput.value.trim() || 'Cliente';
  let message = `¡Hola! Soy ${customerName} y quiero hacer un pedido:\n`;
  let total = 0;
  cart.forEach(item => {
    const product = products[item.productId];
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    message += `${product.name} (${item.color}) - Cantidad: ${item.quantity} - $${itemTotal.toFixed(2)}\n`;
  });
  message += `Total: $${total.toFixed(2)}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '952296651'; // Reemplaza con tu número de WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

whatsappOrder.addEventListener('click', (e) => {
  e.preventDefault();
  sendOrderToWhatsApp();
});

whatsappFloating.addEventListener('click', (e) => {
  e.preventDefault();
  sendOrderToWhatsApp();
});

// Notificaciones de stock bajo
productCards.forEach(card => {
  const stockElement = card.querySelector('.stock');
  const stock = parseInt(stockElement.getAttribute('data-stock'));
  if (stock < 3) {
    card.querySelector('.stock-warning').classList.remove('hidden');
    card.querySelector('.stock-warning').textContent = `¡Solo ${stock} disponibles!`;
  }
});

// Botón Volver Arriba
const scrollTopButton = document.querySelector('#scroll-top');
window.addEventListener('scroll', () => {
  scrollTopButton.classList.toggle('hidden', window.scrollY < 200);
});

updateCartCount();