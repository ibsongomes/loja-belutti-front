document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName') || 'Cliente';
    const userMenu = document.getElementById('userMenu');

    if (!userMenu) return;

    const isSubpage = window.location.pathname.includes('/pages/');

    if (token) {
        const accountHref = isSubpage
            ? '../conta/minha-conta.html'
            : './pages/conta/minha-conta.html';

        userMenu.innerHTML = `
            <a href="${accountHref}" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 10px;" title="Minha Conta">
                <i class="far fa-user"></i>
                <div>
                    <strong>Olá, ${userName}</strong><br>
                    <span style="font-size: 12px;">Minha Conta</span> 
                </div>
            </a>
        `;
    } else {
        const loginHref = isSubpage
            ? '../auth/login.html'
            : './pages/auth/login.html';
        const registerHref = isSubpage
            ? '../auth/cadastro.html'
            : './pages/auth/cadastro.html';

        userMenu.innerHTML = `
            <a href="${loginHref}" style="text-decoration: none; color: inherit; display: flex; align-items: center;" title="Entrar na conta">
                <i class="far fa-user"></i>
            </a>
            <div>
                <a href="${loginHref}"> <strong>Login</strong> /<br> </a>
                <a href="${registerHref}"> <span style="font-size: 12px;">Cadastre-se</span> </a>
            </div>
        `;
    }
});