// Global variables
let menuItems = [];
let cart = [];
let selectedCategory = 'promociones';
let currentProduct = null;

// Categories configuration
const categories = [
    { id: 'promociones', name: 'Promociones', color: 'from-yellow-500 to-orange-600', icon: '🔥' },
    { id: 'hamburguesas', name: 'Hamburguesas', color: 'from-red-600 to-red-700', icon: '🍔' },
    { id: 'snacks', name: 'Snacks', color: 'from-blue-800 to-blue-900', icon: '🍟' },
    { id: 'extras', name: 'Extras', color: 'from-gray-600 to-gray-700', icon: '🥗' },
    { id: 'sandwiches', name: 'Sandwiches', color: 'from-red-700 to-red-800', icon: '🥪' }
];

// Initial menu data
const initialMenuItems = [
    {
        id: "1",
        name: "CHEESE BURGER",
        description: "Jugosa hamburguesa de 6 onz con queso cheddar derretido, lechuga fresca y tomate",
        price: 160,
        category: "hamburguesas",
        available: true,
        image: "images/cheese-burger.jpg",
        isPromotion: false,
    },
    {
        id: "2",
        name: "BACON AND CHEESE",
        description: "La favorita de nuestros clientes, fue nuestra primera creación, la #1 en cuanto a calidad/precio",
        price: 180,
        category: "hamburguesas",
        available: true,
        image: "images/bacon-cheese.jpg",
        isPromotion: false,
    },
    {
        id: "3",
        name: "BACON AND CHEESESTICKS",
        description: "Si quieres algo más suculento, crujiente sin duda es tu opción ¡tanto queso te va enamorar!",
        price: 230,
        category: "hamburguesas",
        available: true,
        image: "images/bacon-cheesesticks.jpg",
        isPromotion: false,
    },
    {
        id: "4",
        name: "BURGER DOBLE XL",
        description: "La más grande de nuestro menú permanente, con 2 carnes, 2 tipos de quesos y mucho bacon",
        price: 280,
        category: "hamburguesas",
        available: true,
        image: "images/burger-doble-xl.jpg",
        isPromotion: false,
    },
    {
        id: "18",
        name: "CHILLI FRIES",
        description: "Porción doble de papas fritas bañadas con queso cheddar y chile con carne",
        price: 170,
        category: "snacks",
        available: true,
        image: "images/chilli-fries.jpg",
        isPromotion: false,
    },
    {
        id: "25",
        name: "ALITAS",
        description: "Alitas bañadas y empanizadas acompañadas de vegetales y papas",
        options: [
            { name: "6 und", price: 240 },
            { name: "9 und", price: 280 },
            { name: "12 und", price: 380 },
            { name: "18 und", price: 560 },
        ],
        price: 240,
        category: "snacks",
        available: true,
        sauces: true,
        image: "images/alitas.jpg",
        isPromotion: false,
    },
    {
        id: "32",
        name: "PAPA REGULAR",
        description: "Porción de papas fritas doradas y crujientes",
        price: 70,
        category: "extras",
        available: true,
        image: "images/papa-regular.jpg",
        isPromotion: false,
    },
    {
        id: "35",
        name: "CHICKEN SANDWICH",
        description: "Sándwich de pollo a la plancha con vegetales frescos, acompañado de papas fritas",
        price: 180,
        category: "sandwiches",
        available: true,
        image: "images/chicken-sandwich.jpg",
        isPromotion: false,
    },
    // Example promotion
    {
        id: "promo1",
        name: "COMBO ESPECIAL 2X1",
        description: "¡Oferta especial! Lleva 2 hamburguesas Cheese Burger por el precio de 1. Válido por tiempo limitado.",
        price: 160,
        category: "hamburguesas",
        available: true,
        image: "images/combo-especial.jpg",
        isPromotion: true,
        isNew: true,
    }
];

const sauces = [
    "Búfalo", "BBQ", "Sweet Chili", "Ajo Parmesano", "Blue Cheese",
    "Cheddar", "Spicy BBQ", "Teriyaki", "Honey Mustard", "Chipotle"
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();
    renderCategories();
    renderMenuItems();
    setupEventListeners();
    updateCartBadge();
});

// Load menu items from localStorage or use initial data
function loadMenuItems() {
    const savedItems = localStorage.getItem('burgerclub-menu');
    if (savedItems) {
        menuItems = JSON.parse(savedItems);
    } else {
        menuItems = initialMenuItems;
        localStorage.setItem('burgerclub-menu', JSON.stringify(menuItems));
    }
}

