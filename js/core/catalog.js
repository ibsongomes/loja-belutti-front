let userFavoriteIds = new Set();

function parseProductAttributes(prod) {
    const imgFile = (prod.image || '').split('/').pop().replace(/\.[^/.]+$/, '').toLowerCase();

    if (imgFile === 'modelo-2' || imgFile.includes('oversized')) {
        return { color: 'bege', model: 'oversized' };
    }
    if (imgFile === 'modelo-4' || imgFile.includes('regata')) {
        return { color: 'cinza', model: 'regata' };
    }
    if (imgFile === 'modelo-1' || imgFile.includes('moletom')) {
        return { color: 'preto', model: 'moletom' };
    }

    const normalized = imgFile.replace(/_/g, '-');
    const colorMap = {
        'preto': 'preto',
        'preta': 'preto',
        'branco': 'branco',
        'branca': 'branco',
        'off-white': 'branco',
        'azul': 'azul',
        'marrom': 'marrom',
        'verde': 'verde',
        'vermelho': 'vermelho',
        'vermelha': 'vermelho',
        'bege': 'bege',
        'cinza': 'cinza'
    };

    let detectedColor = (prod.color || '').toLowerCase();
    for (const [key, canonical] of Object.entries(colorMap)) {
        if (normalized.includes(`-${key}-`) || normalized.endsWith(`-${key}`)) {
            detectedColor = canonical;
            break;
        }
    }

    let detectedModel = (prod.fit || '').toLowerCase();
    if (normalized.includes('manga-longa')) detectedModel = 'manga-longa';
    else if (normalized.includes('malha-cotton')) detectedModel = 'malha-cotton';
    else if (normalized.includes('linho')) detectedModel = 'linho';
    else if (normalized.includes('tricot')) detectedModel = 'tricot';
    else if (normalized.includes('oversized')) detectedModel = 'oversized';
    else if (normalized.includes('regata')) detectedModel = 'regata';

    return { color: detectedColor, model: detectedModel };
}

function getProductDetailUrl(productId) {
    const pathname = window.location.pathname;
    if (pathname.includes('/pages/produtos/')) {
        return `./produto.html?id=${productId}`;
    }
    if (pathname.includes('/pages/')) {
        return `../produtos/produto.html?id=${productId}`;
    }
    return `./pages/produtos/produto.html?id=${productId}`;
}

