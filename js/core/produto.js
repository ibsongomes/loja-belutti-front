let currentProduct = null;
let selectedSize = 'M';
let gallerySlides = [];
let currentSlideIndex = 0;

const COLOR_HEX_MAP = {
    'preto': '#1a1a1a',
    'branco': '#f8f8f8',
    'azul': '#1f3a60',
    'marrom': '#5d3a1a',
    'verde': '#2e5a36',
    'vermelho': '#8e1b24',
    'bege': '#c8b69e',
    'cinza': '#8e9296'
};

const COLOR_LABEL_MAP = {
    'preto': 'Preto',
    'branco': 'Off-White / Branco',
    'azul': 'Azul',
    'marrom': 'Marrom',
    'verde': 'Verde',
    'vermelho': 'Vermelho',
    'bege': 'Bege',
    'cinza': 'Cinza'
};

const FEATURED_EXTRA_GALLERY = {
    'modelo-1.jpeg': [
        { src: '../../img/modelo-1-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/modelo-1-detalhe.jpg', viewClass: 'view-front', label: 'Tecido & Zíper' }
    ],
    'modelo-2.jpeg': [
        { src: '../../img/modelo-2-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/modelo-2-detalhe.jpg', viewClass: 'view-front', label: 'Gola & Malha' }
    ],
    'modelo-3.jpeg': [
        { src: '../../img/modelo-3-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/modelo-3-detalhe.jpg', viewClass: 'view-front', label: 'Bolso & Sarja' }
    ],
    'modelo-4.jpg': [
        { src: '../../img/modelo-4-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/modelo-4-detalhe.jpg', viewClass: 'view-front', label: 'Malha Canelada' }
    ],
    'camisa-azul-linho.jpg': [
        { src: '../../img/camisa-azul-linho-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/camisa-azul-linho-detalhe.jpg', viewClass: 'view-front', label: 'Tecido & Botão' }
    ],
    'camisa_marrom-linho.jpg': [
        { src: '../../img/camisa-marrom-linho-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/camisa-marrom-linho-detalhe.jpg', viewClass: 'view-front', label: 'Tecido & Botão' }
    ],
    'camisa-marrom-linho.jpg': [
        { src: '../../img/camisa-marrom-linho-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/camisa-marrom-linho-detalhe.jpg', viewClass: 'view-front', label: 'Tecido & Botão' }
    ],
    'camisa-off-white-linho.jpg': [
        { src: '../../img/camisa-off-white-linho-costas.jpg', viewClass: 'view-front', label: 'Costas' },
        { src: '../../img/camisa-off-white-linho-detalhe.jpg', viewClass: 'view-front', label: 'Tecido & Botão' }
    ]
};

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.getElementById('pdpContent');

    if (!productId) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; padding:50px;">Produto não especificado. <a href="./camisas.html" style="text-decoration:underline;">Voltar ao catálogo</a>.</p>';
        return;
    }

    try {
        const res = await fetch(`/products/${encodeURIComponent(productId)}`);
        if (!res.ok) {
            throw new Error('Produto não encontrado');
        }
        currentProduct = await res.json();

        const isFavorited = await checkIfProductIsFavorited(currentProduct.id);
        renderProductDetail(currentProduct, isFavorited);
    } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; padding:50px;">Não foi possível carregar este produto. <a href="../../index.html" style="text-decoration:underline;">Voltar para a loja</a>.</p>';
    }
});

async function checkIfProductIsFavorited(productId) {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        const res = await fetch('/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return false;
        const favs = await res.json();
        return favs.some(f => Number(f.id) === Number(productId));
    } catch {
        return false;
    }
}

