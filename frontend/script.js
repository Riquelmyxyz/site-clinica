function logoutUser() {
    localStorage.removeItem('currentUser');
    showLoggedOutUI();
}

// Função para verificar usuário logado
function getCurrentUser() {
    return window._currentUser;
}

tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'baby-blue': '#a3d8f4',
                        'baby-blue-light': '#d6eeff',
                        'baby-blue-dark': '#7bc0e3',
                    }
                }
            }
        }

// Altera o cadastro para salvar senha criptografada        
validateAndSubmitRegistration = async function () {
    let isValid = true;

    const name = document.getElementById('register-name').value.trim();
    const cpf = document.getElementById('register-cpf').value;
    const birthdate = document.getElementById('register-birthdate').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsChecked = document.getElementById('terms-checkbox').checked;

    if (!name) {
        document.getElementById('name-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('name-error').classList.add('hidden');
    }

    if (!validateCPF(cpf)) {
        document.getElementById('cpf-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('cpf-error').classList.add('hidden');
    }

    if (!validateBirthdate(birthdate)) {
        document.getElementById('birthdate-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('birthdate-error').classList.add('hidden');
    }

    if (!validateEmail(email)) {
        document.getElementById('email-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('email-error').classList.add('hidden');
    }

    if (phone.replace(/\D/g, '').length < 10) {
        document.getElementById('phone-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('phone-error').classList.add('hidden');
    }

    if (!validatePassword(password)) {
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('password-match-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('password-match-error').classList.add('hidden');
    }

    if (!termsChecked) {
        document.getElementById('terms-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('terms-error').classList.add('hidden');
    }

    if (!isValid) return;

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name,
                cpf,                
                password, 
                type: "paciente"
})


        });

        const result = await response.json();

        if (response.ok) {
            closeModal('register-modal');
            showModal('success-modal');
        } else {
            alert(result.error || 'Erro no cadastro');
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor.');
        console.error(err);
    }
};

                closeModal('register-modal');
                showModal('success-modal');

        // Altera o login para comparar hash da senha
       async function handlePatientLogin() {
    // Remove todos os caracteres não numéricos do CPF
    const cpf = document.getElementById('patient-login-cpf').value.replace(/\D/g, '');
    const password = document.getElementById('patient-login-password').value;

    // Limpar mensagens de erro
    document.getElementById('login-cpf-error').classList.add('hidden');
    document.getElementById('login-password-error').classList.add('hidden');


    if (!cpf || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        console.log("Enviando para o backend:", { cpf, password }); // Para debug
        
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cpf: cpf,
                password: password,
                type: 'paciente'
            })
        });

        console.log("Resposta do backend:", response); // Para debug

        const result = await response.json();
        console.log("Resultado:", result); // Para debug

        if (response.ok) {
            // Login bem-sucedido
            localStorage.setItem('currentUser', JSON.stringify(result));
            showLoggedInUI(result);
        } else {
            document.getElementById('login-cpf-error').classList.remove('hidden');
        }
    } catch (err) {
        console.error("Erro completo:", err); // Para debug
        alert('Erro ao conectar com o servidor. Verifique o console para mais detalhes.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Login com Enter
    document.getElementById('patient-login-form').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handlePatientLogin();
        }
    });

    // Logout
    document.getElementById('logout-button').addEventListener('click', function(event) {
        event.preventDefault();
        logoutUser();
    });

    // Check login
    checkLoggedInStatus();
});


        // Função para verificar se o usuário está logado
        function checkLoggedInStatus() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                // Usuário está logado
                showLoggedInUI(currentUser);
            }
        }

        // Função para mostrar a interface de usuário logado
        function showLoggedInUI(user) {
            // Atualizar o nome do usuário no menu
            document.getElementById('user-name-display').textContent = user.name.split(' ')[0];
            
            // Mostrar o menu do usuário
            document.getElementById('user-menu').classList.remove('hidden');
            
            // Esconder a página inicial e mostrar o dashboard
            document.getElementById('home-page').classList.add('hidden');
            document.getElementById('patient-dashboard').classList.remove('hidden');
        }

        // Função para mostrar a interface de usuário não logado
        function showLoggedOutUI() {
            // Esconder o menu do usuário
            document.getElementById('user-menu').classList.add('hidden');
            
            // Mostrar a página inicial e esconder o dashboard
            document.getElementById('home-page').classList.remove('hidden');
            document.getElementById('patient-dashboard').classList.add('hidden');
        }

        // Função para alternar visibilidade da senha
        function togglePasswordVisibility(inputId, button) {
            const input = document.getElementById(inputId);
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                button.setAttribute('aria-label', 'Esconder senha');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                button.setAttribute('aria-label', 'Mostrar senha');
            }
        }
        
        function handleDoctorLogin() {
            const email = document.getElementById('doctor-email').value;
            const password = document.getElementById('doctor-password').value;
            
            if (!email || !password) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            showModal('demo-modal');
        }
        
        // Funções do modal
        function showModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        
        // Mostrar modal de cadastro
        function showRegisterModal() {
            showModal('register-modal');
        }
        
        // Fechar modal ao clicar fora dele
        window.addEventListener('click', function(event) {
            const demoModal = document.getElementById('demo-modal');
            const registerModal = document.getElementById('register-modal');
            const successModal = document.getElementById('success-modal');
            
            if (event.target === demoModal) {
                closeModal('demo-modal');
            } else if (event.target === registerModal) {
                closeModal('register-modal');
            } else if (event.target === successModal) {
                closeModal('success-modal');
            }
        });
        
        // Fechar modal com tecla ESC
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal('demo-modal');
                closeModal('register-modal');
                closeModal('success-modal');
            }
        });
        
        // Máscara para CPF
        function maskCPF(input) {
            let value = input.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 9) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{3})(\d{3})(\d{1,3}).*/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/^(\d{3})(\d{1,3}).*/, '$1.$2');
            }
            
            input.value = value;
        }
        
        // Máscara para telefone
        function maskPhone(input) {
            let value = input.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            }
            
            input.value = value;
        }
        
        // Verificar força da senha
        function checkPasswordStrength() {
            const password = document.getElementById('register-password').value;
            
            // Verificar comprimento
            const lengthReq = document.getElementById('length-req');
            if (password.length >= 8) {
                lengthReq.classList.remove('requirement-not-met');
                lengthReq.classList.add('requirement-met');
                lengthReq.querySelector('i').classList.remove('fa-circle');
                lengthReq.querySelector('i').classList.add('fa-check-circle');
            } else {
                lengthReq.classList.remove('requirement-met');
                lengthReq.classList.add('requirement-not-met');
                lengthReq.querySelector('i').classList.remove('fa-check-circle');
                lengthReq.querySelector('i').classList.add('fa-circle');
            }
            
            // Verificar letra maiúscula
            const uppercaseReq = document.getElementById('uppercase-req');
            if (/[A-Z]/.test(password)) {
                uppercaseReq.classList.remove('requirement-not-met');
                uppercaseReq.classList.add('requirement-met');
                uppercaseReq.querySelector('i').classList.remove('fa-circle');
                uppercaseReq.querySelector('i').classList.add('fa-check-circle');
            } else {
                uppercaseReq.classList.remove('requirement-met');
                uppercaseReq.classList.add('requirement-not-met');
                uppercaseReq.querySelector('i').classList.remove('fa-check-circle');
                uppercaseReq.querySelector('i').classList.add('fa-circle');
            }
            
            // Verificar letra minúscula
            const lowercaseReq = document.getElementById('lowercase-req');
            if (/[a-z]/.test(password)) {
                lowercaseReq.classList.remove('requirement-not-met');
                lowercaseReq.classList.add('requirement-met');
                lowercaseReq.querySelector('i').classList.remove('fa-circle');
                lowercaseReq.querySelector('i').classList.add('fa-check-circle');
            } else {
                lowercaseReq.classList.remove('requirement-met');
                lowercaseReq.classList.add('requirement-not-met');
                lowercaseReq.querySelector('i').classList.remove('fa-check-circle');
                lowercaseReq.querySelector('i').classList.add('fa-circle');
            }
        }
        
        // Validar CPF
        function validateCPF(cpf) {
            cpf = cpf.replace(/[^\d]/g, '');
            
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
                return false;
            }
            
            let sum = 0;
            let remainder;
            
            for (let i = 1; i <= 9; i++) {
                sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
            }
            
            remainder = (sum * 10) % 11;
            
            if ((remainder === 10) || (remainder === 11)) {
                remainder = 0;
            }
            
            if (remainder !== parseInt(cpf.substring(9, 10))) {
                return false;
            }
            
            sum = 0;
            
            for (let i = 1; i <= 10; i++) {
                sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
            }
            
            remainder = (sum * 10) % 11;
            
            if ((remainder === 10) || (remainder === 11)) {
                remainder = 0;
            }
            
            if (remainder !== parseInt(cpf.substring(10, 11))) {
                return false;
            }
            
            return true;
        }
        
        // Validar e-mail
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Validar data de nascimento
        function validateBirthdate(birthdate) {
            if (!birthdate) return false;
            
            const today = new Date();
            const birthdateObj = new Date(birthdate);
            
            // Verificar se é uma data válida
            if (isNaN(birthdateObj.getTime())) {
                return false;
            }
            
            // Verificar se a data não é futura
            if (birthdateObj > today) {
                return false;
            }
            
            // Verificar se a pessoa tem pelo menos 18 anos
            const age = today.getFullYear() - birthdateObj.getFullYear();
            const monthDiff = today.getMonth() - birthdateObj.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateObj.getDate())) {
                return age - 1 >= 0;
            }
            
            return age >= 0;
        }
        
        // Validar senha
        function validatePassword(password) {
            // Pelo menos 8 caracteres, uma letra maiúscula e uma minúscula
            return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password);
        }
                
        // Fechar modal de sucesso e redirecionar para login
        function closeSuccessModal() {
            closeModal('success-modal');
            // Limpar formulário de cadastro
            document.getElementById('patient-register-form').reset();
            // Resetar indicadores de requisitos de senha
            document.getElementById('length-req').classList.remove('requirement-met');
            document.getElementById('length-req').classList.add('requirement-not-met');
            document.getElementById('length-req').querySelector('i').classList.remove('fa-check-circle');
            document.getElementById('length-req').querySelector('i').classList.add('fa-circle');
            
            document.getElementById('uppercase-req').classList.remove('requirement-met');
            document.getElementById('uppercase-req').classList.add('requirement-not-met');
            document.getElementById('uppercase-req').querySelector('i').classList.remove('fa-check-circle');
            document.getElementById('uppercase-req').querySelector('i').classList.add('fa-circle');
            
            document.getElementById('lowercase-req').classList.remove('requirement-met');
            document.getElementById('lowercase-req').classList.add('requirement-not-met');
            document.getElementById('lowercase-req').querySelector('i').classList.remove('fa-check-circle');
            document.getElementById('lowercase-req').querySelector('i').classList.add('fa-circle');
            
            // Preencher o campo de CPF no formulário de login
            const cpf = document.getElementById('register-cpf').value;
            document.getElementById('patient-login-cpf').value = cpf;
            document.getElementById('patient-login-cpf').focus();
        }

        // Configurar o menu dropdown do usuário
        document.getElementById('user-menu-button').addEventListener('click', function() {
            const dropdown = document.getElementById('user-dropdown');
            dropdown.classList.toggle('hidden');
            this.setAttribute('aria-expanded', dropdown.classList.contains('hidden') ? 'false' : 'true');
        });

        // Fechar o dropdown ao clicar fora dele
        document.addEventListener('click', function(event) {
            const userMenu = document.getElementById('user-menu');
            const dropdown = document.getElementById('user-dropdown');
            
            if (!userMenu.contains(event.target) && !dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
                document.getElementById('user-menu-button').setAttribute('aria-expanded', 'false');
            }
        });

        // Configurar o botão de logout
    document.getElementById('logout-button').addEventListener('click', function(event) {
    event.preventDefault();
    logoutUser();
});