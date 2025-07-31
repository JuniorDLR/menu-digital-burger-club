// Global variables
let products = [];
let adminAccount = null;
let isAuthenticated = false;
let editingProduct = null;
let productToDelete = null;

// Categories configuration
const categories = [
    { id: 'promociones', name: 'Promociones', icon: '🔥' },
    { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔' },
    { id: 'snacks', name: 'Snacks', icon: '🍟' },
    { id: 'extras', name: 'Extras', icon: '🥗' },
    { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' }
];

// Initial products data
const initialProducts = [
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
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadAdminAccount();
    loadProducts();
    setupEventListeners();
    checkAuthState();
});

// Load admin account from localStorage
function loadAdminAccount() {
    const savedAccount = localStorage.getItem('burgerclub-admin');
    if (savedAccount) {
        adminAccount = JSON.parse(savedAccount);
        updateAdminInfo();
    } else {
        showRegisterScreen();
    }
}

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('burgerclub-menu');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = initialProducts;
        saveProducts();
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('burgerclub-menu', JSON.stringify(products));
    window.dispatchEvent(new Event('storage'));
}

// Setup event listeners
function setupEventListeners() {
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Add product form
    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);
    
    // Edit product form
    document.getElementById('edit-product-form').addEventListener('submit', handleEditProduct);
    
    // Profile form
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    
    // Password form
    document.getElementById('password-form').addEventListener('submit', handlePasswordChange);
    
    // Image upload handlers
    document.getElementById('product-image').addEventListener('change', (e) => handleImageUpload(e, 'image-preview'));
    document.getElementById('edit-product-image').addEventListener('change', (e) => handleImageUpload(e, 'edit-image-preview'));
    
    // Modal close buttons
    document.getElementById('close-edit').addEventListener('click', closeEditModal);
    document.getElementById('close-delete').addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    
    // Modal background clicks
    document.getElementById('edit-modal').addEventListener('click', function(e) {
        if (e.target === this) closeEditModal();
    });
    
    document.getElementById('delete-modal').addEventListener('click', function(e) {
        if (e.target === this) closeDeleteModal();
    });
}

// Check authentication state
function checkAuthState() {
    if (!adminAccount) {
        showRegisterScreen();
    } else if (!isAuthenticated) {
        showLoginScreen();
    } else {
        showAdminPanel();
    }
}

// Show register screen
function showRegisterScreen() {
    document.getElementById('register-screen').style.display = 'flex';
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
}

// Show login screen
function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'none';
    
    updateCurrentUser();
    renderProducts();
    updateStatistics();
    loadProfileData();
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    adminAccount = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('burgerclub-admin', JSON.stringify(adminAccount));
    updateAdminInfo();
    alert('¡Cuenta de administrador creada exitosamente!');
    showLoginScreen();
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (adminAccount && email === adminAccount.email && password === adminAccount.password) {
        isAuthenticated = true;
        showAdminPanel();
    } else {
        alert('Credenciales incorrectas');
    }
}

// Handle logout
function handleLogout() {
    isAuthenticated = false;
    showLoginScreen();
}

// Update admin info in login screen
function updateAdminInfo() {
    // Función eliminada por seguridad - no mostrar información personal
}

// Update current user in admin panel
function updateCurrentUser() {
    if (adminAccount) {
        document.getElementById('current-user').textContent = adminAccount.name;
    }
}

// Switch tabs
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Refresh content based on tab
    if (tabId === 'products') {
        renderProducts();
    } else if (tabId === 'stats') {
        updateStatistics();
    }
}

// Handle add product
function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const category = document.getElementById('product-category').value;
    const available = document.getElementById('product-available').checked;
    const isNew = document.getElementById('product-new').checked;
    const isPromotion = document.getElementById('product-promotion').checked;
    const imageFile = document.getElementById('product-image').files[0];
    
    if (!name || !price) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    const product = {
        id: Date.now().toString(),
        name: name.toUpperCase(),
        description,
        price,
        category,
        available,
        isNew,
        isPromotion,
        image: imageFile ? `images/${name.toLowerCase().replace(/\s+/g, '-')}.jpg` : 'images/placeholder.jpg'
    };
    
    products.push(product);
    saveProducts();
    
    // Reset form
    document.getElementById('add-product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    
    alert('Producto agregado exitosamente!');
    renderProducts();
    updateStatistics();
}

// Handle image upload
function handleImageUpload(e, previewId) {
    const file = e.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

// Render products
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    // Group products by category
    const categorizedProducts = {
        promociones: products.filter(p => p.isPromotion),
        hamburguesas: products.filter(p => p.category === 'hamburguesas'),
        snacks: products.filter(p => p.category === 'snacks'),
        extras: products.filter(p => p.category === 'extras'),
        sandwiches: products.filter(p => p.category === 'sandwiches')
    };
    
    Object.entries(categorizedProducts).forEach(([categoryId, categoryProducts]) => {
        const category = categories.find(c => c.id === categoryId);
        const section = createCategorySection(category, categoryProducts);
        container.appendChild(section);
    });
}

