// ===== COMPONENTES REUTILIZÁVEIS =====
//podemos criar mais componentes aqui, como cards de histórias, botões personalizados, etc. Cuidado ao mexer nesta parte, mudanças podem afetar várias páginas que dependem desses componentes

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