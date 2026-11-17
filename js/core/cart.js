let cart = JSON.parse(localStorage.getItem('beluttiCart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartHeader();

    // Abre a sacola lateral ao clicar no ícone do carrinho no cabeçalho
    const cartMenu = document.getElementById('cartMenu');
    if (cartMenu) {
        cartMenu.addEventListener('click', openCartSidebar);
    }
});

function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        if (product.maxStock && existingItem.quantity + 1 > product.maxStock) {
            alert(`Quantidade máxima disponível em estoque atingida (${product.maxStock} un.).`);
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveAndRefreshCart();
    openCartSidebar();
}

function changeQuantity(index, delta) {
    const item = cart[index];
    if (delta > 0 && item.maxStock && item.quantity + delta > item.maxStock) {
        alert(`Quantidade máxima disponível em estoque atingida (${item.maxStock} un.).`);
        return;
    }

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }
    saveAndRefreshCart();
    openCartSidebar();
}

function saveAndRefreshCart() {
    localStorage.setItem('beluttiCart', JSON.stringify(cart));
    updateCartHeader();
}

function updateCartHeader() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');

    if (countEl) countEl.innerText = `Carrinho (${totalItems})`;
    if (totalEl) totalEl.innerText = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function openCartSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const panel = document.getElementById('sidebarPanel');
    const title = document.getElementById('sidebarTitle');
    const content = document.getElementById('sidebarContent');

    if (!panel || !content) return;

    title.innerText = 'Sua Sacola Belutti';

    if (cart.length === 0) {
        content.innerHTML = '<p style="text-align:center; color:#666; margin-top:40px;">Sua sacola está vazia.</p>';
    } else {
        let html = '<div style="display:flex; flex-direction:column; gap:15px;">';
        let total = 0;

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            html += `
                <div style="display:flex; gap:12px; align-items:center; border-bottom:1px solid #eee; padding-bottom:12px;">
                    <img src="${item.image}" alt="${item.name}" style="width:60px; height:75px; object-fit:cover; border-radius:4px;">
                    <div style="flex:1;">
                        <h4 style="margin:0 0 4px 0; font-size:14px; color:#1A1A1A;">${item.name}</h4>
                        <span style="font-size:13px; color:#555;">${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <div style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                            <button onclick="changeQuantity(${index}, -1)" style="width:24px; height:24px; border:1px solid #ccc; background:#fff; cursor:pointer;">-</button>
                            <span style="font-size:13px; font-weight:bold;">${item.quantity}</span>
                            <button onclick="changeQuantity(${index}, 1)" style="width:24px; height:24px; border:1px solid #ccc; background:#fff; cursor:pointer;">+</button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            <div style="margin-top:15px; padding-top:15px; border-top:2px solid #1A1A1A;">
                <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:bold; margin-bottom:15px;">
                    <span>Total:</span>
                    <span>${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <button onclick="checkoutOrder()" style="width:100%; padding:14px; background:#1A1A1A; color:#fff; border:none; border-radius:4px; font-size:15px; font-weight:bold; cursor:pointer;">
                    Finalizar Compra
                </button>
            </div>
        </div>`;

        content.innerHTML = html;
    }

    overlay.classList.add('active');
    panel.classList.add('active');
}

async function checkoutOrder() {
    const token = localStorage.getItem('authToken');

    // Bloqueia a compra se não estiver logado e manda para a pasta pages/auth/
    if (!token) {
        window.location.assign(window.location.pathname.includes('/pages/') ? '../auth/login.html' : './pages/auth/login.html');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        const response = await fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: cart, total })
        });

        const data = await response.json();

        if (response.ok) {
            cart = [];
            saveAndRefreshCart();
            document.getElementById('sidebarContent').innerHTML = `
                <div style="text-align:center; padding:40px 15px;">
                    <i class="fas fa-check-circle" style="font-size:52px; color:#2e7d32; margin-bottom:15px;"></i>
                    <h3 style="color:#1A1A1A; margin-bottom:10px;">Pedido #${data.orderId} Confirmado!</h3>
                    <p style="color:#666; font-size:14px; line-height:1.5; margin-bottom:25px;">
                        Obrigado por comprar na Belutti. Seu pedido já foi registrado em nossa base.
                    </p>
                    <button onclick="closeCartSidebar()" style="width:100%; padding:12px; background:#1A1A1A; color:#fff; border:none; border-radius:4px; font-size:14px; font-weight:bold; cursor:pointer;">
                        Continuar Comprando
                    </button>
                </div>
            `;
        } else {
            alert(data.error || 'Erro ao processar pedido.');
        }
    } catch (error) {
        console.error('Erro no checkout:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

function closeCartSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const panel = document.getElementById('sidebarPanel');
    if (overlay) overlay.classList.remove('active');
    if (panel) panel.classList.remove('active');
}