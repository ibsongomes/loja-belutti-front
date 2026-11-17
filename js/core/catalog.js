document.addEventListener('DOMContentLoaded', async () => {
    const pathname = window.location.pathname;
    const productGrid = document.getElementById('productGrid') || document.querySelector('.product-grid');

    if (!productGrid) return;

    // Define qual endpoint chamar conforme a página atual
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
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Falha ao carregar catálogo');
        const products = await res.json();

        renderProducts(products, productGrid, isHomePage);

        // Garante que os filtros e o contador sincronizem após renderizar os cards da API
        if (typeof window.filtrarProdutos === 'function') {
            window.filtrarProdutos();
        }

        // Atualiza contador inicial nas páginas de catálogo
        const resultCount = document.getElementById('resultado-count');
        if (resultCount) {
            resultCount.textContent = `Exibindo: ${products.length} resultado${products.length !== 1 ? 's' : ''}`;
        }

        // Se veio ?busca=... na URL, aplica o filtro do search.js após renderizar os cards
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

        // Escapa aspas simples no nome para o onclick
        const safeName = prod.name.replace(/'/g, "\\'");

        const buyButtonHtml = outOfStock
            ? `<button class="btn-primary" disabled style="background:#999; cursor:not-allowed; width:100%; margin-top:10px;">Esgotado</button>`
            : `<button class="btn-primary" onclick="addToCart({ name: '${safeName}', price: ${priceNum}, image: '${prod.image}', maxStock: ${prod.stock} })" style="width:100%; margin-top:10px;">Comprar</button>`;

        if (isHomePage) {
            return `
                <div class="product-card" data-id="${prod.id}" data-cor="${prod.color}" data-preco="${priceNum}" data-modelagem="${prod.fit}">
                    <div class="product-image">
                        <img src="${prod.image}" alt="${prod.name}">
                    </div>
                    <div class="product-info">
                        <h3>${prod.name}</h3>
                        <div>
                            <span class="price-current">${priceFormatted}</span>
                        </div>
                        ${buyButtonHtml}
                    </div>
                </div>
            `;
        }

        // Card completo para páginas de catálogo (camisas.html / moletons.html)
        return `
            <div class="product-card" data-id="${prod.id}" data-cor="${prod.color}" data-preco="${priceNum}" data-modelagem="${prod.fit}">
                <div class="product-image">
                    <button class="btn-wishlist"><i class="far fa-heart"></i></button>
                    <img src="${prod.image}" alt="${prod.name}">
                </div>
                <div class="product-info">
                    <h3>${prod.name}</h3>
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