function buildGallerySlides(product) {
    const fileName = (product.image || '').split('/').pop().toLowerCase();

    if (FEATURED_EXTRA_GALLERY[fileName]) {
        return [
            { src: product.image, viewClass: 'view-front', label: 'Frente' },
            ...FEATURED_EXTRA_GALLERY[fileName],
            { src: product.image, viewClass: 'view-collar-detail', label: 'Caimento' }
        ];
    }

    if (Array.isArray(product.extra_images) && product.extra_images.length > 0) {
        return [
            { src: product.image, viewClass: 'view-front', label: 'Principal' },
            ...product.extra_images.map((imgUrl, i) => ({
                src: imgUrl,
                viewClass: 'view-front',
                label: `Foto ${i + 2}`
            }))
        ];
    }

    return [
        { src: product.image, viewClass: 'view-front', label: 'Vista Frontal' },
        { src: product.image, viewClass: 'view-collar-detail', label: 'Gola & Corte' },
        { src: product.image, viewClass: 'view-zoom-fabric', label: 'Textura & Tecido' },
        { src: product.image, viewClass: 'view-lower-fit', label: 'Caimento' }
    ];
}

function buildProductDescription(product) {
    const nameLower = (product.name || '').toLowerCase();

    if (nameLower.includes('linho')) {
        return {
            summary: 'Confeccionada em linho leve e respirável de toque macio, com modelagem contemporânea e acabamento refinado para composições casuais ou alinhadas.',
            specs: [
                'Composição: Blend premium de Linho e Algodão',
                'Caimento leve com excelente ventilação térmica',
                'Gola estruturada e costuras reforçadas',
                'Ideal para dias quentes e eventos casuais elegantes'
            ]
        };
    }

    if (nameLower.includes('tricot')) {
        return {
            summary: 'Peça em tricot texturizado de alta elasticidade e toque suave, desenvolvida para unir sofisticação minimalista e conforto ao longo de todo o dia.',
            specs: [
                'Trama texturizada exclusiva Belutti',
                'Ajuste anatômico ao corpo sem perder a mobilidade',
                'Acabamento canelado na gola, punhos e barra',
                'Alta durabilidade e resistência à deformação'
            ]
        };
    }

    if (nameLower.includes('manga longa')) {
        return {
            summary: 'Camisa de manga longa com malha encorpada e toque macio, ideal para meia-estação e sobreposições urbanas cheias de personalidade.',
            specs: [
                'Malha premium de toque aveludado e ótimo caimento',
                'Punhos ajustados com costura dupla reforçada',
                'Design versátil para uso casual ou noturno',
                'Logo minimalista Belutti aplicado no peito'
            ]
        };
    }

    if (nameLower.includes('oversized')) {
        return {
            summary: 'Modelagem oversized exclusiva Belutti com ombros levemente deslocados e gramatura encorpada, garantindo visual streetwear moderno e extremo conforto.',
            specs: [
                'Malha 100% Algodão de alta gramatura',
                'Gola canelada mais larga com reforço ombro a ombro',
                'Caimento amplo e estruturado',
                'Não encolhe após a lavagem'
            ]
        };
    }

    if (nameLower.includes('moletom')) {
        return {
            summary: 'Casaco em moletom encorpado flanelado internamente, com capuz ajustável e acabamento premium para máximo conforto térmico e estilo urbano.',
            specs: [
                'Moletom 3 cabos de alta densidade',
                'Interior macio com toque aconchegante',
                'Capuz com cordão ajustável e bolsos frontais',
                'Punhos e barra em ribana canelada resistente'
            ]
        };
    }

    if (nameLower.includes('baggy')) {
        return {
            summary: 'Calça baggy com modelagem ampla e bolsos utilitários cargo, confeccionada em sarja resistente para quem busca autenticidade e liberdade de movimento.',
            specs: [
                'Sarja 100% algodão de alta resistência',
                'Modelagem baggy solta nas pernas',
                'Bolsos laterais utilitários funcionais',
                'Costuras reforçadas de alto padrão'
            ]
        };
    }

    if (nameLower.includes('regata')) {
        return {
            summary: 'Regata canelada com elastano que valoriza o caimento no corpo, perfeita para dias quentes, treinos ou sobreposições leves.',
            specs: [
                'Malha ribana canelada com elasticidade',
                'Toque fresco e respirável',
                'Acabamento reforçado nas cavas e gola',
                'Versátil para uso solo ou com camisa aberta'
            ]
        };
    }

    return {
        summary: 'Confeccionada em malha cotton premium 100% algodão com toque macio, modelagem moderna e acabamento de alto padrão exclusivo Belutti.',
        specs: [
            'Composição: 100% Algodão Cotton Fio 30.1 Penteado',
            'Gola careca com ribana reforçada',
            'Caimento confortável e versátil para o dia a dia',
            'Costura dupla na barra e nas mangas'
        ]
    };
}

