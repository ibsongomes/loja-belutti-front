let cart = JSON.parse(localStorage.getItem('beluttiCart')) || [];
let selectedPaymentMethod = localStorage.getItem('beluttiPaymentMethod') || 'pix';
let selectedInstallments = parseInt(localStorage.getItem('beluttiInstallments')) || 1;

document.addEventListener('DOMContentLoaded', () => {
    updateCartHeader();

    // Abre a sacola lateral ao clicar no ícone do carrinho no cabeçalho
    const cartMenu = document.getElementById('cartMenu');
    if (cartMenu) {
        cartMenu.addEventListener('click', openCartSidebar);
    }
});

function addToCart(product) {
    const selectedSize = product.size || 'M';
    const existingItem = cart.find(item => item.name === product.name && (item.size || 'M') === selectedSize);

    // Soma total desse produto no carrinho (independentemente do tamanho) para respeitar o estoque
    const totalSameProductInCart = cart
        .filter(item => item.name === product.name)
        .reduce((sum, item) => sum + item.quantity, 0);

    if (product.maxStock && totalSameProductInCart + 1 > product.maxStock) {
        alert(`Quantidade máxima disponível em estoque atingida (${product.maxStock} un.).`);
        return;
    }

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, size: selectedSize, quantity: 1 });
    }
    saveAndRefreshCart();
    openCartSidebar();
}

