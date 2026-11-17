// 1. Define automaticamente se está rodando local ou no GitHub Pages
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://loja-belutti-backend.onrender.com';

// 2. Intercepta TODOS os fetch('/...') e redireciona para o Render automaticamente
const originalFetch = window.fetch;
window.fetch = function(resource, options) {
    if (typeof resource === 'string' && resource.startsWith('/')) {
        resource = API_URL + resource;
    }
    return originalFetch.call(this, resource, options);
};

// 3. Corrige automaticamente imagens com "/img/..." no GitHub Pages
document.addEventListener('DOMContentLoaded', () => {
    const fixImages = () => {
        const prefix = window.location.pathname.includes('/pages/') ? '../..' : '.';
        document.querySelectorAll('img[src^="/img/"]').forEach(img => {
            img.setAttribute('src', prefix + img.getAttribute('src'));
        });
    };

    fixImages();
    // Observa produtos carregados dinamicamente (vitrine, carrinho e painel admin)
    new MutationObserver(fixImages).observe(document.body, { childList: true, subtree: true });
});