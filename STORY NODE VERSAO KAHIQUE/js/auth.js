// ===== CONFIGURAÇÃO DO FIREBASE =====
const firebaseConfig = {
    apiKey: "AIzaSyBvFSdXq5gG0lLgvG-04NLiFq3hhvic9pk",
    authDomain: "storynodes-8bbb1.firebaseapp.com",
    projectId: "storynodes-8bbb1",
    storageBucket: "storynodes-8bbb1.firebasestorage.app",
    messagingSenderId: "358201300991",
    appId: "1:358201300991:web:fb2df45b3e3877946339ca"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Configurar provedores
const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();

// ===== VARIÁVEIS DE ESTADO =====
let currentUser = null;
let isRequesting = false;

// ===== ANIMAÇÃO CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===== SISTEMA DE NOTIFICAÇÃO =====
const notifications = {
    success: function(message, title = "Sucesso") {
        this._show(message, title, "#10b981", "fa-check-circle");
    },
    error: function(message, title = "Erro") {
        this._show(message, title, "#ef4444", "fa-exclamation-circle");
    },
    warning: function(message, title = "Atenção") {
        this._show(message, title, "#f59e0b", "fa-exclamation-triangle");
    },
    _show: function(message, title, bgColor, icon) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            min-width: 250px;
        `;
        toast.innerHTML = `<i class="fas ${icon}"></i> <strong>${title}</strong><br>${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

// ===== SISTEMA DE LOADING =====
const loading = {
    show: function(message = "Carregando...") {
        let loader = document.getElementById("global-loader");
        if (!loader) {
            loader = document.createElement('div');
            loader.id = "global-loader";
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                color: white;
                font-family: 'Inter', sans-serif;
            `;
            loader.innerHTML = `
                <div style="background: #1e1e2e; padding: 20px; border-radius: 12px; text-align: center;">
                    <i class="fas fa-spinner fa-pulse fa-2x"></i>
                    <p style="margin-top: 10px;">${message}</p>
                </div>
            `;
            document.body.appendChild(loader);
        } else {
            loader.style.display = "flex";
            const p = loader.querySelector("p");
            if (p) p.innerText = message;
        }
    },
    hide: function() {
        const loader = document.getElementById("global-loader");
        if (loader) loader.style.display = "none";
    }
};

// ===== MODAL DE CONFIRMAÇÃO (CORRIGIDO) =====
function showConfirmModal(message, title) {
    return new Promise((resolve) => {
        // Remove modal existente
        const oldModal = document.getElementById("custom-modal");
        if (oldModal) oldModal.remove();
        
        const modal = document.createElement('div');
        modal.id = "custom-modal";
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            font-family: 'Inter', sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="background: #1e1e2e; padding: 30px; border-radius: 20px; max-width: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <h3 style="margin: 0 0 15px 0; color: white; font-size: 24px;">${title || "Confirmação"}</h3>
                <p style="color: #ccc; margin-bottom: 30px; font-size: 16px;">${message}</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="modal-cancel-btn" style="background: #3a3a4a; color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 500; transition: 0.2s;">Cancelar</button>
                    <button id="modal-confirm-btn" style="background: #ef4444; color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 500; transition: 0.2s;">Confirmar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Botão Cancelar
        document.getElementById("modal-cancel-btn").onclick = () => {
            modal.remove();
            resolve(false);
        };
        
        // Botão Confirmar
        document.getElementById("modal-confirm-btn").onclick = () => {
            modal.remove();
            resolve(true);
        };
        
        // Fechar ao clicar fora
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        };
    });
}

// ===== REGISTRO COM EMAIL/SENHA =====
async function registerWithEmail(name, email, password, termsAccepted) {
    if (isRequesting) {
        notifications.warning('Aguarde um momento...', 'Processando');
        return { success: false };
    }

    if (!name || !email || password.length < 6) {
        notifications.error("Preencha todos os campos. Senha com mínimo 6 caracteres.", "Dados Inválidos");
        return { success: false };
    }

    if (!termsAccepted) {
        notifications.warning("Você precisa aceitar os termos de serviço.", "Termos Necessários");
        return { success: false };
    }

    isRequesting = true;
    loading.show('Criando sua conta...');

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await user.updateProfile({
            displayName: name
        });
        
        currentUser = {
            uid: user.uid,
            name: name,
            email: email,
            photo: user.photoURL,
            role: "client"
        };
        
        notifications.success(`Bem-vindo(a) à StoryNodes, ${name}!`, "Cadastro Realizado!");
        
        setTimeout(() => {
            if (typeof navigateTo === 'function') navigateTo("dashboard");
        }, 1500);
        
        return { success: true, user: currentUser };
        
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        let errorMessage = "Erro no cadastro";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "Este email já está cadastrado.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Email inválido.";
                break;
            case 'auth/weak-password':
                errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
                break;
            default:
                errorMessage = error.message;
        }
        notifications.error(errorMessage, "Falha no Cadastro");
        return { success: false, message: errorMessage };
        
    } finally {
        isRequesting = false;
        setTimeout(() => loading.hide(), 500);
    }
}

// ===== LOGIN COM EMAIL/SENHA =====
async function loginWithEmail(email, password) {
    if (isRequesting) {
        notifications.warning('Aguarde um momento...', 'Processando');
        return { success: false };
    }

    isRequesting = true;
    loading.show('Fazendo login...');

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        currentUser = {
            uid: user.uid,
            name: user.displayName || email.split("@")[0],
            email: user.email,
            photo: user.photoURL,
            role: "client"
        };
        
        notifications.success(`Bem-vindo(a) ${currentUser.name}!`, "Login realizado!");
        
        setTimeout(() => {
            if (typeof navigateTo === 'function') navigateTo("dashboard");
        }, 1000);
        
        return { success: true, user: currentUser };
        
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        let errorMessage = "Erro no login";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "Usuário não encontrado.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Senha incorreta.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Email inválido.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Muitas tentativas. Tente mais tarde.";
                break;
            default:
                errorMessage = error.message;
        }
        notifications.error(errorMessage, "Falha no Login");
        return { success: false, message: errorMessage };
        
    } finally {
        isRequesting = false;
        setTimeout(() => loading.hide(), 500);
    }
}

// ===== LOGIN COM GOOGLE =====
async function loginWithGoogle() {
    if (isRequesting) {
        notifications.warning('Aguarde um momento...', 'Processando');
        return { success: false };
    }
    
    isRequesting = true;
    loading.show('Conectando com Google...');
    
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        currentUser = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            photo: user.photoURL,
            role: "client"
        };
        
        notifications.success(`Bem-vindo(a) ${currentUser.name}!`, "Login com Google");
        
        setTimeout(() => {
            if (typeof navigateTo === 'function') navigateTo("dashboard");
        }, 1000);
        
        return { success: true, user: currentUser };
        
    } catch (error) {
        console.error("Erro no login com Google:", error);
        notifications.error(error.message, "Erro no Google");
        return { success: false, message: error.message };
    } finally {
        isRequesting = false;
        setTimeout(() => loading.hide(), 500);
    }
}

// ===== LOGIN COM GITHUB =====
async function loginWithGithub() {
    if (isRequesting) {
        notifications.warning('Aguarde um momento...', 'Processando');
        return { success: false };
    }
    
    isRequesting = true;
    loading.show('Conectando com GitHub...');
    
    try {
        const result = await auth.signInWithPopup(githubProvider);
        const user = result.user;
        
        currentUser = {
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || "GitHub User",
            email: user.email || `${user.uid}@github.user`,
            photo: user.photoURL,
            role: "client"
        };
        
        notifications.success(`Bem-vindo(a) ${currentUser.name}!`, "Login com GitHub");
        
        setTimeout(() => {
            if (typeof navigateTo === 'function') navigateTo("dashboard");
        }, 1000);
        
        return { success: true, user: currentUser };
        
    } catch (error) {
        console.error("Erro no login com GitHub:", error);
        notifications.error(error.message, "Erro no GitHub");
        return { success: false, message: error.message };
    } finally {
        isRequesting = false;
        setTimeout(() => loading.hide(), 500);
    }
}

// ===== LOGOUT (CORRIGIDO COM O NOVO MODAL) =====
async function logout() {
    const confirmed = await showConfirmModal("Tem certeza que deseja sair da sua conta?", "Sair da Conta");
    
    if (confirmed) {
        try {
            await auth.signOut();
            currentUser = null;
            notifications.success("Você saiu da sua conta.", "Até logo!");
            
            setTimeout(() => {
                if (typeof navigateTo === 'function') navigateTo("home");
                if (typeof updateNavbar === 'function') updateNavbar();
            }, 500);
        } catch (error) {
            console.error("Erro no logout:", error);
            notifications.error("Erro ao sair da conta.", "Erro");
        }
    }
}

// ===== VERIFICAÇÕES =====
function isAuthenticated() {
    return currentUser !== null;
}

function getCurrentUser() {
    return currentUser;
}

function isAdmin() {
    return currentUser?.role === "admin";
}

// ===== NAVEGAÇÃO =====
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const targetPage = document.getElementById(page);
    if (targetPage) targetPage.classList.add('active-page');
}

// ===== MONITORAR ESTADO DE AUTENTICAÇÃO =====
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = {
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || "Usuário",
            email: user.email,
            photo: user.photoURL,
            role: "client"
        };
        
        const activePage = document.querySelector('.page.active-page');
        if (activePage && (activePage.id === 'login' || activePage.id === 'register')) {
            if (typeof navigateTo === 'function') navigateTo("dashboard");
        }
        
        if (typeof updateNavbar === 'function') updateNavbar();
    } else {
        currentUser = null;
        
        const activePage = document.querySelector('.page.active-page');
        if (activePage && activePage.id !== 'home' && activePage.id !== 'login' && activePage.id !== 'register') {
            if (typeof navigateTo === 'function') navigateTo("home");
        }
        
        if (typeof updateNavbar === 'function') updateNavbar();
    }
});

// ===== EVENT HANDLERS =====
document.addEventListener("click", async (e) => {
    const loginBtn = e.target.closest("#doLogin");
    if (loginBtn) {
        const email = document.getElementById("loginEmail")?.value;
        const password = document.getElementById("loginPassword")?.value;

        if (!email || !password) {
            notifications.warning("Preencha email e senha.", "Campos Obrigatórios");
            return;
        }

        await loginWithEmail(email, password);
    }

    const registerBtn = e.target.closest("#doRegister");
    if (registerBtn) {
        const name = document.getElementById("regName")?.value;
        const email = document.getElementById("regEmail")?.value;
        const password = document.getElementById("regPassword")?.value;
        const terms = document.getElementById("termsCheck")?.checked;

        if (!name || !email || !password) {
            notifications.warning("Preencha todos os campos.", "Campos Obrigatórios");
            return;
        }

        if (password.length < 6) {
            notifications.warning("A senha deve ter pelo menos 6 caracteres.", "Senha Fraca");
            return;
        }

        await registerWithEmail(name, email, password, terms);
    }
    
    const googleBtn = e.target.closest("#googleLogin");
    if (googleBtn) {
        e.preventDefault();
        await loginWithGoogle();
    }
    
    const githubBtn = e.target.closest("#githubLogin");
    if (githubBtn) {
        e.preventDefault();
        await loginWithGithub();
    }
    
    const logoutBtn = e.target.closest("#logoutBtn");
    if (logoutBtn) {
        e.preventDefault();
        await logout();
    }
});

// ===== EXPORTAR PARA ESCOPO GLOBAL =====
window.currentUser = currentUser;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;
window.navigateTo = navigateTo;
window.logout = logout;
window.loginWithGoogle = loginWithGoogle;
window.loginWithGithub = loginWithGithub;
window.notifications = notifications;