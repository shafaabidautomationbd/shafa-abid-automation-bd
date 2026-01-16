// script.js - সম্পূর্ণ কোড

// গ্লোবাল কনফিগ অবজেক্ট
let config = {
    logo: "images/logo.png",
    siteName: "আমার শপ",
    brands: [],
    products: []
};

// DOM কন্টেন্ট লোড হলে
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
});

// 1. কনফিগ লোড
function loadConfig() {
    fetch('config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('config.json ফাইল লোড করতে সমস্যা হয়েছে');
            }
            return response.json();
        })
        .then(data => {
            config = data;
            updateWebsite();
            updateStats();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('brands-container').innerHTML = 
                '<div class="error">config.json ফাইল লোড করতে ব্যর্থ। ফাইলটি চেক করুন।</div>';
        });
}

// 2. সম্পূর্ণ ওয়েবসাইট আপডেট
function updateWebsite() {
    loadLogo();
    loadBrands();
    loadProducts();
}

// 3. লোগো লোড (উপরে বাম পাশে)
function loadLogo() {
    const logoImg = document.getElementById('main-logo');
    const logoPath = document.getElementById('currentLogoPath');
    
    // লোগো সেট করুন
    logoImg.src = config.logo;
    logoImg.alt = config.siteName + ' লোগো';
    
    // ফুটারে পাথ দেখান
    if (logoPath) {
        logoPath.textContent = config.logo;
    }
    
    // টাইটেল আপডেট
    const title = document.querySelector('.site-title');
    if (title && config.siteName) {
        title.textContent = config.siteName;
    }
    
    // ব্রাউজার টাইটেল
    document.title = config.siteName;
    
    // ছবি না পাওয়া গেলে ডিফল্ট সেট
    logoImg.onerror = function() {
        this.src = 'https://via.placeholder.com/60x60/1a73e8/ffffff?text=LOGO';
        console.warn('লোগো ছবি লোড হতে ব্যর্থ: ' + config.logo);
    };
}

// 4. ব্র্যান্ড লোড
function loadBrands() {
    const brandsContainer = document.getElementById('brands-container');
    
    if (!brandsContainer) return;
    
    if (config.brands.length === 0) {
        brandsContainer.innerHTML = '<div class="no-data">কোন ব্র্যান্ড পাওয়া যায়নি। ব্র্যান্ড যোগ করুন।</div>';
        return;
    }
    
    brandsContainer.innerHTML = '';
    
    config.brands.forEach(brand => {
        const brandDiv = document.createElement('div');
        brandDiv.className = 'brand-item';
        brandDiv.innerHTML = `
            <img src="${brand.logo}" alt="${brand.name}" 
                 onerror="this.src='https://via.placeholder.com/250x150/eee/ccc?text=${encodeURIComponent(brand.name)}'">
            <p>${brand.name}</p>
            ${brand.description ? `<small class="brand-desc">${brand.description}</small>` : ''}
        `;
        brandsContainer.appendChild(brandDiv);
    });
}

