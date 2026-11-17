// ==========================================
// MODAL DE CONFIRMAÇÃO E NOTIFICAÇÃO NA TELA
// ==========================================
function ensureBeluttiModal() {
    if (document.getElementById('beluttiConfirmOverlay')) return;

    const modalHtml = `
        <div id="beluttiConfirmOverlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center; padding:20px;">
            <div style="background:#fff; max-width:420px; width:100%; border-radius:8px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.2); text-align:center;">
                <h3 id="beluttiConfirmTitle" style="margin:0 0 10px 0; color:#1A1A1A; font-size:18px;">Confirmar ação</h3>
                <p id="beluttiConfirmMsg" style="margin:0 0 22px 0; color:#555; font-size:14px; line-height:1.5;"></p>
                <div style="display:flex; gap:12px; justify-content:center;">
                    <button id="beluttiConfirmCancel" style="flex:1; padding:11px; background:#eee; color:#333; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Voltar</button>
                    <button id="beluttiConfirmOk" style="flex:1; padding:11px; background:#c0392b; color:#fff; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Confirmar</button>
                </div>
            </div>
        </div>
        <div id="beluttiToast" style="display:none; position:fixed; bottom:24px; right:24px; background:#1A1A1A; color:#fff; padding:14px 20px; border-radius:6px; font-size:14px; font-weight:bold; box-shadow:0 6px 20px rgba(0,0,0,0.2); z-index:10000;"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showConfirmModal(title, message, onConfirm, confirmColor = '#c0392b') {
    ensureBeluttiModal();
    const overlay = document.getElementById('beluttiConfirmOverlay');
    document.getElementById('beluttiConfirmTitle').innerText = title;
    document.getElementById('beluttiConfirmMsg').innerText = message;
    overlay.style.display = 'flex';

    const cancelBtn = document.getElementById('beluttiConfirmCancel');
    const okBtn = document.getElementById('beluttiConfirmOk');
    okBtn.style.background = confirmColor;

    const close = () => { overlay.style.display = 'none'; };
    cancelBtn.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    okBtn.onclick = async () => {
        close();
        await onConfirm();
    };
}

function showToastMessage(message, isError = false) {
    ensureBeluttiModal();
    const toast = document.getElementById('beluttiToast');
    toast.style.background = isError ? '#c0392b' : '#2e7d32';
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3500);
}

// ==========================================
// LÓGICA DO PAINEL ADMINISTRATIVO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.assign(window.location.pathname.includes('/pages/') ? '../auth/login.html' : './pages/auth/login.html');
        return;
    }

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`panel-${btn.dataset.panel}`).classList.add('active');
        });
    });

    document.getElementById('adminLogoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.assign(window.location.pathname.includes('/pages/') ? '../../index.html' : './index.html');
    });

    loadAdminOrders();
    loadAdminStock();
    loadAdminUsers();
});

async function loadAdminOrders() {
    const token = localStorage.getItem('authToken');
    const container = document.getElementById('adminOrdersList');

    try {
        const res = await fetch('/admin/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 403) {
            window.location.assign(window.location.pathname.includes('/pages/') ? '../../index.html' : './index.html');
            return;
        }

        const orders = await res.json();

        document.getElementById('statTotalOrders').innerText = orders.length;
        const revenue = orders.filter(o => o.status !== 'Cancelado').reduce((sum, o) => sum + o.total, 0);
        document.getElementById('statRevenue').innerText = revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        if (orders.length === 0) {
            container.innerHTML = '<p style="color: #666;">Nenhum pedido realizado na loja ainda.</p>';
            return;
        }

        const statuses = ['Pedido Confirmado', 'Em Separação', 'Enviado', 'Entregue', 'Cancelado'];

        container.innerHTML = orders.map(order => {
            const addr = order.shippingAddress || {};
            const addressStr = addr.street
                ? `${addr.street}, ${addr.number}${addr.complement ? ' - ' + addr.complement : ''} • ${addr.neighborhood}, ${addr.city}/${addr.state} (CEP: ${addr.cep})`
                : 'Não informado';
            const isCanceled = order.status === 'Cancelado';
            const isDelivered = order.status === 'Entregue';
            const borderColor = isCanceled ? '#c0392b' : (isDelivered ? '#2e7d32' : '#1A1A1A');

            return `
                <div class="admin-card" style="border-left-color: ${borderColor};">
                    <div class="admin-card-top">
                        <div>
                            <strong style="font-size: 16px;">Pedido #${order.orderNumber}</strong>
                            <span style="color: #666; font-size: 13px; margin-left: 8px;">${order.date}</span>
                            <div style="font-size: 13px; color: #333; margin-top: 4px;">
                                <i class="far fa-user"></i> <strong>${order.customerName}</strong> (${order.customerEmail})
                            </div>
                        </div>

                        <div style="display: flex; align-items: flex-end; gap: 10px; flex-wrap: wrap;">
                            ${isCanceled ? `
                                <span style="background: #c62828; color: #fff; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 6px;">
                                    <i class="fas fa-lock"></i> Pedido Cancelado (Encerrado)
                                </span>
                            ` : isDelivered ? `
                                <span style="background: #2e7d32; color: #fff; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 6px;">
                                    <i class="fas fa-check-circle"></i> Pedido Entregue (Concluído)
                                </span>
                            ` : `
                                <div>
                                    <label style="font-size: 11px; color: #666; display: block; margin-bottom: 4px;">Status:</label>
                                    <select class="status-select" onchange="handleStatusChange(${order.id}, ${order.orderNumber}, this)">
                                        ${statuses.map(st => `<option value="${st}" ${order.status === st ? 'selected' : ''}>${st}</option>`).join('')}
                                    </select>
                                </div>
                                <button class="btn-danger-sm" onclick="cancelOrder(${order.id}, ${order.orderNumber})"><i class="fas fa-ban"></i> Cancelar Pedido</button>
                            `}
                        </div>
                    </div>

                    <div style="margin-bottom: 10px;">
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #444; margin-bottom: 4px;">
                                <span>${item.quantity}x ${item.name}</span>
                                <span>${(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #ddd; padding-top: 10px; font-size: 13px; flex-wrap: wrap; gap: 10px;">
                        <span style="color: #555;"><i class="fas fa-truck"></i> ${addressStr}</span>
                        <strong style="font-size: 15px; color: #1A1A1A;">Total: ${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<p style="color: #c0392b;">Erro ao carregar pedidos.</p>';
    }
}

function handleStatusChange(orderId, orderNumber, selectEl) {
    const newStatus = selectEl.value;
    if (newStatus === 'Cancelado') {
        cancelOrder(orderId, orderNumber);
        loadAdminOrders();
    } else if (newStatus === 'Entregue') {
        showConfirmModal(
            `Concluir Pedido #${orderNumber}`,
            `Deseja marcar o Pedido #${orderNumber} como "Entregue"? Após confirmado, o status não poderá mais ser alterado.`,
            () => updateOrderStatus(orderId, 'Entregue'),
            '#2e7d32'
        );
        loadAdminOrders();
    } else {
        updateOrderStatus(orderId, newStatus);
    }
}

async function updateOrderStatus(orderId, newStatus) {
    const token = localStorage.getItem('authToken');
    try {
        const res = await fetch(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        if (res.ok) {
            showToastMessage(data.message);
            loadAdminOrders();
            loadAdminStock();
        } else {
            showToastMessage(data.error || 'Erro ao atualizar status.', true);
            loadAdminOrders();
        }
    } catch (err) {
        showToastMessage('Erro de conexão.', true);
    }
}

function cancelOrder(orderId, orderNumber) {
    showConfirmModal(
        `Cancelar Pedido #${orderNumber}`,
        `Deseja cancelar o Pedido #${orderNumber}? Os itens voltarão automaticamente para o estoque e o pedido será encerrado.`,
        () => updateOrderStatus(orderId, 'Cancelado')
    );
}

async function loadAdminStock() {
    const container = document.getElementById('adminStockList');
    try {
        const res = await fetch('/products');
        const products = await res.json();

        container.innerHTML = products.map(prod => `
            <div class="stock-row">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <img src="${prod.image}" alt="${prod.name}" style="width: 48px; height: 58px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <strong style="font-size: 15px; color: #1A1A1A;">${prod.name}</strong>
                        <div style="font-size: 13px; color: #666;">
                            Categoria: ${prod.category} • Preço: ${parseFloat(prod.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: bold; color: ${prod.stock <= 3 ? '#c0392b' : '#2e7d32'}; margin-right: 10px;">
                        Estoque atual: ${prod.stock} un.
                    </span>
                    <input type="number" id="addStock-${prod.id}" value="5" min="1" style="width: 65px; padding: 7px; border: 1px solid #ccc; border-radius: 4px;">
                    <button onclick="addProductStock(${prod.id})" class="btn-primary" style="padding: 8px 14px; font-size: 13px;">+ Adicionar</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p style="color: #c0392b;">Erro ao carregar produtos.</p>';
    }
}

async function addProductStock(productId) {
    const token = localStorage.getItem('authToken');
    const qtyInput = document.getElementById(`addStock-${productId}`);
    const addQuantity = parseInt(qtyInput.value);

    if (!addQuantity || addQuantity <= 0) {
        showToastMessage('Digite uma quantidade maior que zero.', true);
        return;
    }

    try {
        const res = await fetch(`/admin/products/${productId}/stock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ addQuantity })
        });
        const data = await res.json();
        if (res.ok) {
            showToastMessage(data.message);
            loadAdminStock();
        } else {
            showToastMessage(data.error || 'Erro ao adicionar estoque.', true);
        }
    } catch (err) {
        showToastMessage('Erro de conexão.', true);
    }
}

