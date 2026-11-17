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

function showConfirmModal(title, message, onConfirm) {
    ensureBeluttiModal();
    const overlay = document.getElementById('beluttiConfirmOverlay');
    document.getElementById('beluttiConfirmTitle').innerText = title;
    document.getElementById('beluttiConfirmMsg').innerText = message;
    overlay.style.display = 'flex';

    const cancelBtn = document.getElementById('beluttiConfirmCancel');
    const okBtn = document.getElementById('beluttiConfirmOk');

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
// LÓGICA DA PÁGINA MINHA CONTA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        window.location.assign('../../pages/auth/login.html');
        return;
    }

    const emailInput = document.getElementById('editEmail');
    const passwordInput = document.getElementById('editPassword');
    const cepInput = document.getElementById('editCep');
    const streetInput = document.getElementById('editStreet');
    const numberInput = document.getElementById('editNumber');
    const complementInput = document.getElementById('editComplement');
    const neighborhoodInput = document.getElementById('editNeighborhood');
    const stateInput = document.getElementById('editState');
    const cityInput = document.getElementById('editCity');
    const referenceInput = document.getElementById('editReference');

    [emailInput, passwordInput, cepInput, numberInput].forEach(input => {
        input.addEventListener('input', () => input.setCustomValidity(''));
    });

    function showFieldError(inputElement, message) {
        inputElement.setCustomValidity(message);
        inputElement.reportValidity();
    }

    // Troca de abas
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });

    // Sair da conta
    document.getElementById('logoutAccountBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.assign('../../index.html');
    });

    // Trocar de conta
    document.getElementById('switchAccountBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.assign('../../pages/auth/login.html');
    });

    // Excluir própria conta com modal na tela
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            showConfirmModal(
                'Excluir Minha Conta',
                'Tem certeza que deseja excluir permanentemente sua conta e todo o histórico de pedidos? Esta ação não pode ser desfeita.',
                async () => {
                    try {
                        const res = await fetch('/me', {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (res.ok) {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('userName');
                            showToastMessage('Sua conta foi excluída.');
                            setTimeout(() => window.location.assign(window.location.pathname.includes('/pages/') ? '../../index.html' : './index.html'), 1200);
                        } else {
                            const data = await res.json();
                            showToastMessage(data.error || 'Erro ao excluir conta.', true);
                        }
                    } catch (err) {
                        showToastMessage('Erro ao conectar com o servidor.', true);
                    }
                }
            );
        });
    }

    // Máscara e consulta ViaCEP
    cepInput.addEventListener('input', async (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        e.target.value = value.replace(/(\d{5})(\d)/, '$1-$2');

        if (value.length === 8) {
            await fetchAddressByCep(value);
        } else {
            [streetInput, numberInput, complementInput, neighborhoodInput, stateInput, cityInput, referenceInput].forEach(f => {
                f.value = '';
                f.disabled = true;
            });
        }
    });

    async function fetchAddressByCep(cleanCep) {
        streetInput.placeholder = 'Buscando endereço...';
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await res.json();

            if (data.erro) {
                [streetInput, numberInput, complementInput, neighborhoodInput, stateInput, cityInput, referenceInput].forEach(f => {
                    f.value = '';
                    f.disabled = true;
                });
                streetInput.placeholder = '';
                showFieldError(cepInput, 'CEP não encontrado. Verifique os números digitados.');
                return;
            }

            streetInput.value = data.logradouro || '';
            neighborhoodInput.value = data.bairro || '';
            cityInput.value = data.localidade || '';
            stateInput.value = data.uf || '';

            streetInput.disabled = Boolean(data.logradouro);
            neighborhoodInput.disabled = Boolean(data.bairro);
            cityInput.disabled = true;
            stateInput.disabled = true;

            numberInput.disabled = false;
            complementInput.disabled = false;
            referenceInput.disabled = false;
            numberInput.focus();
        } catch (err) {
            showFieldError(cepInput, 'Erro ao consultar o CEP.');
        }
    }

    loadUserProfile(token);
    loadUserOrders(token);

    // Salvar edição de cadastro
    document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('editName').value.trim();
        const email = emailInput.value.trim();
        const newPassword = passwordInput.value;
        const cleanCep = cepInput.value.replace(/\D/g, '');
        const feedback = document.getElementById('profileFeedback');

        if (newPassword && newPassword.length < 6) {
            showFieldError(passwordInput, 'A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (cleanCep.length !== 8 || !cityInput.value) {
            showFieldError(cepInput, 'Informe um CEP válido.');
            return;
        }

        const address = {
            cep: cepInput.value,
            street: streetInput.value.trim(),
            number: numberInput.value.trim(),
            complement: complementInput.value.trim(),
            neighborhood: neighborhoodInput.value.trim(),
            city: cityInput.value.trim(),
            state: stateInput.value.trim(),
            reference: referenceInput.value.trim()
        };

        try {
            const response = await fetch('/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, newPassword, address })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userName', data.userName);
                feedback.style.color = '#2e7d32';
                feedback.innerText = data.message;
                passwordInput.value = '';
                document.getElementById('sidebarGreeting').innerText = `Olá, ${data.userName}`;
            } else {
                if (data.field === 'email') showFieldError(emailInput, data.error);
                else {
                    feedback.style.color = '#c0392b';
                    feedback.innerText = data.error;
                }
            }
        } catch (error) {
            feedback.style.color = '#c0392b';
            feedback.innerText = 'Erro ao conectar com o servidor.';
        }
    });
});

