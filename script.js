// ===== নতুন জাভাস্ক্রিপ্ট ফাংশন =====

let websiteConfig = {};

// কনফিগ লোড
function loadWebsiteConfig() {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            websiteConfig = data;
            updateWebsiteFromConfig();
        })
        .catch(error => {
            console.error('Config লোডে সমস্যা:', error);
        });
}

// ওয়েবসাইট আপডেট
function updateWebsiteFromConfig() {
    // লোগো সেট
    const logo = document.getElementById('main-logo');
    if (logo && websiteConfig.logo) {
        logo.src = websiteConfig.logo;
    }
    
    // ব্র্যান্ড লোড
    loadBrands();
    
    // প্রোডাক্ট লোড
    loadProducts();
}

// ব্র্যান্ড লোড
function loadBrands() {
    const container = document.getElementById('brands-container');
    if (!container || !websiteConfig.brands) return;
    
    container.innerHTML = '';
    
    websiteConfig.brands.forEach(brand => {
        const brandDiv = document.createElement('div');
        brandDiv.className = 'brand-item';
        brandDiv.innerHTML = `
            <img src="${brand.logo}" alt="${brand.name}" 
                 onerror="this.src='https://via.placeholder.com/120x80/eee/ccc?text=LOGO'">
            <h4>${brand.name}</h4>
        `;
        container.appendChild(brandDiv);
    });
}

// প্রোডাক্ট লোড
function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container || !websiteConfig.products) return;
    
    container.innerHTML = '';
    
    websiteConfig.products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image"
                 onerror="this.src='https://via.placeholder.com/300x200/eee/ccc?text=PRODUCT'">
            <div class="product-info">
                <h3>${product.name}</h3>
                ${product.description ? `<p>${product.description}</p>` : ''}
                <div class="product-price">৳ ${product.price}</div>
            </div>
        `;
        container.appendChild(productDiv);
    });
}

// মডাল ফাংশন
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openAddBrandModal() {
    openModal('addBrandModal');
}

function openAddProductModal() {
    openModal('addProductModal');
}

function openAdminPanel() {
    openModal('adminPanelModal');
}

// নতুন ব্র্যান্ড যোগ
function addBrand() {
    const name = document.getElementById('brandName').value.trim();
    const logo = document.getElementById('brandLogoPath').value.trim();
    
    if (!name || !logo) {
        alert('ব্র্যান্ড নাম এবং ছবির পাথ প্রয়োজন');
        return;
    }
    
    const newBrand = {
        name: name,
        logo: logo
    };
    
    if (!websiteConfig.brands) websiteConfig.brands = [];
    websiteConfig.brands.push(newBrand);
    
    // UI আপডেট
    loadBrands();
    
    // মডাল ক্লোজ
    closeModal('addBrandModal');
    
    // ফর্ম রিসেট
    document.getElementById('brandName').value = '';
    document.getElementById('brandLogoPath').value = '';
    
    alert('ব্র্যান্ড যোগ করা হয়েছে!');
    
    // কনসোলে দেখান
    console.log('নতুন ব্র্যান্ড:', newBrand);
}

// নতুন প্রোডাক্ট যোগ
function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    
    if (!name || !image || !price) {
        alert('সব ফিল্ড পূরণ করুন');
        return;
    }
    
    const newProduct = {
        name: name,
        image: image,
        price: price
    };
    
    if (!websiteConfig.products) websiteConfig.products = [];
    websiteConfig.products.push(newProduct);
    
    // UI আপডেট
    loadProducts();
    
    // মডাল ক্লোজ
    closeModal('addProductModal');
    
    // ফর্ম রিসেট
    document.getElementById('productName').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productPrice').value = '';
    
    alert('পণ্য যোগ করা হয়েছে!');
    
    // কনসোলে দেখান
    console.log('নতুন পণ্য:', newProduct);
}

// লোগো পরিবর্তন
function changeLogo() {
    const newLogoPath = prompt('নতুন লোগোর পাথ দিন:', websiteConfig.logo || 'images/logo.png');
    
    if (newLogoPath) {
        websiteConfig.logo = newLogoPath;
        
        // UI আপডেট
        const logo = document.getElementById('main-logo');
        if (logo) {
            logo.src = newLogoPath;
        }
        
        alert('লোগো পরিবর্তন করা হয়েছে!');
    }
}

// মডাল বাইরে ক্লিক করলে বন্ধ
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// DOM লোড হলে কনফিগ লোড করুন
document.addEventListener('DOMContentLoaded', function() {
    loadWebsiteConfig();
});