// Listen for storage changes (from admin panel)
window.addEventListener('storage', function(e) {
    if (e.key === 'burgerclub-menu') {
        loadMenuItems();
        renderMenuItems();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Cart button
    document.getElementById('cart-btn').addEventListener('click', openCart);
    
    // Modal close buttons
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('close-options').addEventListener('click', closeOptionsModal);
    
    // Modal background clicks
    document.getElementById('cart-modal').addEventListener('click', function(e) {
        if (e.target === this) closeCart();
    });
    
    document.getElementById('options-modal').addEventListener('click', function(e) {
        if (e.target === this) closeOptionsModal();
    });
    
    // WhatsApp button
    document.getElementById('whatsapp-btn').addEventListener('click', sendToWhatsApp);
    
    // Options modal buttons
    document.getElementById('cancel-options').addEventListener('click', closeOptionsModal);
    document.getElementById('add-to-cart').addEventListener('click', addSelectedToCart);
}

// Render category buttons
function renderCategories() {
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${selectedCategory === category.id ? 'active ' + category.id : ''}`;
        button.innerHTML = `
            <span>${category.icon}</span>
            <span>${category.name}</span>
        `;
        button.addEventListener('click', () => selectCategory(category.id));
        container.appendChild(button);
    });
}

// Select category
function selectCategory(categoryId) {
    selectedCategory = categoryId;
    renderCategories();
    renderMenuItems();
    renderCategoryBanner();
}

// Render category banner
function renderCategoryBanner() {
    const banner = document.getElementById('category-banner');
    const category = categories.find(c => c.id === selectedCategory);
    
    if (selectedCategory === 'promociones') {
        banner.innerHTML = `
            <h2>🔥 ¡OFERTAS ESPECIALES POR TIEMPO LIMITADO! 🔥</h2>
            <p>¡No te pierdas nuestras increíbles promociones!</p>
        `;
        banner.className = 'category-banner promociones';
        banner.style.display = 'block';
    } else if (selectedCategory === 'hamburguesas') {
        banner.innerHTML = `
            <h2>🍟 TODAS LAS HAMBURGUESAS INCLUYEN PAPAS FRITAS 🍟</h2>
            <p>¡Disfruta de nuestras deliciosas papas doradas con cada hamburguesa!</p>
        `;
        banner.className = 'category-banner hamburguesas';
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

// Render menu items
function renderMenuItems() {
    const container = document.getElementById('menu-grid');
    const emptyState = document.getElementById('empty-state');
    
    let filteredItems;
    if (selectedCategory === 'promociones') {
        filteredItems = menuItems.filter(item => item.isPromotion && item.available);
    } else {
        filteredItems = menuItems.filter(item => item.category === selectedCategory);
    }
    
    if (filteredItems.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        
        if (selectedCategory === 'promociones') {
            emptyState.innerHTML = `
                <div class="empty-icon">🔥</div>
                <h3 class="empty-title">No hay promociones activas</h3>
                <p class="empty-text">¡Pronto tendremos ofertas increíbles!</p>
            `;
        } else {
            emptyState.innerHTML = `
                <div class="empty-icon">🍽️</div>
                <h3 class="empty-title">No hay productos en esta categoría</h3>
                <p class="empty-text">¡Pronto agregaremos más opciones deliciosas!</p>
            `;
        }
    } else {
        container.style.display = 'grid';
        emptyState.style.display = 'none';
        
        container.innerHTML = '';
        filteredItems.forEach(item => {
            const itemElement = createMenuItemElement(item);
            container.appendChild(itemElement);
        });
    }
    
    renderCategoryBanner();
}

// Create menu item element
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = `menu-item ${item.isPromotion ? 'promotion' : ''}`;
    
    const badges = [];
    if (item.isPromotion) badges.push('<div class="badge promotion">🔥 PROMO</div>');
    if (item.isNew && !item.isPromotion) badges.push('<div class="badge new">¡NUEVO!</div>');
    if (!item.available) badges.push('<div class="badge unavailable">AGOTADO</div>');
    
    const includesBadge = item.category === 'hamburguesas' ? 
        '<div class="includes-badge">INCLUYE PAPAS</div>' : '';
    
    div.innerHTML = `
        <div class="menu-item-image">
            <div class="image-placeholder">
                <div class="placeholder-icon">🍔</div>
                <div class="placeholder-text">${item.name}</div>
            </div>
            <div class="price-badge ${item.isPromotion ? 'promotion' : ''}">
                C$ ${item.price}
            </div>
            <div class="item-badges">
                ${badges.join('')}
            </div>
            ${!item.available ? '<div class="unavailable-overlay"></div>' : ''}
        </div>
        <div class="menu-item-content">
            <h3 class="menu-item-title">${item.name}</h3>
            <p class="menu-item-description">${item.description}</p>
            ${includesBadge}
            ${item.available ? `
                <button class="add-to-cart-btn ${item.isPromotion ? 'promotion' : ''}" onclick="handleAddToCart('${item.id}')">
                    <i class="fas fa-plus"></i>
                    ${item.isPromotion ? '¡Aprovechar Oferta!' : 'Agregar al Carrito'}
                </button>
            ` : ''}
        </div>
    `;
    
    return div;
}

// Handle add to cart
function handleAddToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    // If item has options or sauces, show options modal
    if (item.options || item.sauces) {
        showOptionsModal(item);
    } else {
        addToCart(item);
    }
}

// Show options modal
function showOptionsModal(item) {
    currentProduct = item;
    const modal = document.getElementById('options-modal');
    const title = document.getElementById('options-title');
    const content = document.getElementById('options-content');
    
    title.textContent = item.name;
    
    let html = '';
    
    // Product image placeholder
    html += `
        <div class="product-image-placeholder">
            <div class="image-icon">📷</div>
        </div>
    `;
    
    // Product description
    html += `
        <div class="product-description">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        </div>
    `;
    
    // Options
    if (item.options) {
        html += `
            <div class="option-group">
                <label class="option-label">Selecciona una opción:</label>
                <div class="option-selector">
                    <select id="option-select" class="option-dropdown">
                        <option value="" disabled selected>Elige una opción</option>
                        ${item.options.map(option => `
                            <option value="${option.name}" data-price="${option.price}">
                                ${option.name} - C$${option.price}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
        `;
    }
    
    // Sauces button
    if (item.sauces) {
        html += `
            <div class="sauces-section">
                <button type="button" class="sauces-btn" id="sauces-btn">
                    Agregar Salsas (0)
                </button>
                <div class="sauces-panel" id="sauces-panel" style="display: none;">
                    <div class="sauces-header">
                        <h4>Ocultar Salsas (0)</h4>
                    </div>
                    <div class="sauces-grid">
                        ${sauces.map(sauce => `
                            <label class="sauce-item">
                                <input type="checkbox" name="sauce" value="${sauce}">
                                <span>${sauce}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    content.innerHTML = html;
    modal.classList.add('active');
    
    // Setup sauces functionality
    if (item.sauces) {
        setupSaucesFunctionality();
    }
}

// Setup sauces functionality
function setupSaucesFunctionality() {
    const saucesBtn = document.getElementById('sauces-btn');
    const saucesPanel = document.getElementById('sauces-panel');
    const saucesHeader = document.querySelector('.sauces-header h4');
    const sauceCheckboxes = document.querySelectorAll('input[name="sauce"]');
    
    let selectedSaucesCount = 0;
    
    // Toggle sauces panel
    saucesBtn.addEventListener('click', () => {
        const isVisible = saucesPanel.style.display !== 'none';
        saucesPanel.style.display = isVisible ? 'none' : 'block';
        saucesBtn.textContent = isVisible ? 'Agregar Salsas (0)' : 'Ocultar Salsas (' + selectedSaucesCount + ')';
    });
    
    // Update sauces count
    sauceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            selectedSaucesCount = document.querySelectorAll('input[name="sauce"]:checked').length;
            saucesBtn.textContent = `Agregar Salsas (${selectedSaucesCount})`;
            saucesHeader.textContent = `Ocultar Salsas (${selectedSaucesCount})`;
        });
    });
}

