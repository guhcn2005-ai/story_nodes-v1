// ===== AUTH STATE =====
let currentUser = null;

// Credenciais admin fixas
const ADMIN_CREDENTIALS = {
    email: "admin@story.com",
    password: "admin123"
};

// Funções de autenticação
function login(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentUser = {
            name: "Admin Master",
            email: email,
            role: "admin"
        };
        return { success: true, user: currentUser };
    } else if (email && password && password.length >= 8) {
        currentUser = {
            name: email.split("@")[0],
            email: email,
            role: "client"
        };
        return { success: true, user: currentUser };
    }
    return { success: false, message: "Credenciais inválidas" };
}

function register(name, email, password, termsAccepted) {
    if (!name || !email || password.length < 8) {
        return { success: false, message: "Preencha todos os campos corretamente. Senha deve ter mínimo 8 caracteres." };
    }
    if (!termsAccepted) {
        return { success: false, message: "Você deve aceitar os Termos de Serviço" };
    }
    
    currentUser = {
        name: name,
        email: email,
        role: "client"
    };
    return { success: true, user: currentUser };
}

function logout() {
    currentUser = null;
}

function isAuthenticated() {
    return currentUser !== null;
}

function isAdmin() {
    return currentUser?.role === "admin";
}

function getCurrentUser() {
    return currentUser;
}