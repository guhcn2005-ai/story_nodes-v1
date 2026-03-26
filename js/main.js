// ===== MAIN APPLICATION =====

// Estado atual
let currentPage = "home";

// Navegação entre páginas
function navigateTo(pageId) {
    currentPage = pageId;
    
    // Esconder todas as páginas
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });
    
    // Mostrar página atual
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add("active-page");
    }
    
    // Renderizar conteúdo baseado na página
    renderCurrentPage();
    
    // Atualizar navbar
    updateNavbar();
    
    // Reaplicar event listeners específicos
    attachPageSpecificEvents();
}

// Renderizar conteúdo da página atual
function renderCurrentPage() {
    const pageElement = document.getElementById(currentPage);
    if (!pageElement) return;
    
    switch(currentPage) {
        case "home":
            pageElement.innerHTML = renderHome();
            break;
        case "explore":
            pageElement.innerHTML = renderExplore();
            break;
        case "trending":
            pageElement.innerHTML = renderTrending();
            break;
        case "login":
            pageElement.innerHTML = renderLogin();
            break;
        case "register":
            pageElement.innerHTML = renderRegister();
            break;
        case "dashboard":
            if (isAuthenticated() && !isAdmin()) {
                pageElement.innerHTML = renderDashboard();
            } else {
                navigateTo("home");
            }
            break;
        case "adminDashboard":
            if (isAdmin()) {
                pageElement.innerHTML = renderAdminDashboard();
            } else {
                navigateTo("home");
            }
            break;
        default:
            pageElement.innerHTML = renderHome();
    }
}

// Atualizar navbar
function updateNavbar() {
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
        navbarContainer.innerHTML = renderNavbar();
        
        // Reatachar eventos da navbar
        document.querySelectorAll("[data-page]").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const page = link.getAttribute("data-page");
                if (page === "dashboard" && !isAuthenticated()) {
                    navigateTo("login");
                    return;
                }
                if (page === "adminDashboard" && !isAdmin()) {
                    alert("Acesso negado. Área restrita para administradores.");
                    return;
                }
                navigateTo(page);
            });
        });
        
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
                updateNavbar();
                navigateTo("home");
            });
        }
    }
}

// Event listeners específicos por página
function attachPageSpecificEvents() {
    // Eventos da Home
    const heroExploreBtn = document.getElementById("heroExplorar");
    if (heroExploreBtn) {
        heroExploreBtn.addEventListener("click", () => navigateTo("explore"));
    }
    
    const heroBuyBtn = document.getElementById("heroComprar");
    if (heroBuyBtn) {
        heroBuyBtn.addEventListener("click", () => alert("Redirecionando para página de compra..."));
    }
    
    const ctaRegisterBtn = document.getElementById("ctaRegister");
    if (ctaRegisterBtn) {
        ctaRegisterBtn.addEventListener("click", () => navigateTo("register"));
    }
    
    // Eventos de Login
    const doLoginBtn = document.getElementById("doLogin");
    if (doLoginBtn) {
        doLoginBtn.addEventListener("click", () => {
            const email = document.getElementById("loginEmail")?.value || "";
            const password = document.getElementById("loginPassword")?.value || "";
            
            const result = login(email, password);
            if (result.success) {
                updateNavbar();
                if (isAdmin()) {
                    navigateTo("adminDashboard");
                } else {
                    navigateTo("dashboard");
                }
            } else {
                alert(result.message || "Credenciais inválidas. Tente admin@story.com / admin123");
            }
        });
    }
    
    // Eventos de Cadastro
    const doRegisterBtn = document.getElementById("doRegister");
    if (doRegisterBtn) {
        doRegisterBtn.addEventListener("click", () => {
            const name = document.getElementById("regName")?.value || "";
            const email = document.getElementById("regEmail")?.value || "";
            const password = document.getElementById("regPassword")?.value || "";
            const termsAccepted = document.getElementById("termsCheck")?.checked || false;
            
            const result = register(name, email, password, termsAccepted);
            if (result.success) {
                updateNavbar();
                navigateTo("dashboard");
            } else {
                alert(result.message);
            }
        });
    }
    
    // Eventos da página Explorar
    const searchInput = document.getElementById("searchExplore");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            exploreOffset = 0;
            currentExploreFilter.search = e.target.value;
            refreshExplorePage();
        });
    }
    
    // Filtros de categoria
    document.querySelectorAll("[data-cat]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll("[data-cat]").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            exploreOffset = 0;
            currentExploreFilter.category = btn.getAttribute("data-cat");
            refreshExplorePage();
        });
    });
    
    // Filtros de ordenação
    document.querySelectorAll("#sortTabs .tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#sortTabs .tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            exploreOffset = 0;
            currentExploreFilter.sort = btn.getAttribute("data-sort");
            refreshExplorePage();
        });
    });
    
    // Botão carregar mais
    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            exploreOffset += STORIES_PER_PAGE;
            refreshExplorePage();
        });
    }
}

// Atualiza a página de explorar sem recarregar tudo
function refreshExplorePage() {
    const exploreContainer = document.getElementById("explore");
    if (exploreContainer && currentPage === "explore") {
        const filteredStories = filterStories(currentExploreFilter);
        const paginatedStories = filteredStories.slice(0, exploreOffset + STORIES_PER_PAGE);
        const hasMore = paginatedStories.length < filteredStories.length;
        
        const exploreGrid = document.getElementById("exploreGrid");
        const loadMoreBtn = document.getElementById("loadMore");
        
        if (exploreGrid) {
            exploreGrid.innerHTML = paginatedStories.map(renderStoryCard).join("");
        }
        
        if (loadMoreBtn) {
            if (hasMore) {
                loadMoreBtn.style.display = "block";
            } else {
                loadMoreBtn.style.display = "none";
            }
        }
    }
}

// Inicialização da aplicação
function init() {
    // Injetar navbar
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";
    const app = document.getElementById("app");
    app.insertBefore(navbarContainer, app.firstChild);
    
    // Renderizar navbar inicial
    updateNavbar();
    
    // Renderizar página inicial
    renderCurrentPage();
    
    // Atachar eventos
    attachPageSpecificEvents();
}

// Iniciar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", init);