// 5. পণ্য লোড
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) return;
    
    if (config.products.length === 0) {
        productsContainer.innerHTML = '<div class="no-data">কোন পণ্য পাওয়া যায়নি। পণ্য যোগ করুন।</div>';
        return;
    }
    
    productsContainer.innerHTML = '';
    
    config.products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}"
                 onerror="this.src='https://via.placeholder.com/250x180/eee/ccc?text=${encodeURIComponent(product.name)}'">
            <h3>${product.name}</h3>
            <p class="price">৳ ${Number(product.price).toLocaleString('bn-BD')}</p>
            <p><strong>ক্যাটাগরি:</strong> ${product.category}</p>
            ${product.description ? `<p class="desc">${product.description}</p>` : ''}
        `;
        productsContainer.appendChild(productDiv);
    });
}

// 6. স্ট্যাটিস্টিক্স আপডেট
function updateStats() {
    const brandCount = document.getElementById('brandCount');
    const productCount = document.getElementById('productCount');
    
    if (brandCount) brandCount.textContent = config.brands.length;
    if (productCount) productCount.textContent = config.products.length;
}

// 7. মডাল ফাংশন
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openAddBrandModal() {
    openModal('addBrandModal');
}

function openAddProductModal() {
    openModal('addProductModal');
}

function openAdminPanel() {
    openModal('adminPanelModal');
    loadConfigToEditor();
}

// 8. নতুন ব্র্যান্ড যোগ
function addBrand() {
    const name = document.getElementById('brandName').value.trim();
    const logo = document.getElementById('brandLogoPath').value.trim();
    const description = document.getElementById('brandDescription').value.trim();
    
    if (!name || !logo) {
        alert('ব্র্যান্ডের নাম এবং ছবির পাথ অবশ্যই দিতে হবে');
        return;
    }
    
    // নতুন ব্র্যান্ড অবজেক্ট
    const newBrand = {
        id: config.brands.length > 0 ? Math.max(...config.brands.map(b => b.id)) + 1 : 1,
        name: name,
        logo: logo,
        description: description
    };
    
    // লোকাল কনফিগে যোগ
    config.brands.push(newBrand);
    
    // UI আপডেট
    loadBrands();
    updateStats();
    
    // মডাল ক্লোজ
    closeModal('addBrandModal');
    
    // ফর্ম রিসেট
    document.getElementById('brandName').value = '';
    document.getElementById('brandLogoPath').value = '';
    document.getElementById('brandDescription').value = '';
    
    // সফলতা মেসেজ
    alert(`"${name}" ব্র্যান্ড সফলভাবে যোগ হয়েছে!`);
    
    // কনসোলে দেখান (বাস্তবে সার্ভারে সেভ করতে হবে)
    console.log('নতুন ব্র্যান্ড যোগ হয়েছে:', newBrand);
    console.log('সমস্ত ব্র্যান্ড:', config.brands);
}

// 9. নতুন পণ্য যোগ
function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    
    if (!name || !image || !price || !category) {
        alert('পণ্যের নাম, ছবি, মূল্য এবং ক্যাটাগরি অবশ্যই দিতে হবে');
        return;
    }
    
    // নতুন পণ্য অবজেক্ট
    const newProduct = {
        id: config.products.length > 0 ? Math.max(...config.products.map(p => p.id)) + 1 : 1,
        name: name,
        image: image,
        price: price,
        category: category,
        description: description
    };
    
    // লোকাল কনফিগে যোগ
    config.products.push(newProduct);
    
    // UI আপডেট
    loadProducts();
    updateStats();
    
    // মডাল ক্লোজ
    closeModal('addProductModal');
    
    // ফর্ম রিসেট
    document.getElementById('productName').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productDescription').value = '';
    
    // সফলতা মেসেজ
    alert(`"${name}" পণ্য সফলভাবে যোগ হয়েছে!`);
    
    // কনসোলে দেখান (বাস্তবে সার্ভারে সেভ করতে হবে)
    console.log('নতুন পণ্য যোগ হয়েছে:', newProduct);
    console.log('সমস্ত পণ্য:', config.products);
}

// 10. লোগো পরিবর্তন
function changeLogo() {
    const newLogoPath = prompt('নতুন লোগোর পাথ দিন (যেমন: images/new-logo.png):', config.logo);
    
    if (newLogoPath && newLogoPath !== config.logo) {
        config.logo = newLogoPath;
        loadLogo();
        alert('লোগো আপডেট হয়েছে!');
        
        // কনসোলে দেখান
        console.log('নতুন লোগো পাথ:', config.logo);
    }
}

// 11. সমস্ত ডাটা দেখুন
function viewAllData() {
    console.log('=== সম্পূর্ণ কনফিগ ডাটা ===');
    console.log('লোগো:', config.logo);
    console.log('সাইট নাম:', config.siteName);
    console.log('ব্র্যান্ড সংখ্যা:', config.brands.length);
    console.log('ব্র্যান্ড তালিকা:', config.brands);
    console.log('পণ্য সংখ্যা:', config.products.length);
    console.log('পণ্য তালিকা:', config.products);
    
    // ডাটা টেক্সট হিসাবেও দেখানো
    const dataText = `লোগো: ${config.logo}\nসাইট নাম: ${config.siteName}\nব্র্যান্ড: ${config.brands.length}\nপণ্য: ${config.products.length}`;
    alert('কনসোলে সম্পূর্ণ ডাটা দেখানো হয়েছে। F12 চাপুন কনসোল দেখতে।\n\n' + dataText);
}

// 12. কনফিগ এডিটরে লোড
function loadConfigToEditor() {
    const editor = document.getElementById('configEditor');
    if (editor) {
        editor.value = JSON.stringify(config, null, 4);
    }
}

// 13. কনফিগ আপডেট
function updateConfig() {
    const editor = document.getElementById('configEditor');
    
    if (!editor || !editor.value.trim()) {
        alert('কোন JSON ডাটা পাওয়া যায়নি');
        return;
    }
    
    try {
        const newConfig = JSON.parse(editor.value);
        
        // ভ্যালিডেশন
        if (!newConfig.logo || !Array.isArray(newConfig.brands) || !Array.isArray(newConfig.products)) {
            throw new Error('ইনভ্যালিড কনফিগ ফরম্যাট');
        }
        
        // আপডেট
        config = newConfig;
        
        // UI রিফ্রেশ
        updateWebsite();
        updateStats();
        
        alert('কনফিগ সফলভাবে আপডেট হয়েছে!');
        
        // মডাল ক্লোজ
        closeModal('adminPanelModal');
        
    } catch (error) {
        alert('JSON পার্স করতে সমস্যা: ' + error.message);
        console.error('JSON Parse Error:', error);
    }
}

// 14. মডাল বাইরে ক্লিক করলে বন্ধ
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// 15. কী-বোর্ড শর্টকাট
document.addEventListener('keydown', function(event) {
    // ESC চাপলে সব মডাল বন্ধ
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Ctrl+Shift+A চাপলে অ্যাডমিন প্যানেল খুলবে
    if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        openAdminPanel();
        event.preventDefault();
    }
});

// 16. কনফিগ সেভ করুন (লোকালস্টোরেজে)
function saveConfigToLocal() {
    try {
        localStorage.setItem('websiteConfig', JSON.stringify(config));
        console.log('কনফিগ লোকালস্টোরেজে সেভ হয়েছে');
    } catch (e) {
        console.error('লোকালস্টোরেজে সেভ করতে সমস্যা:', e);
    }
}

// 17. লোকালস্টোরেজ থেকে লোড করুন
function loadConfigFromLocal() {
    try {
        const saved = localStorage.getItem('websiteConfig');
        if (saved) {
            config = JSON.parse(saved);
            updateWebsite();
            updateStats();
            console.log('লোকালস্টোরেজ থেকে কনফিগ লোড হয়েছে');
        }
    } catch (e) {
        console.error('লোকালস্টোরেজ থেকে লোড করতে সমস্যা:', e);
    }
}

// অটোসেভ
setInterval(saveConfigToLocal, 30000); // প্রতি ৩০ সেকেন্ডে সেভ
