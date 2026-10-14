// 1. Насыщенная база данных товаров с категориями и эмодзи
const catalog = [
    { id: 1, category: "Смартфоны и Ноутбуки", name: "Флагман CyberPhone Pro", desc: "Экран 120 Гц, тройная AI-камера, аккумулятор на 5000 мАч и супербыстрая зарядка.", price: 79900, icon: "📱" },
    { id: 2, category: "Смартфоны и Ноутбуки", name: "Ультрабук SpaceBook 14", desc: "Тонкий алюминиевый корпус, мощный процессор, 16 ГБ ОЗУ и яркий IPS экран.", price: 115000, icon: "💻" },
    { id: 3, category: "Смартфоны и Ноутбуки", name: "Планшет Tab X-Screen", desc: "Отличное решение для рисования и работы в дороге. Стилус в комплекте.", price: 42000, icon: "📟" },
    
    { id: 4, category: "Аудио и Периферия", name: "Наушники SoundAir ANC", desc: "Беспроводные наушники с активным шумоподавлением и глубоким басом.", price: 14500, icon: "🎧" },
    { id: 5, category: "Аудио и Периферия", name: "Механика NeonClick RGB", desc: "Игровая клавиатура на красных свитчах со сочной настраиваемой подсветкой.", price: 6800, icon: "⌨️" },
    { id: 6, category: "Аудио и Периферия", name: "Мышь Precision Wave", desc: "Эргономичная беспроводная мышь с оптическим сенсором высокого разрешения.", price: 3400, icon: "🖱️" },
    
    { id: 7, category: "Умный дом и Гаджеты", name: "Смарт-часы Chrono Watch", desc: "Мониторинг пульса, уровня кислорода, трекер сна и встроенный GPS модуль.", price: 18900, icon: "⌚" },
    { id: 8, category: "Умный дом и Гаджеты", name: "Станция ИИ «Алиса Pro»", desc: "Умная колонка с объемным звуком 30 Вт и встроенным голосовым ассистентом.", price: 12900, icon: "🔊" }
];

// 2. Хранилище состояния приложения (State)
let cart = {};              // Формат: { id_товара: количество }
let searchQuery = "";       // Строка текущего поиска
let selectedCategory = "Все"; // Текущая выбранная категория

/**
 * 3. Главный роутер переключения вкладок SPA
 * @param {string} tabName - Имя вкладки ('products', 'cart', 'about')
 */
function switchTab(tabName) {
    // Управление активными классами кнопок навигации
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeTabButton = document.getElementById(`tab-${tabName}`);
    if (activeTabButton) activeTabButton.classList.add('active');

    const container = document.getElementById('main-content');
    if (!container) return;
    
    // Рендеринг соответствующего контента
    if (tabName === 'products') {
        container.innerHTML = renderCatalogPage();
        attachFilterEvents(); // Подключаем «слушатель» для строки ввода поиска
    } else if (tabName === 'cart') {
        renderCart();
    } else if (tabName === 'about') {
        container.innerHTML = renderAbout();
    }
}

/**
 * 4. Генерация страницы каталога (панель поиска + кнопки фильтров + контейнер списка)
 */
function renderCatalogPage() {
    const categories = ["Все", ...new Set(catalog.map(item => item.category))];
    
    let html = `
        <div class="filter-bar">
            <input type="text" id="search-input" class="search-input" placeholder="🔍 Поиск гаджета по названию..." value="${searchQuery}">
            <div class="categories-filter">
    `;
    
    categories.forEach(cat => {
        const activeClass = (cat === selectedCategory) ? "active" : "";
        html += `<button class="filter-chip ${activeClass}" onclick="setCategoryFilter('${cat}')">${cat}</button>`;
    });

    html += `
            </div>
        </div>
        <div id="catalog-products-list">
            ${renderFilteredProducts()}
        </div>
    `;
    return html;
}

/**
 * 5. Фильтрация товаров на основе поиска и категорий, и генерация HTML карточек
 */
