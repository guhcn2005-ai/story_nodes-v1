// ===== COMPONENTES REUTILIZÁVEIS =====
//podemos criar mais componentes aqui, como cards de histórias, botões personalizados, etc. Cuidado ao mexer nesta parte, mudanças podem afetar várias páginas que dependem desses componentes

// ===== DEFINIÇÕES DAS FUNÇÕES QUE FALTAM (FALLBACK) =====
// Essas funções serão usadas se não existirem no escopo global
if (typeof isAuthenticated === 'undefined') {
    window.isAuthenticated = function() {
        return window.currentUser !== null || (firebase.auth && firebase.auth().currentUser !== null);
    }
}

if (typeof getCurrentUser === 'undefined') {
    window.getCurrentUser = function() {
        if (window.currentUser) return window.currentUser;
        if (firebase.auth && firebase.auth().currentUser) {
            const user = firebase.auth().currentUser;
            return {
                uid: user.uid,
                name: user.displayName || user.email?.split('@')[0] || "Usuário",
                email: user.email,
                photo: user.photoURL,
                role: "client"
            };
        }
        return null;
    }
}

if (typeof isAdmin === 'undefined') {
    window.isAdmin = function() {
        const user = window.getCurrentUser();
        return user?.role === "admin";
    }
}

if (typeof navigateTo === 'undefined') {
    window.navigateTo = function(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
        const targetPage = document.getElementById(page);
        if (targetPage) targetPage.classList.add('active-page');
        if (typeof updateNavbar === 'function') updateNavbar();
    }
}

if (typeof logout === 'undefined') {
    window.logout = async function() {
        if (firebase.auth && firebase.auth().signOut) {
            try {
                await firebase.auth().signOut();
                window.currentUser = null;
                if (typeof updateNavbar === 'function') updateNavbar();
                if (typeof navigateTo === 'function') navigateTo('home');
            } catch (error) {
                console.error("Erro no logout:", error);
            }
        }
    }
}

// ===== SEU CÓDIGO ORIGINAL (SEM MUDANÇAS) =====

// Renderiza um card de história
function renderStoryCard(story) {
    return `
        <div class="story-card">
            <span class="card-category">${story.category}</span>
            <h3 class="story-title">${escapeHtml(story.title)}</h3>
            <div class="story-author">por ${escapeHtml(story.author)}</div>
            <p class="story-desc">${escapeHtml(story.desc.substring(0, 100))}...</p>
            <div class="stats">
                <span> ${story.reads.toLocaleString()}</span>
                <span> ${story.rating}</span>
            </div>
        </div>
    `;
}

// Renderiza a navbar baseado no estado do usuário
function renderNavbar() {
    const isLoggedIn = isAuthenticated();
    const user = getCurrentUser();
    
    let authButtons = '';
    let userMenu = '';
    
    if (isLoggedIn) {
        const dashboardPage = isAdmin() ? 'adminDashboard' : 'dashboard';
        const dashboardText = isAdmin() ? 'Admin Painel' : 'Meu Painel';
        
        userMenu = `
            <div class="auth-buttons">
                <a href="#" data-page="${dashboardPage}" class="btn-outline btn dashboard-link">${dashboardText}</a>
                <a href="#" id="logoutBtn" class="btn-outline btn">Sair</a>
            </div>
        `;
    } else {
        authButtons = `
            <div class="auth-buttons">
                <a href="#" data-page="login" class="btn-outline btn">Entrar</a>
                <a href="#" data-page="register" class="btn-primary btn">Cadastrar</a>
            </div>
        `;
    }
    
    return `
        <div class="container">
            <div class="navbar">
                <div class="logo">StoryNodes</div>
                <div class="nav-links">
                    <a href="#" data-page="home">Início</a>
                    <a href="#" data-page="explore">Explorar</a>
                    <a href="#" data-page="trending">Em Alta</a>
                    ${authButtons}
                    ${userMenu}
                </div>
            </div>
        </div>
    `;
}

// Helper para escapar HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Obtém categorias únicas
function getUniqueCategories() {
    return [...new Set(allStories.map(s => s.category))];
}

// ===== ATUALIZAR NAVBAR QUANDO PÁGINA CARREGAR =====
document.addEventListener('DOMContentLoaded', function() {
    if (typeof updateNavbar === 'function') {
        updateNavbar();
    } else if (document.getElementById('navbar-container')) {
        document.getElementById('navbar-container').innerHTML = renderNavbar();
    }
    
    // Event listener para logout
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
            e.preventDefault();
            if (typeof logout === 'function') logout();
        }
    });
});