// Add selected options to cart
function addSelectedToCart() {
    if (!currentProduct) return;
    
    let selectedOption = null;
    let selectedSauces = [];
    let price = currentProduct.price;
    
    // Get selected option
    if (currentProduct.options) {
        const optionSelect = document.getElementById('option-select');
        if (!optionSelect.value) {
            showToast('Por favor selecciona una opción', 'error');
            return;
        }
        selectedOption = optionSelect.value;
        const selectedOptionElement = optionSelect.querySelector(`option[value="${selectedOption}"]`);
        price = parseFloat(selectedOptionElement.dataset.price);
    }
    
    // Get selected sauces
    if (currentProduct.sauces) {
        const sauceInputs = document.querySelectorAll('input[name="sauce"]:checked');
        selectedSauces = Array.from(sauceInputs).map(input => input.value);
    }
    
    addToCart(currentProduct, selectedOption, selectedSauces, price);
    closeOptionsModal();
}

// Add item to cart
function addToCart(item, selectedOption = null, selectedSauces = [], customPrice = null) {
    const price = customPrice || item.price;
    
    // Check if item already exists in cart with same options
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id &&
        cartItem.selectedOption === selectedOption &&
        JSON.stringify(cartItem.selectedSauces) === JSON.stringify(selectedSauces)
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        showToast(`✨ ${item.name} agregado al carrito (${cart[existingItemIndex].quantity})`);
    } else {
        const cartItem = {
            ...item,
            quantity: 1,
            selectedOption,
            selectedSauces,
            price
        };
        cart.push(cartItem);
        showToast(`🎉 ${item.name} agregado al carrito`);
    }
    
    updateCartBadge();
    renderCartItems();
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const uniqueItems = cart.length;
    badge.textContent = uniqueItems;
    badge.style.display = uniqueItems > 0 ? 'flex' : 'none';
}