// Create category section
function createCategorySection(category, products) {
    const section = document.createElement('div');
    section.className = 'category-section';
    
    section.innerHTML = `
        <div class="category-header">
            <h3 class="category-title">
                <span>${category.icon}</span>
                <span>${category.name} (${products.length})</span>
            </h3>
        </div>
        <div class="category-content">
            ${products.length === 0 ? `
                <div class="empty-category">
                    <div class="empty-category-icon">📦</div>
                    <h3>No hay productos en esta categoría</h3>
                </div>
            ` : products.map(product => createProductItem(product)).join('')}
        </div>
    `;
    
    return section;
}

// Create product item
function createProductItem(product) {
    const badges = [];
    if (product.isNew) badges.push('<span class="badge new">NUEVO</span>');
    if (product.isPromotion) badges.push('<span class="badge promotion">PROMOCIÓN</span>');
    
    return `
        <div class="product-item">
            <div class="product-image">
                <div class="image-placeholder">
                    <div class="placeholder-icon">🍔</div>
                    <div class="placeholder-text">${product.name}</div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-name">
                    ${product.name}
                    ${badges.join('')}
                </div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">C$${product.price}</div>
            </div>
            <div class="product-actions">
                <div class="availability-toggle">
                    <span>${product.available ? 'Disponible' : 'Agotado'}</span>
                    <label class="switch">
                        <input type="checkbox" ${product.available ? 'checked' : ''} onchange="toggleAvailability('${product.id}')">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Toggle product availability
function toggleAvailability(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.available = !product.available;
        saveProducts();
        renderProducts();
    }
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProduct = product;
    
    // Populate edit form
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-description').value = product.description || '';
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-available').checked = product.available;
    document.getElementById('edit-product-new').checked = product.isNew || false;
    document.getElementById('edit-product-promotion').checked = product.isPromotion || false;
    
    // Show current image
    if (product.image) {
        document.getElementById('edit-image-preview').innerHTML = `<img src="${product.image}" alt="Current image">`;
    }
    
    // Show modal
    document.getElementById('edit-modal').classList.add('active');
}

// Handle edit product
function handleEditProduct(e) {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    const name = document.getElementById('edit-product-name').value;
    const price = parseFloat(document.getElementById('edit-product-price').value);
    const description = document.getElementById('edit-product-description').value;
    const category = document.getElementById('edit-product-category').value;
    const available = document.getElementById('edit-product-available').checked;
    const isNew = document.getElementById('edit-product-new').checked;
    const isPromotion = document.getElementById('edit-product-promotion').checked;
    const imageFile = document.getElementById('edit-product-image').files[0];
    
    // Update product
    editingProduct.name = name.toUpperCase();
    editingProduct.price = price;
    editingProduct.description = description;
    editingProduct.category = category;
    editingProduct.available = available;
    editingProduct.isNew = isNew;
    editingProduct.isPromotion = isPromotion;
    
    if (imageFile) {
        editingProduct.image = `images/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    }
    
    saveProducts();
    closeEditModal();
    renderProducts();
    updateStatistics();
    alert('Producto actualizado exitosamente!');
}

// Delete product
function deleteProduct(productId) {
    productToDelete = productId;
    document.getElementById('delete-modal').classList.add('active');
}

// Confirm delete
function confirmDelete() {
    if (productToDelete) {
        products = products.filter(p => p.id !== productToDelete);
        saveProducts();
        renderProducts();
        updateStatistics();
        closeDeleteModal();
        productToDelete = null;
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
    editingProduct = null;
    document.getElementById('edit-product-form').reset();
    document.getElementById('edit-image-preview').innerHTML = '';
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
    productToDelete = null;
}

// Update statistics
function updateStatistics() {
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.available).length;
    const unavailableProducts = products.filter(p => !p.available).length;
    const newProducts = products.filter(p => p.isNew).length;
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('available-products').textContent = availableProducts;
    document.getElementById('unavailable-products').textContent = unavailableProducts;
    document.getElementById('new-products').textContent = newProducts;
    
    // Update category statistics
    updateCategoryStats();
}

// Update category statistics
function updateCategoryStats() {
    const container = document.getElementById('category-stats');
    container.innerHTML = '';
    
    categories.forEach(category => {
        let count;
        if (category.id === 'promociones') {
            count = products.filter(p => p.isPromotion).length;
        } else {
            count = products.filter(p => p.category === category.id).length;
        }
        
        const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
        
        const statElement = document.createElement('div');
        statElement.className = 'category-stat';
        statElement.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <div class="category-progress">
                <div class="category-progress-header">
                    <span class="category-name">${category.name}</span>
                    <span class="category-count">${count} productos</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        
        container.appendChild(statElement);
    });
}

// Load profile data - removed for security
function loadProfileData() {
    // Función eliminada por seguridad - no mostrar información personal
}

// Handle profile update - removed for security
function handleProfileUpdate(e) {
    e.preventDefault();
    // Función eliminada por seguridad - no mostrar información personal
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (currentPassword !== adminAccount.password) {
        alert('La contraseña actual es incorrecta');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Las nuevas contraseñas no coinciden');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    adminAccount.password = newPassword;
    localStorage.setItem('burgerclub-admin', JSON.stringify(adminAccount));
    
    // Reset form
    document.getElementById('password-form').reset();
    alert('¡Contraseña cambiada exitosamente!');
}