function renderFilteredProducts() {
    const filtered = catalog.filter(item => {
        const matchesCategory = (selectedCategory === "Все" || item.category === selectedCategory);
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        return `<p style="text-align:center; color:var(--text-muted); margin-top:40px; font-style:italic;">Ничего не найдено по вашему запросу 😢</p>`;
    }

    const currentCategories = [...new Set(filtered.map(item => item.category))];
    let html = '';

    currentCategories.forEach(cat => {
        html += `<h3 class="category-title">${cat}</h3>`;
        html += `<div class="grid-products">`;
        
        const productsInCat = filtered.filter(item => item.category === cat);
        productsInCat.forEach(product => {
            html += `
                <div class="card">
                    <div class="card-img">${product.icon}</div>
                    <div class="card-body">
                        <div class="card-title">${product.name}</div>
                        <div class="card-desc">${product.desc}</div>
                        <div class="card-footer">
                            <div class="price">${product.price.toLocaleString()} ₽</div>
                            <button class="btn-buy" onclick="addToCart(${product.id})">В корзину</button>
                        </div>
                    </div>
                </div>`;
        });
        html += `</div>`;
    });
    return html;
}

/**
 * 6. Логика фильтров и событий ввода
 */
function setCategoryFilter(category) {
    selectedCategory = category;
    const container = document.getElementById('main-content');
    if (container) {
        container.innerHTML = renderCatalogPage();
        attachFilterEvents();
    }
}

function attachFilterEvents() {
    const input = document.getElementById('search-input');
    if (input) {
        input.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            // Обновляем список карточек «на лету» без потери фокуса из инпута
            const listContainer = document.getElementById('catalog-products-list');
            if (listContainer) listContainer.innerHTML = renderFilteredProducts();
        });
    }
}

/**
 * 7. Логика управления Корзиной
 */
function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    updateCartBadge();
}

function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) {
        delete cart[id];
    }
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const countElement = document.getElementById('cart-count');
    if (!countElement) return;

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    
    if (totalItems > 0) {
        countElement.innerText = totalItems;
        countElement.style.display = 'inline-block';
        countElement.classList.add('pop');
        setTimeout(() => countElement.classList.remove('pop'), 200);
    } else {
        countElement.style.display = 'none';
    }
}

function renderCart() {
    const container = document.getElementById('main-content');
    if (!container) return;

    const itemIds = Object.keys(cart);

    if (itemIds.length === 0) {
        container.innerHTML = `
            <div class="cart-container empty-cart-view">
                <span class="empty-cart-icon">🛒</span>
                <h2>Ваша корзина пуста</h2>
                <p style="margin-top:10px;">Перейдите в каталог, чтобы выбрать лучшие девайсы.</p>
            </div>`;
        return;
    }

    let html = `<div class="cart-container"><h2>Ваш заказ</h2>`;
    let orderTotal = 0;

    itemIds.forEach(id => {
        const product = catalog.find(p => p.id == id);
        const qty = cart[id];
        const currentSum = product.price * qty;
        orderTotal += currentSum;

        html += `
            <div class="cart-row">
                <div class="cart-item-info">
                    <div class="cart-item-icon">${product.icon}</div>
                    <div>
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-price">${product.price.toLocaleString()} ₽ / шт.</div>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="btn-qty" onclick="changeQty(${id}, -1)">-</button>
                    <span style="font-weight: 600; min-width: 20px; text-align:center;">${qty}</span>
                    <button class="btn-qty" onclick="changeQty(${id}, 1)">+</button>
                </div>
                <div class="item-total">${currentSum.toLocaleString()} ₽</div>
            </div>`;
    });

    html += `
        <div class="cart-summary">
            <div>
                <div class="total-label">Итого к оплате:</div>
                <div class="total-amount">${orderTotal.toLocaleString()} ₽</div>
            </div>
            <button class="btn-checkout" onclick="checkoutAlert()">Оформить заказ</button>
        </div>
    </div>`;
    
    container.innerHTML = html;
}

/**
 * 8. Рендеринг вкладки «О нас» и имитация оформления заказа
 */
function renderAbout() {
    return `
        <div class="about-section">
            <h2>Добро пожаловать в CyberSpace!</h2>
            <p>Мы — флагманский концепт-стор инновационных технологий. Наша цель — собрать в одном месте самые передовые решения для работы, гейминга и умного дома.</p>
            <div class="features-grid">
                <div class="feature-box"><span class="feature-icon">🚀</span><h4>Быстрая доставка</h4><p>Доставим в течение пары часов.</p></div>
                <div class="feature-box"><span class="feature-icon">🛡️</span><h4>Гарантия качества</h4><p>Только сертифицированная продукция.</p></div>
                <div class="feature-box"><span class="feature-icon">💸</span><h4>Честные цены</h4><p>Регулярные скидки и бонусы.</p></div>
            </div>
        </div>`;
}

function checkoutAlert() {
    alert('🎉 Спасибо за заказ! Ваша заявка успешно отправлена в обработку.');
    cart = {};
    updateCartBadge();
    switchTab('products');
}