// Open cart modal
function openCart() {
    const modal = document.getElementById('cart-modal');
    renderCartItems();
    modal.classList.add('active');
}

// Close cart modal
function closeCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('active');
}

// Close options modal
function closeOptionsModal() {
    const modal = document.getElementById('options-modal');
    modal.classList.remove('active');
    currentProduct = null;
}

// Render cart items
function renderCartItems() {
    const container = document.getElementById('cart-items');
    const emptyState = document.getElementById('cart-empty');
    const totalSection = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        totalSection.style.display = 'none';
    } else {
        container.style.display = 'block';
        emptyState.style.display = 'none';
        totalSection.style.display = 'block';
        
        container.innerHTML = '';
        cart.forEach((item, index) => {
            const itemElement = createCartItemElement(item, index);
            container.appendChild(itemElement);
        });
        
        updateCartTotal();
    }
}

// Create cart item element
function createCartItemElement(item, index) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    const details = [];
    if (item.selectedOption) details.push(`Opción: ${item.selectedOption}`);
    if (item.selectedSauces && item.selectedSauces.length > 0) {
        details.push(`Salsas: ${item.selectedSauces.join(', ')}`);
    }
    
    div.innerHTML = `
        <div class="cart-item-header">
            <h4 class="cart-item-name">${item.name}</h4>
        </div>
        ${details.length > 0 ? `<div class="cart-item-details">${details.join(' • ')}</div>` : ''}
        <div class="cart-item-controls">
            <div class="cart-item-price">C$${item.price}</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity === 0) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        showToast(`🗑️ ${removedItem.name} eliminado del carrito`, 'info');
    } else {
        cart[index].quantity = newQuantity;
    }
    
    updateCartBadge();
    renderCartItems();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-amount').textContent = `C$${total}`;
}

// Send order to WhatsApp
function sendToWhatsApp() {
    const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let message = `🍔 *PEDIDO THE BURGER CLUB* 🍔\n`;
    message += `📅 *Fecha:* ${currentDate}\n`;
    message += `🌐 *Pedido desde:* Página Web\n\n`;
    message += `📋 *DETALLES DEL PEDIDO:*\n\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        if (item.selectedOption) {
            message += `   Opción: ${item.selectedOption}\n`;
        }
        if (item.selectedSauces && item.selectedSauces.length > 0) {
            message += `   Salsas: ${item.selectedSauces.join(', ')}\n`;
        }
        message += `   Cantidad: ${item.quantity} - C$${item.price * item.quantity}\n\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `💰 *TOTAL A PAGAR: C$${total}*\n\n`;
    message += `📍 Granada, Nicaragua\n`;
    message += `📞 8151 2492\n\n`;
    message += `¡Gracias por tu pedido! 🎉`;
    
    try {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/50581512492?text=${encodedMessage}`;
        
        // Verificar si la URL es demasiado larga
        if (whatsappUrl.length > 2048) {
            // Si es muy larga, usar un mensaje más corto
            let shortMessage = `🍔 *PEDIDO THE BURGER CLUB*\n\n`;
            cart.forEach((item, index) => {
                shortMessage += `${index + 1}. ${item.name} x${item.quantity} - C$${item.price * item.quantity}\n`;
            });
            shortMessage += `\n💰 *TOTAL: C$${total}*\n`;
            shortMessage += `📍 Granada, Nicaragua`;
            
            const shortUrl = `https://wa.me/50581512492?text=${encodeURIComponent(shortMessage)}`;
            window.open(shortUrl, '_blank');
        } else {
            window.open(whatsappUrl, '_blank');
        }
        
        showToast('📱 Pedido enviado a WhatsApp', 'success');
    } catch (error) {
        console.error('Error al abrir WhatsApp:', error);
        showToast('❌ Error al abrir WhatsApp', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="toast-icon ${icon}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}