async function loadAdminUsers() {
    const token = localStorage.getItem('authToken');
    const container = document.getElementById('adminUsersList');
    try {
        const res = await fetch('/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await res.json();

        document.getElementById('statTotalUsers').innerText = users.length;

        container.innerHTML = users.map(u => {
            const formattedCpf = u.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            return `
                <div class="stock-row">
                    <div>
                        <strong style="font-size: 15px; color: #1A1A1A;">${u.name}</strong>
                        ${u.is_admin ? '<span style="background:#1A1A1A; color:#fff; font-size:11px; padding:2px 7px; border-radius:4px; margin-left:6px;">ADMIN</span>' : ''}
                        <div style="font-size: 13px; color: #666; margin-top: 3px;">
                            E-mail: ${u.email} • CPF: ${formattedCpf}
                        </div>
                    </div>
                    <div>
                        ${!u.is_admin ? `<button class="btn-danger-sm" onclick="deleteUserAccount(${u.id}, '${u.name.replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i> Excluir Conta</button>` : '<span style="font-size:12px; color:#888;">Conta protegida</span>'}
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<p style="color: #c0392b;">Erro ao carregar contas.</p>';
    }
}

function deleteUserAccount(userId, userName) {
    showConfirmModal(
        'Excluir Conta de Cliente',
        `Tem certeza que deseja excluir permanentemente a conta de "${userName}" e todos os seus pedidos?`,
        async () => {
            const token = localStorage.getItem('authToken');
            try {
                const res = await fetch(`/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    showToastMessage(data.message);
                    loadAdminUsers();
                    loadAdminOrders();
                } else {
                    showToastMessage(data.error || 'Erro ao excluir usuário.', true);
                }
            } catch (err) {
                showToastMessage('Erro de conexão.', true);
            }
        }
    );
}