document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName') || 'Cliente';
    const userMenu = document.getElementById('userMenu');

    if (token && userMenu) {
        userMenu.innerHTML = `
            <i class="far fa-user"></i>
            <div>
                <a href="/pages/conta/minha-conta.html" style="text-decoration: none; color: inherit;"> 
                    <strong>Olá, ${userName}</strong><br>
                    <span style="font-size: 12px;">Minha Conta</span> 
                </a>
            </div>
        `;
    }
});