function renderProductDetail(product, isFavorited) {
    document.title = `${product.name} | Belutti`;

    // Atualiza Breadcrumb
    const categoryLink = document.getElementById('breadcrumbCategory');
    const productNameBreadcrumb = document.getElementById('breadcrumbProductName');
    if (product.category === 'moletons') {
        categoryLink.textContent = 'Moletons';
        categoryLink.href = './moletons.html';
    } else if (product.category === 'calcas') {
        categoryLink.textContent = 'Calças';
        categoryLink.href = '../../index.html';
    } else {
        categoryLink.textContent = 'Camisas';
        categoryLink.href = './camisas.html';
    }
    productNameBreadcrumb.textContent = product.name;

    gallerySlides = buildGallerySlides(product);
    currentSlideIndex = 0;

    const priceNum = parseFloat(product.price);
    const priceFormatted = priceNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const installmentFormatted = (priceNum / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const outOfStock = product.stock <= 0;
    const colorKey = (product.color || 'preto').toLowerCase();
    const colorHex = COLOR_HEX_MAP[colorKey] || '#1a1a1a';
    const colorLabel = COLOR_LABEL_MAP[colorKey] || product.color || 'Padrão';
    const descriptionData = buildProductDescription(product);
    const soldReviewsCount = Math.max(12, (product.soldCount || 0) + 12);

    const thumbsHtml = gallerySlides.map((slide, idx) => `
        <button type="button" class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="selectGallerySlide(${idx})" title="${slide.label}">
            <img src="${slide.src}" alt="${product.name} - ${slide.label}" class="${slide.viewClass}">
            <span class="pdp-thumb-tag">${slide.label}</span>
        </button>
    `).join('');

    const container = document.getElementById('pdpContent');
    container.innerHTML = `
        <!-- Coluna Esquerda: Galeria -->
        <div class="pdp-gallery">
            <div class="pdp-thumbs-col" id="pdpThumbsCol">
                ${thumbsHtml}
            </div>

            <div class="pdp-main-stage">
                <button type="button" class="pdp-nav-arrow prev" onclick="stepGallerySlide(-1)" title="Foto anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>

                <img id="pdpMainImage" src="${gallerySlides[0].src}" alt="${product.name}" class="${gallerySlides[0].viewClass}">
                <span id="pdpViewBadge" class="pdp-view-badge">${gallerySlides[0].label}</span>

                <button type="button" class="pdp-nav-arrow next" onclick="stepGallerySlide(1)" title="Próxima foto">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- Coluna Direita: Informações e Compra -->
        <div class="pdp-info">
            <h1 class="pdp-title">${product.name}</h1>

            <div class="pdp-rating">
                <div class="stars">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
                <span><strong>4.9</strong> (${soldReviewsCount} avaliações)</span>
            </div>

            <div class="pdp-price-row">
                <div class="pdp-price-block">
                    <div class="pdp-price">${priceFormatted}</div>
                    <div class="pdp-installment">ou 3x de <strong>${installmentFormatted}</strong> sem juros</div>
                    <span class="pdp-stock-tag ${outOfStock ? 'out' : ''}">
                        ${outOfStock ? 'Produto Esgotado' : `${product.stock} unidades disponíveis em estoque`}
                    </span>
                </div>

                <!-- Tabela de Medidas -->
                <div class="pdp-size-chart-card">
                    <div class="pdp-size-chart-header">
                        <i class="fas fa-ruler-horizontal"></i> Tabela de Medidas (cm)
                    </div>
                    <table class="pdp-size-chart-table">
                        <thead>
                            <tr>
                                <th>Tam.</th>
                                <th>Tórax</th>
                                <th>Comp.</th>
                                <th>Manga</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>P</strong></td><td>52</td><td>70</td><td>22</td></tr>
                            <tr><td><strong>M</strong></td><td>54</td><td>72</td><td>23</td></tr>
                            <tr><td><strong>G</strong></td><td>57</td><td>75</td><td>24</td></tr>
                            <tr><td><strong>GG</strong></td><td>60</td><td>78</td><td>25</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Cor -->
            <div class="pdp-option-group">
                <span class="pdp-option-label">Cor: <strong>${colorLabel}</strong></span>
                <div class="pdp-color-circle" title="${colorLabel}">
                    <span style="background-color: ${colorHex}; ${colorKey === 'branco' ? 'border: 1px solid #ddd;' : ''}"></span>
                </div>
            </div>

            <!-- Tamanho -->
            <div class="pdp-option-group">
                <span class="pdp-option-label">Tamanho: <strong id="selectedSizeLabel">${selectedSize}</strong></span>
                <div class="pdp-sizes-row">
                    ${['P', 'M', 'G', 'GG'].map(size => `
                        <button type="button" class="pdp-size-btn ${size === selectedSize ? 'selected' : ''}" onclick="selectProductSize('${size}', this)">
                            ${size}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Botões de Ação -->
            <div class="pdp-actions">
                <button type="button" class="pdp-btn-add" ${outOfStock ? 'disabled' : ''} onclick="handleAddProductToCart()">
                    ${outOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                </button>

                <div class="pdp-secondary-actions">
                    <button type="button" class="pdp-btn-buy-now" ${outOfStock ? 'disabled' : ''} onclick="handleBuyNowProduct()">
                        Comprar Agora
                    </button>
                    <button type="button" class="pdp-btn-fav" id="pdpFavBtn" onclick="handleTogglePdpFavorite()" title="Favoritar peça">
                        <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="${isFavorited ? 'color: #c0392b;' : ''}"></i>
                    </button>
                </div>
            </div>

            <!-- Detalhes do Produto -->
            <div class="pdp-details-box">
                <h3>Detalhes do Produto</h3>
                <p>${descriptionData.summary}</p>
                <ul class="pdp-specs-list">
                    ${descriptionData.specs.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

window.selectGallerySlide = function(index) {
    if (!gallerySlides[index]) return;
    currentSlideIndex = index;

    const mainImg = document.getElementById('pdpMainImage');
    const badge = document.getElementById('pdpViewBadge');
    const thumbBtns = document.querySelectorAll('.pdp-thumb-btn');

    mainImg.src = gallerySlides[index].src;
    mainImg.className = gallerySlides[index].viewClass;
    if (badge) badge.textContent = gallerySlides[index].label;

    thumbBtns.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
};

window.stepGallerySlide = function(step) {
    if (gallerySlides.length === 0) return;
    const nextIndex = (currentSlideIndex + step + gallerySlides.length) % gallerySlides.length;
    selectGallerySlide(nextIndex);
};

window.selectProductSize = function(size, btnEl) {
    selectedSize = size;
    const label = document.getElementById('selectedSizeLabel');
    if (label) label.textContent = size;

    document.querySelectorAll('.pdp-size-btn').forEach(btn => btn.classList.remove('selected'));
    if (btnEl) btnEl.classList.add('selected');
};

window.handleAddProductToCart = function() {
    if (!currentProduct) return;
    addToCart({
        name: currentProduct.name,
        size: selectedSize,
        price: parseFloat(currentProduct.price),
        image: currentProduct.image,
        maxStock: currentProduct.stock
    });
};

window.handleBuyNowProduct = function() {
    if (!currentProduct) return;
    addToCart({
        name: currentProduct.name,
        size: selectedSize,
        price: parseFloat(currentProduct.price),
        image: currentProduct.image,
        maxStock: currentProduct.stock
    });
};

window.handleTogglePdpFavorite = async function() {
    if (!currentProduct) return;
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.assign('../auth/login.html');
        return;
    }

    try {
        const res = await fetch('/favorites/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId: currentProduct.id })
        });
        const data = await res.json();
        if (res.ok) {
            const icon = document.querySelector('#pdpFavBtn i');
            if (data.favorited) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#c0392b';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        }
    } catch (err) {
        console.error('Erro ao favoritar na PDP:', err);
    }
};