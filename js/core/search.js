document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchDropdown = document.getElementById('searchDropdown');
    const trendingTags = document.querySelectorAll('.trending-tag');

    // 1. Se a página abriu com ?busca=... na URL, preenche o campo e aplica o filtro
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('busca');
    if (queryParam) {
        if (searchInput) searchInput.value = queryParam;
        filterCatalogProducts(queryParam);
    }

    if (!searchInput) return;

    // 2. Abre o dropdown de termos mais pesquisados ao clicar/focar no input
    if (searchDropdown) {
        searchInput.addEventListener('focus', () => {
            searchDropdown.classList.add('active');
        });

        searchInput.addEventListener('click', () => {
            searchDropdown.classList.add('active');
        });

        // Fecha ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                searchDropdown.classList.remove('active');
            }
        });
    }

    // 3. Clique nos botões de "Termos mais pesquisados"
    trendingTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const term = tag.getAttribute('data-term');
            searchInput.value = term;
            if (searchDropdown) searchDropdown.classList.remove('active');
            routeAndSearch(term);
        });
    });

    // 4. Clique na lupa ou tecla Enter
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchDropdown) searchDropdown.classList.remove('active');
            routeAndSearch(searchInput.value);
        });
    }

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchDropdown) searchDropdown.classList.remove('active');
            routeAndSearch(searchInput.value);
        }
    });
});

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Resolve o caminho relativo correto (funciona tanto no Localhost quanto no GitHub Pages)
function getProductPagePath(pageFileName) {
    const pathname = window.location.pathname;
    if (pathname.includes('/pages/produtos/')) {
        return `./${pageFileName}`;
    }
    if (pathname.includes('/pages/')) {
        return `../produtos/${pageFileName}`;
    }
    return `./pages/produtos/${pageFileName}`;
}

// Decide para qual página da loja enviar o cliente com base no que ele digitou
function routeAndSearch(rawTerm) {
    const cleanTerm = rawTerm.trim();
    if (!cleanTerm) return;

    const normalized = normalizeText(cleanTerm);
    const currentPage = window.location.pathname;

    // Palavras-chave que levam para moletons.html
    const isMoletom = normalized.includes('moletom') || normalized.includes('casaco') || normalized.includes('blusa');
    
    // Palavras-chave que levam para camisas.html
    const isCamisa = normalized.includes('camisa') || normalized.includes('linho') || normalized.includes('manga') || normalized.includes('oversized') || normalized.includes('regata') || normalized.includes('tricot') || normalized.includes('cotton') || normalized.includes('canelada');

    if (isMoletom) {
        if (currentPage.includes('moletons.html')) {
            filterCatalogProducts(cleanTerm);
        } else {
            window.location.assign(`${getProductPagePath('moletons.html')}?busca=${encodeURIComponent(cleanTerm)}`);
        }
        return;
    }

    if (isCamisa) {
        if (currentPage.includes('camisas.html')) {
            filterCatalogProducts(cleanTerm);
        } else {
            window.location.assign(`${getProductPagePath('camisas.html')}?busca=${encodeURIComponent(cleanTerm)}`);
        }
        return;
    }

    // Fallback padrão: manda para camisas.html
    if (currentPage.includes('camisas.html')) {
        filterCatalogProducts(cleanTerm);
    } else {
        window.location.assign(`${getProductPagePath('camisas.html')}?busca=${encodeURIComponent(cleanTerm)}`);
    }
}

// Filtra os cards da página de catálogo (camisas.html / moletons.html)
function filterCatalogProducts(rawTerm) {
    const terms = normalizeText(rawTerm.trim()).split(/\s+/);
    const cards = document.querySelectorAll('.product-card');
    
    if (cards.length === 0) return;

    let visibleCount = 0;

    cards.forEach(card => {
        const cardText = normalizeText(card.innerText);
        const matchesAllWords = terms.every(word => cardText.includes(word));

        if (matchesAllWords) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const resultCount = document.getElementById('resultado-count');
    if (resultCount) {
        resultCount.textContent = `Exibindo: ${visibleCount} resultado${visibleCount !== 1 ? 's' : ''} para "${rawTerm.trim()}"`;
    }
}