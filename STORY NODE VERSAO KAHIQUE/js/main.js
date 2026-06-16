// ===== MAIN APPLICATION =====
// main.js - Gerencia a navegação, estado global e inicialização da aplicação - cuidado ao mexer

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
                    if (typeof notifications !== 'undefined' && notifications.warning) {
                        notifications.warning("Acesso negado. Área restrita para administradores.");
                    } else {
                        alert("Acesso negado. Área restrita para administradores.");
                    }
                    return;
                }
                navigateTo(page);
            });
        });
        
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                if (typeof logout === 'function') {
                    await logout();
                }
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
    
    // ===== EVENTOS DE LOGIN SOCIAL (GOOGLE E GITHUB) =====
    const loginPage = document.getElementById('login');
    if (loginPage) {
        const socialBtns = loginPage.querySelectorAll('.social-btn');
        if (socialBtns[0] && socialBtns[0].innerHTML.includes('Google')) {
            socialBtns[0].style.cursor = 'pointer';
            socialBtns[0].addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clicou no Google');
                if (typeof loginWithGoogle === 'function') {
                    loginWithGoogle();
                } else {
                    console.error('Função loginWithGoogle não encontrada!');
                    alert('Erro: Função de login do Google não carregada. Verifique o arquivo auth.js');
                }
            });
        }
        
        if (socialBtns[1] && socialBtns[1].innerHTML.includes('GitHub')) {
            socialBtns[1].style.cursor = 'pointer';
            socialBtns[1].addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clicou no GitHub');
                if (typeof loginWithGithub === 'function') {
                    loginWithGithub();
                } else {
                    console.error('Função loginWithGithub não encontrada!');
                    alert('Erro: Função de login do GitHub não carregada. Verifique o arquivo auth.js');
                }
            });
        }
    }
    
    const registerPage = document.getElementById('register');
    if (registerPage) {
        const socialBtns = registerPage.querySelectorAll('.social-btn');
        if (socialBtns[0] && socialBtns[0].innerHTML.includes('Google')) {
            socialBtns[0].style.cursor = 'pointer';
            socialBtns[0].addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof loginWithGoogle === 'function') loginWithGoogle();
            });
        }
        
        if (socialBtns[1] && socialBtns[1].innerHTML.includes('GitHub')) {
            socialBtns[1].style.cursor = 'pointer';
            socialBtns[1].addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof loginWithGithub === 'function') loginWithGithub();
            });
        }
    }
    
    // Eventos da página Explorar
    const searchInput = document.getElementById("searchExplore");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            if (typeof exploreOffset !== 'undefined') {
                exploreOffset = 0;
            }
            if (typeof currentExploreFilter !== 'undefined') {
                currentExploreFilter.search = e.target.value;
            }
            if (typeof refreshExplorePage === 'function') {
                refreshExplorePage();
            }
        });
    }
    
    document.querySelectorAll("[data-cat]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll("[data-cat]").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            if (typeof exploreOffset !== 'undefined') {
                exploreOffset = 0;
            }
            if (typeof currentExploreFilter !== 'undefined') {
                currentExploreFilter.category = btn.getAttribute("data-cat");
            }
            if (typeof refreshExplorePage === 'function') {
                refreshExplorePage();
            }
        });
    });
    
    document.querySelectorAll("#sortTabs .tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#sortTabs .tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            if (typeof exploreOffset !== 'undefined') {
                exploreOffset = 0;
            }
            if (typeof currentExploreFilter !== 'undefined') {
                currentExploreFilter.sort = btn.getAttribute("data-sort");
            }
            if (typeof refreshExplorePage === 'function') {
                refreshExplorePage();
            }
        });
    });
    
    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            if (typeof exploreOffset !== 'undefined' && typeof STORIES_PER_PAGE !== 'undefined') {
                exploreOffset += STORIES_PER_PAGE;
            }
            if (typeof refreshExplorePage === 'function') {
                refreshExplorePage();
            }
        });
    }
}

// Atualiza a página de explorar
function refreshExplorePage() {
    const exploreContainer = document.getElementById("explore");
    if (exploreContainer && currentPage === "explore") {
        if (typeof filterStories === 'function' && typeof renderStoryCard === 'function') {
            const filteredStories = filterStories(currentExploreFilter);
            const paginatedStories = filteredStories.slice(0, exploreOffset + STORIES_PER_PAGE);
            const hasMore = paginatedStories.length < filteredStories.length;
            
            const exploreGrid = document.getElementById("exploreGrid");
            const loadMoreBtn = document.getElementById("loadMore");
            
            if (exploreGrid) {
                exploreGrid.innerHTML = paginatedStories.map(renderStoryCard).join("");
            }
            
            if (loadMoreBtn) {
                loadMoreBtn.style.display = hasMore ? "block" : "none";
            }
        }
    }
}

// Sistema de notificações (sem conflito com auth.js)
if (typeof notifications === 'undefined') {
    window.notifications = {
        warning: function(message) {
            alert(message);
        }
    };
}

// Inicialização da aplicação
function init() {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Elemento #app não encontrado no DOM");
        return;
    }

    let navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) {
        navbarContainer = document.createElement("div");
        navbarContainer.id = "navbar-container";
        app.insertBefore(navbarContainer, app.firstChild);
    }

    let footerContainer = document.getElementById("footer-container");
    if (!footerContainer) {
        footerContainer = document.createElement("div");
        footerContainer.id = "footer-container";
        app.appendChild(footerContainer);
    }
    
    updateNavbar();
    renderCurrentPage();
    attachPageSpecificEvents();

    if (typeof loadFooter === "function") {
        loadFooter();
    } else {
        console.warn("loadFooter() não encontrada");
    }

    setTimeout(() => {
        console.log("Firebase disponível:", typeof firebase !== "undefined");
        console.log("Google login:", typeof loginWithGoogle === "function");
        console.log("GitHub login:", typeof loginWithGithub === "function");
    }, 1000);
}

function loadFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    fetch("rodape.html")
        .then(res => res.text())
        .then(html => {
            footerContainer.innerHTML = html;
            initFooterScripts();
        })
        .catch(err => console.error("Erro ao carregar footer:", err));
}

function initFooterScripts() {
    const btn = document.getElementById("footer-subscribe-btn");
    const input = document.getElementById("footer-newsletter-email");

    if (!btn || !input) return;

    btn.addEventListener("click", () => {
        const email = input.value.trim();
        if (email.includes("@") && email.includes(".")) {
            alert("📧 Inscrito com sucesso: " + email);
            input.value = "";
        } else {
            alert("Por favor, insira um e-mail válido.");
        }
    });
}

document.addEventListener("DOMContentLoaded", init);

// ===== FIM DO MAIN APPLICATION =====