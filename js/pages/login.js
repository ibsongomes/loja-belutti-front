document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.userName);
            window.location.assign(window.location.pathname.includes('/pages/') ? '../../index.html' : './index.html'); // Vai para a raiz do site
        } else {
            alert(data.error); 
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Erro ao conectar com o servidor. Verifique se a API está rodando.");
    }
});