function showLoginRequiredModalForWishlist() {
    if (!document.getElementById('beluttiWishlistLoginModal')) {
        const modalHtml = `
            <div id="beluttiWishlistLoginModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#fff; max-width:400px; width:100%; border-radius:8px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.2); text-align:center;">
                    <h3 style="margin:0 0 10px 0; color:#1A1A1A; font-size:18px;">Login necessário</h3>
                    <p style="margin:0 0 22px 0; color:#555; font-size:14px; line-height:1.5;">Você precisa entrar na sua conta para salvar produtos nos seus favoritos.</p>
                    <div style="display:flex; gap:12px; justify-content:center;">
                        <button id="wishlistLoginCancel" style="flex:1; padding:11px; background:#eee; color:#333; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Voltar</button>
                        <button id="wishlistLoginGo" style="flex:1; padding:11px; background:#1A1A1A; color:#fff; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Fazer Login</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const overlay = document.getElementById('beluttiWishlistLoginModal');
        document.getElementById('wishlistLoginCancel').onclick = () => { overlay.style.display = 'none'; };
        overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = 'none'; };
        document.getElementById('wishlistLoginGo').onclick = () => {
            const loginPath = window.location.pathname.includes('/pages/')
                ? '../auth/login.html'
                : './pages/auth/login.html';
            window.location.assign(loginPath);
        };
    }
    document.getElementById('beluttiWishlistLoginModal').style.display = 'flex';
}

async function loadUserFavoritesIds() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        userFavoriteIds = new Set();
        return;
    }
    try {
        const res = await fetch('/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const favs = await res.json();
            userFavoriteIds = new Set(favs.map(f => f.id));
        }
    } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
    }
}

window.toggleProductFavorite = async function(productId, btnElement, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
        showLoginRequiredModalForWishlist();
        return;
    }

    try {
        const res = await fetch('/favorites/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId })
        });

        if (res.status === 401 || res.status === 403) {
            showLoginRequiredModalForWishlist();
            return;
        }

        const data = await res.json();
        if (res.ok) {
            const icon = btnElement.querySelector('i');
            if (data.favorited) {
                userFavoriteIds.add(productId);
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#c0392b';
            } else {
                userFavoriteIds.delete(productId);
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        }
    } catch (err) {
        console.error('Erro ao favoritar:', err);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const pathname = window.location.pathname;
    const productGrid = document.getElementById('productGrid') || document.querySelector('.product-grid');

    if (!productGrid) return;

    let apiUrl = '/products';
    const isHomePage = !pathname.includes('camisas.html') && !pathname.includes('moletons.html');

    if (pathname.includes('camisas.html')) {
        apiUrl = '/products?category=camisas';
    } else if (pathname.includes('moletons.html')) {
        apiUrl = '/products?category=moletons';
    } else {
        apiUrl = '/products?featured=true';
    }

    try {
        if (!isHomePage) {
            await loadUserFavoritesIds();
        }

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Falha ao carregar catálogo');
        const products = await res.json();

        renderProducts(products, productGrid, isHomePage);

        if (typeof window.initDynamicCatalogFilters === 'function') {
            window.initDynamicCatalogFilters(products);
        } else if (typeof window.filtrarProdutos === 'function') {
            window.filtrarProdutos();
        }

        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('busca');
        if (queryParam && typeof filterCatalogProducts === 'function') {
            filterCatalogProducts(queryParam);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos do banco:', error);
    }
});

function renderProducts(products, container, isHomePage) {
    if (!products || products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666; padding: 40px 0;">Nenhum produto disponível nesta categoria no momento.</p>';
        return;
    }

    container.innerHTML = products.map(prod => {
        const priceNum = parseFloat(prod.price);
        const priceFormatted = priceNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const installmentFormatted = (priceNum / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const outOfStock = prod.stock <= 0;
        const attrs = parseProductAttributes(prod);
        const isFav = userFavoriteIds.has(prod.id);
        const detailUrl = getProductDetailUrl(prod.id);

        const safeName = prod.name.replace(/'/g, "\\'");

        const buyButtonHtml = outOfStock
            ? `<button class="btn-primary" disabled style="background:#999; cursor:not-allowed; width:100%; margin-top:10px;">Esgotado</button>`
            : `<button class="btn-primary" onclick="addToCart({ name: '${safeName}', price: ${priceNum}, image: '${prod.image}', maxStock: ${prod.stock} })" style="width:100%; margin-top:10px;">Comprar</button>`;

        // Tela inicial: sem corações de favoritar, com link para detalhes do produto
        if (isHomePage) {
            return `
                <div class="product-card" data-id="${prod.id}" data-sold="${prod.soldCount || 0}" data-cor="${attrs.color}" data-preco="${priceNum}" data-modelagem="${attrs.model}">
                    <a href="${detailUrl}" class="product-image" style="display:block;">
                        <img src="${prod.image}" alt="${prod.name}">
                    </a>
                    <div class="product-info">
                        <h3><a href="${detailUrl}">${prod.name}</a></h3>
                        <div>
                            <span class="price-current">${priceFormatted}</span>
                        </div>
                        ${buyButtonHtml}
                    </div>
                </div>
            `;
        }

        // Páginas de catálogo: com botão de favoritar e link para detalhes do produto
        const heartBtnHtml = `
            <button type="button" class="btn-wishlist" onclick="toggleProductFavorite(${prod.id}, this, event)" title="Favoritar produto">
                <i class="${isFav ? 'fas' : 'far'} fa-heart" style="${isFav ? 'color: #c0392b;' : ''}"></i>
            </button>
        `;

        return `
            <div class="product-card" data-id="${prod.id}" data-sold="${prod.soldCount || 0}" data-cor="${attrs.color}" data-preco="${priceNum}" data-modelagem="${attrs.model}">
                <div class="product-image">
                    ${heartBtnHtml}
                    <a href="${detailUrl}" style="display:block; width:100%; height:100%;">
                        <img src="${prod.image}" alt="${prod.name}">
                    </a>
                </div>
                <div class="product-info">
                    <h3><a href="${detailUrl}">${prod.name}</a></h3>
                    <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                    <div class="price-current">${priceFormatted}</div>
                    <div class="installment">ou 3x de ${installmentFormatted} sem juros</div>
                    <div style="font-size: 12px; color: ${outOfStock ? '#c0392b' : '#2e7d32'}; margin-top: 4px;">
                        ${outOfStock ? 'Indisponível' : `${prod.stock} em estoque`}
                    </div>
                    ${buyButtonHtml}
                </div>
            </div>
        `;
    }).join('');
}