async function loadUserProfile(token) {
    try {
        const res = await fetch('/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const user = await res.json();

        const urlParams = new URLSearchParams(window.location.search);
        if (user.is_admin && !urlParams.get('cliente')) {
            window.location.assign('./admin.html');
            return;
        }

        document.getElementById('sidebarGreeting').innerText = `Olá, ${user.name.split(' ')[0]}`;
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editCpf').value = user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

        if (user.birth_date) {
            const [y, m, d] = user.birth_date.split('-');
            document.getElementById('editBirthDate').value = `${d}/${m}/${y}`;
        }

        if (user.address) {
            document.getElementById('editCep').value = user.address.cep || '';
            document.getElementById('editStreet').value = user.address.street || '';
            document.getElementById('editNumber').value = user.address.number || '';
            document.getElementById('editComplement').value = user.address.complement || '';
            document.getElementById('editNeighborhood').value = user.address.neighborhood || '';
            document.getElementById('editState').value = user.address.state || '';
            document.getElementById('editCity').value = user.address.city || '';
            document.getElementById('editReference').value = user.address.reference || '';
        }
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
    }
}

async function loadUserOrders(token) {
    const container = document.getElementById('ordersList');
    try {
        const res = await fetch('/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await res.json();

        if (!orders || orders.length === 0) {
            container.innerHTML = '<p style="color: #666;">Você ainda não realizou nenhuma compra na Belutti.</p>';
            return;
        }

        const statusColors = {
            'Pedido Confirmado': '#1565c0',
            'Em Separação': '#ef6c00',
            'Enviado': '#6a1b9a',
            'Entregue': '#2e7d32',
            'Cancelado': '#c62828'
        };

        container.innerHTML = orders.map(order => {
            const badgeColor = statusColors[order.status] || '#1A1A1A';
            const addr = order.shippingAddress;
            const addressText = addr && addr.street
                ? `${addr.street}, ${addr.number}${addr.complement ? ' - ' + addr.complement : ''} • ${addr.neighborhood}, ${addr.city}/${addr.state} (CEP: ${addr.cep})`
                : 'Endereço não registrado';
            const canCancel = order.status === 'Pedido Confirmado' || order.status === 'Em Separação';

            return `
                <div class="order-card">
                    <div class="order-header" style="align-items: center; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <strong>Pedido #${order.orderNumber}</strong>
                            <span style="color: #666; font-size: 13px; margin-left: 8px;">${order.date}</span>
                        </div>
                        <span style="background: ${badgeColor}; color: #fff; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 20px;">
                            ${order.status}
                        </span>
                    </div>

                    ${order.items.map(item => `
                        <div class="order-item-row">
                            <span>${item.quantity}x ${item.name}</span>
                            <span>${(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    `).join('')}

                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #ddd; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 10px;">
                        <div style="font-size: 12px; color: #666; max-width: 65%;">
                            <i class="fas fa-map-marker-alt"></i> <strong>Entrega:</strong> ${addressText}
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold; color: #1A1A1A; font-size: 15px;">
                                Total Pago: ${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                            ${canCancel ? `
                                <button onclick="cancelMyOrder(${order.id}, ${order.orderNumber})" style="margin-top: 8px; padding: 6px 12px; background: #fff; color: #c0392b; border: 1px solid #c0392b; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">
                                    Cancelar Pedido
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<p style="color: #c0392b;">Erro ao carregar histórico de pedidos.</p>';
    }
}

function cancelMyOrder(orderId, orderNumber) {
    showConfirmModal(
        `Cancelar Pedido #${orderNumber}`,
        `Tem certeza que deseja cancelar o Pedido #${orderNumber}? Essa ação não pode ser desfeita.`,
        async () => {
            const token = localStorage.getItem('authToken');
            try {
                const res = await fetch(`/my-orders/${orderId}/cancel`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok) {
                    showToastMessage(data.message || 'Pedido cancelado com sucesso.');
                    loadUserOrders(token);
                } else {
                    showToastMessage(data.error || 'Não foi possível cancelar o pedido.', true);
                }
            } catch (err) {
                showToastMessage('Erro ao conectar com o servidor.', true);
            }
        }
    );
}