function changeQuantity(index, delta) {
    const item = cart[index];
    if (delta > 0 && item.maxStock) {
        const totalSameProductInCart = cart
            .filter(i => i.name === item.name)
            .reduce((sum, i) => sum + i.quantity, 0);

        if (totalSameProductInCart + delta > item.maxStock) {
            alert(`Quantidade máxima disponível em estoque atingida (${item.maxStock} un.).`);
            return;
        }
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

window.selectPaymentMethod = function(method) {
    selectedPaymentMethod = method;
    localStorage.setItem('beluttiPaymentMethod', method);
    openCartSidebar();
};

window.selectInstallments = function(installments) {
    selectedInstallments = parseInt(installments) || 1;
    localStorage.setItem('beluttiInstallments', String(selectedInstallments));
};

function getPaymentMethodLabel(method, installments, total) {
    if (method === 'cartao') {
        const parcelValue = (total / installments).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return `Cartão de Crédito (${installments}x de ${parcelValue} sem juros)`;
    }
    if (method === 'boleto') {
        return 'Boleto Bancário (à vista)';
    }
    return 'Pix (Aprovação imediata)';
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
            const sizeBadge = item.size
                ? `<span style="display:inline-block; font-size:11px; color:#555; background:#f2efe9; padding:2px 7px; border-radius:3px; margin-bottom:4px;">Tamanho: <strong>${item.size}</strong></span><br>`
                : '';

            html += `
                <div style="display:flex; gap:12px; align-items:center; border-bottom:1px solid #eee; padding-bottom:12px;">
                    <img src="${item.image}" alt="${item.name}" style="width:60px; height:75px; object-fit:cover; border-radius:4px;">
                    <div style="flex:1;">
                        <h4 style="margin:0 0 4px 0; font-size:14px; color:#1A1A1A;">${item.name}</h4>
                        ${sizeBadge}
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

        const optionStyle = (method) => {
            const active = selectedPaymentMethod === method;
            return `display:flex; align-items:center; gap:10px; padding:10px 12px; border:1.5px solid ${active ? 'rgb(101, 54, 7)' : '#dcd7ce'}; background:${active ? '#faf6f0' : '#fff'}; border-radius:6px; cursor:pointer; font-size:13px; transition:all 0.2s;`;
        };

        const p1 = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const p2 = (total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const p3 = (total / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const installmentsHtml = selectedPaymentMethod === 'cartao'
            ? `
                <div style="margin-top:8px; padding-left:4px;">
                    <label style="display:block; font-size:12px; color:#555; margin-bottom:4px;">Parcelamento:</label>
                    <select id="cartInstallmentsSelect" onchange="selectInstallments(this.value)" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:4px; font-size:13px; background:#fff; color:#1A1A1A;">
                        <option value="1" ${selectedInstallments === 1 ? 'selected' : ''}>1x de ${p1} sem juros</option>
                        <option value="2" ${selectedInstallments === 2 ? 'selected' : ''}>2x de ${p2} sem juros</option>
                        <option value="3" ${selectedInstallments === 3 ? 'selected' : ''}>3x de ${p3} sem juros</option>
                    </select>
                </div>
            `
            : '';

        html += `
            <div style="margin-top:10px; padding-top:14px; border-top:1px solid #e5e0d8;">
                <p style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#1A1A1A; margin:0 0 10px 0;">
                    Forma de Pagamento
                </p>

                <div style="display:flex; flex-direction:column; gap:8px;">
                    <label onclick="selectPaymentMethod('pix')" style="${optionStyle('pix')}">
                        <input type="radio" name="paymentMethod" value="pix" ${selectedPaymentMethod === 'pix' ? 'checked' : ''} style="accent-color: rgb(101, 54, 7);">
                        <i class="fab fa-pix" style="font-size:16px; color:#2e7d32;"></i>
                        <div style="flex:1;">
                            <strong style="color:#1A1A1A;">Pix</strong>
                            <div style="font-size:11px; color:#666;">Aprovação imediata</div>
                        </div>
                    </label>

                    <label onclick="selectPaymentMethod('cartao')" style="${optionStyle('cartao')}">
                        <input type="radio" name="paymentMethod" value="cartao" ${selectedPaymentMethod === 'cartao' ? 'checked' : ''} style="accent-color: rgb(101, 54, 7);">
                        <i class="far fa-credit-card" style="font-size:16px; color:rgb(101, 54, 7);"></i>
                        <div style="flex:1;">
                            <strong style="color:#1A1A1A;">Cartão de Crédito</strong>
                            <div style="font-size:11px; color:#666;">Até 3x sem juros</div>
                        </div>
                    </label>

                    ${installmentsHtml}

                    <label onclick="selectPaymentMethod('boleto')" style="${optionStyle('boleto')}">
                        <input type="radio" name="paymentMethod" value="boleto" ${selectedPaymentMethod === 'boleto' ? 'checked' : ''} style="accent-color: rgb(101, 54, 7);">
                        <i class="fas fa-barcode" style="font-size:16px; color:#333;"></i>
                        <div style="flex:1;">
                            <strong style="color:#1A1A1A;">Boleto Bancário</strong>
                            <div style="font-size:11px; color:#666;">Compensação em até 2 dias úteis</div>
                        </div>
                    </label>
                </div>
            </div>

            <div style="margin-top:12px; padding-top:15px; border-top:2px solid #1A1A1A;">
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

    if (!token) {
        window.location.assign(window.location.pathname.includes('/pages/') ? '../auth/login.html' : './pages/auth/login.html');
        return;
    }

    if (!selectedPaymentMethod) {
        alert('Por favor, selecione uma forma de pagamento antes de finalizar a compra.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const paymentLabel = getPaymentMethodLabel(selectedPaymentMethod, selectedInstallments, total);

    try {
        const response = await fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart,
                total,
                paymentMethod: paymentLabel
            })
        });

        const data = await response.json();

        if (response.ok) {
            cart = [];
            saveAndRefreshCart();
            document.getElementById('sidebarContent').innerHTML = `
                <div style="text-align:center; padding:40px 15px;">
                    <i class="fas fa-check-circle" style="font-size:52px; color:#2e7d32; margin-bottom:15px;"></i>
                    <h3 style="color:#1A1A1A; margin-bottom:10px;">Pedido #${data.orderId} Confirmado!</h3>
                    <p style="color:#444; font-size:13px; background:#f8f5f0; padding:10px; border-radius:6px; margin-bottom:15px;">
                        <strong>Pagamento:</strong> ${paymentLabel}
                    </p>
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
