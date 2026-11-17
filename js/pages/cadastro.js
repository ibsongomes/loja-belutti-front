const cpfInput = document.getElementById('cpf');
const birthDateInput = document.getElementById('birthDate');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const cepInput = document.getElementById('cep');

const streetInput = document.getElementById('street');
const numberInput = document.getElementById('number');
const complementInput = document.getElementById('complement');
const neighborhoodInput = document.getElementById('neighborhood');
const stateInput = document.getElementById('state');
const cityInput = document.getElementById('city');
const referenceInput = document.getElementById('reference');

// Limpa qualquer balão de erro customizado assim que o usuário volta a digitar no campo
[cpfInput, birthDateInput, emailInput, passwordInput, confirmPasswordInput, cepInput, numberInput].forEach(input => {
    input.addEventListener('input', () => input.setCustomValidity(''));
});

// Helper para mostrar o erro exatamente como o balão nativo do navegador
function showFieldError(inputElement, message) {
    inputElement.setCustomValidity(message);
    inputElement.reportValidity();
}

// Máscara de CPF
cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
});

// Máscara de Data de Nascimento (DD/MM/AAAA)
birthDateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    e.target.value = value;
});

// Máscara e consulta automática de CEP via ViaCEP
cepInput.addEventListener('input', async (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    e.target.value = value.replace(/(\d{5})(\d)/, '$1-$2');

    if (value.length === 8) {
        await fetchAddressByCep(value);
    } else {
        resetAddressFields();
    }
});

function resetAddressFields() {
    [streetInput, numberInput, complementInput, neighborhoodInput, stateInput, cityInput, referenceInput].forEach(field => {
        field.value = '';
        field.disabled = true;
    });
}

async function fetchAddressByCep(cleanCep) {
    streetInput.placeholder = 'Buscando endereço...';

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();

        if (data.erro) {
            resetAddressFields();
            streetInput.placeholder = 'Aguardando CEP...';
            showFieldError(cepInput, 'CEP não encontrado. Verifique os números digitados.');
            return;
        }

        // Preenche os dados oficiais do CEP e mantém bloqueados para edição
        streetInput.value = data.logradouro || '';
        neighborhoodInput.value = data.bairro || '';
        cityInput.value = data.localidade || '';
        stateInput.value = data.uf || '';

        // Se o CEP for único da cidade (sem rua específica), libera logradouro e bairro também
        streetInput.disabled = Boolean(data.logradouro);
        neighborhoodInput.disabled = Boolean(data.bairro);
        cityInput.disabled = true;
        stateInput.disabled = true;

        // Libera apenas Número, Complemento e Ponto de Referência
        numberInput.disabled = false;
        complementInput.disabled = false;
        referenceInput.disabled = false;

        numberInput.focus();
    } catch (error) {
        resetAddressFields();
        showFieldError(cepInput, 'Erro ao consultar o CEP. Tente novamente.');
    }
}

// Valida se a data existe no calendário e se tem +18 anos (formato DD/MM/AAAA)
function validateBirthDate(dateStr) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        return { valid: false, message: 'Digite a data completa no formato DD/MM/AAAA.' };
    }

    const [day, month, year] = dateStr.split('/').map(Number);
    const currentYear = new Date().getFullYear();

    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > currentYear) {
        return { valid: false, message: 'Data de nascimento inválida.' };
    }

    // Confere se o dia existe naquele mês/ano (ex: barra 31/02)
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
        return { valid: false, message: 'Esta data não existe no calendário.' };
    }

    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
        age--;
    }

    if (age < 18) {
        return { valid: false, message: 'Você precisa ter pelo menos 18 anos para criar uma conta.' };
    }

    // Converte DD/MM/AAAA para AAAA-MM-DD para salvar no banco
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { valid: true, isoDate };
}

// Envio do Formulário
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const cpf = cpfInput.value.replace(/\D/g, '');
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const cep = cepInput.value.replace(/\D/g, '');

    if (cpf.length !== 11) {
        showFieldError(cpfInput, 'Digite um CPF completo com 11 números.');
        return;
    }

    const birthCheck = validateBirthDate(birthDateInput.value.trim());
    if (!birthCheck.valid) {
        showFieldError(birthDateInput, birthCheck.message);
        return;
    }

    if (password.length < 6) {
        showFieldError(passwordInput, 'A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    if (password !== confirmPassword) {
        showFieldError(confirmPasswordInput, 'As senhas não coincidem.');
        return;
    }

    if (cep.length !== 8 || !cityInput.value) {
        showFieldError(cepInput, 'Informe um CEP válido para carregar o endereço.');
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
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, cpf, birthDate: birthCheck.isoDate, email, password, address })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.userName);
            window.location.assign(window.location.pathname.includes('/pages/') ? '../../index.html' : './index.html');
        } else {
            // Direciona o balão de erro exatamente para o campo apontado pelo servidor
            if (data.field === 'cpf') showFieldError(cpfInput, data.error);
            else if (data.field === 'birthDate') showFieldError(birthDateInput, data.error);
            else if (data.field === 'email') showFieldError(emailInput, data.error);
            else showFieldError(emailInput, data.error || 'Erro ao realizar cadastro.');
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        showFieldError(emailInput, 'Erro ao conectar com o servidor.');
    }
});