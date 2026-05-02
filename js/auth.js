// ==========================
// CONFIG
// ==========================
const API_URL = "http://localhost:3000/api"; // ajuste aqui

// ==========================
// STATE
// ==========================
let currentUser = null;
let isRequesting = false;

// ==========================
// STORAGE
// ==========================
function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function clearToken() {
    localStorage.removeItem("token");
}

// ==========================
// LOGIN
// ==========================
async function login(email, password) {
    if (isRequesting) {
        notifications.warning('Aguarde um momento...', 'Processando');
        return { success: false, message: "Aguarde..." };
    }

    isRequesting = true;
    loading.show('Fazendo login...');

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            notifications.error(data.error || "Erro no login", "Falha no Login");
            return { success: false, message: data.error || "Erro no login" };
        }

        saveToken(data.token);

        currentUser = {
            email,
            name: email.split("@")[0],
            role: data.role || "client"
        };

        notifications.success(`Bem-vindo(a) ${currentUser.name}!`, "Login realizado com sucesso!");
        
        // Redirecionar baseado no papel do usuário
        setTimeout(() => {
            if (currentUser.role === "admin") {
                navigateTo("adminDashboard");
            } else {
                navigateTo("dashboard");
            }
        }, 1000);

        return { success: true, user: currentUser };

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        notifications.error("Não foi possível conectar ao servidor. Verifique sua conexão.", "Erro de Conexão");
        return { success: false, message: "Erro ao conectar com servidor" };

    } finally {
        isRequesting = false;
        setTimeout(() => loading.hide(), 500);
    }
}

// ==========================
// REGISTER
// ==========================
async function register(name, email, password, termsAccepted) {
    if (isRequesting) {
        notifications.warning('Aguarde um momento...', 'Processando');
        return { success: false, message: "Aguarde..." };
    }

    if (!name || !email || password.length < 8) {
        notifications.error("Por favor, preencha todos os campos corretamente. A senha deve ter no mínimo 8 caracteres.", "Dados Inválidos");
        return { success: false, message: "Dados inválidos" };
    }

    if (!termsAccepted) {
        notifications.warning("Você precisa aceitar os termos de serviço para continuar.", "Termos Necessários");
        return { success: false, message: "Aceite os termos" };
    }

    isRequesting = true;
    loading.show('Criando sua conta...');

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: name,
                email,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            notifications.error(data.error || "Erro no cadastro", "Falha no Cadastro");
            return { success: false, message: data.error || "Erro no cadastro" };
        }

        currentUser = {
            name,
            email,
            role: data.role || "client"
        };

        notifications.success(`Bem-vindo(a) à StoryNodes, ${name}! Sua conta foi criada com sucesso.`, "Cadastro Realizado!");
        
        // Redirecionar após cadastro
        setTimeout(() => {
            navigateTo("dashboard");
        }, 1500);

        return { success: true, user: currentUser };

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        notifications.error("Erro ao conectar com o servidor. Tente novamente mais tarde.", "Erro de Conexão");
        return { success: false, message: "Erro ao conectar com servidor" };

    } finally {
        isRequesting = false;
        setTimeout(() => loading.hide(), 500);
    }
}

// ==========================
// LOGOUT
// ==========================
async function logout() {
    const confirmed = await ModalDialog.confirm("Tem certeza que deseja sair?", "Sair da Conta");
    
    if (confirmed) {
        currentUser = null;
        clearToken();
        notifications.success("Você saiu da sua conta com sucesso.", "Até logo!");
        
        setTimeout(() => {
            navigateTo("home");
        }, 500);
    }
}

// ==========================
// AUTH CHECKS
// ==========================
function isAuthenticated() {
    return !!getToken();
}

function isAdmin() {
    return currentUser?.role === "admin";
}

function getCurrentUser() {
    return currentUser;
}

// ==========================
// EVENT HANDLERS (ATUALIZADO)
// ==========================
document.addEventListener("click", async (e) => {

    const loginBtn = e.target.closest("#doLogin");
    const registerBtn = e.target.closest("#doRegister");

    // ================= LOGIN =================
    if (loginBtn) {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            notifications.warning("Por favor, preencha email e senha.", "Campos Obrigatórios");
            return;
        }

        const result = await login(email, password);
        
        // Se houver erro específico, mostrar
        if (!result.success && result.message) {
            // Erro já foi mostrado nas notificações
        }
    }

    // ================= REGISTER =================
    if (registerBtn) {
        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const terms = document.getElementById("termsCheck").checked;

        if (!name || !email || !password) {
            notifications.warning("Por favor, preencha todos os campos.", "Campos Obrigatórios");
            return;
        }

        if (password.length < 8) {
            notifications.warning("A senha deve ter pelo menos 8 caracteres.", "Senha Fraca");
            return;
        }

        const result = await register(name, email, password, terms);
        
        if (!result.success && result.message) {
            // Erro já foi mostrado nas notificações
        }
    }
});