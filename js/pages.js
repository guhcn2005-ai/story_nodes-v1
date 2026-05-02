// ===== RENDERIZAÇÃO DAS PÁGINAS =====
// parte mais sensivel do projeto - cuidado ao mexer, mudanças podem quebrar a aplicação (quase todas as páginas dependem desta parte para renderizar, então cuidado ao mexer aqui)

let exploreOffset = 0;
let currentExploreFilter = {
    search: "",
    category: "all",
    sort: "popular"
};

// Página Home
function renderHome() {
    const featuredStories = allStories.slice(0, 3);
    
    return `
        <div class="container">
            <!-- Hero Section -->
            <div style="text-align: center; margin: 40px 0 20px;">
                <h1 style="font-size: 3rem; font-weight: 800; max-width: 800px; margin: 0 auto;">Crie Histórias Interativas<br>Que Seus Leitores Controlam</h1>
                <p style="font-size: 1.2rem; color: #4b4a45; margin: 20px auto; max-width: 600px;">A plataforma definitiva para criar, publicar e encerrar histórias com múltiplos finais e cenários narrativos.</p>
                <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn-primary btn" id="heroComprar">Comprar Plataforma</button>
                    <button class="btn-outline btn" id="heroExplorar">Explorar Histórias</button>
                </div>
            </div>
            
            <!-- Stats -->
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 48px; margin: 50px 0; background: #fff9f0; padding: 32px; border-radius: 60px;">
                <div><strong style="font-size: 2rem;">50k+</strong><br>Histórias Editadas</div>
                <div><strong style="font-size: 2rem;">12k+</strong><br>Histórias Criadas</div>
                <div><strong style="font-size: 2rem;">500k+</strong><br>Leituras</div>
                <div><strong style="font-size: 2rem;">1M+</strong><br>Histórias Publicadas</div>
            </div>
            
            <!-- Features -->
            <h2 style="font-size: 2rem;">Por Que StoryNodes?</h2>
            <div class="card-grid" style="margin-bottom: 40px;">
                <div class="story-card"><i class="fas fa-book-open" style="font-size: 2rem; color:#7c3aed;"></i><h3>Histórias interativas</h3><p>Com recursos voltados ao público em geral.</p></div>
                <div class="story-card"><i class="fas fa-pen-fancy" style="font-size: 2rem; color:#7c3aed;"></i><h3>Editor Visual</h3><p>Criação de layouts e gráficos.</p></div>
                <div class="story-card"><i class="fas fa-code-branch" style="font-size: 2rem; color:#7c3aed;"></i><h3>Múltiplos caminhos</h3><p>Escolhas que moldam o final.</p></div>
                <div class="story-card"><i class="fas fa-globe" style="font-size: 2rem; color:#7c3aed;"></i><h3>Alcance Global</h3><p>Acesse histórias de todos os países.</p></div>
            </div>
            
            <!-- Featured Stories -->
            <h2>Histórias em Destaque</h2>
            <div class="card-grid" id="featuredStories">
                ${featuredStories.map(renderStoryCard).join("")}
            </div>
            
            <!-- Footer CTA -->
            <div class="footer-cta">
                <h2>Pronto Para Criar Sua Primeira História?</h2>
                <p style="margin: 16px 0;">Junte-se a milhares de autores que já estão criando histórias incríveis na StoryNode!</p>
                <button class="btn-primary btn" id="ctaRegister">Clique Aqui Para Entrar</button>
            </div>
        </div>
    `;
}

// Página Explorar
function renderExplore() {
    const categories = getUniqueCategories();
    const categoryButtons = `
        <button class="tab-btn active" data-cat="all">Todos</button>
        ${categories.map(cat => `<button class="tab-btn" data-cat="${cat}">${cat}</button>`).join("")}
    `;
    
    // Renderizar stories com filtros atuais
    const filteredStories = filterStories(currentExploreFilter);
    const paginatedStories = filteredStories.slice(0, exploreOffset + STORIES_PER_PAGE);
    const hasMore = paginatedStories.length < filteredStories.length;
    
    return `
        <div class="container">
            <h1>Explorar Histórias</h1>
            <div class="filter-bar">
                <input type="text" id="searchExplore" class="search-input" placeholder="Buscar historias, autores, categorias..." value="${escapeHtml(currentExploreFilter.search)}">
                <div style="display: flex; gap: 10px; flex-wrap: wrap;" id="categoryFilters">
                    ${categoryButtons}
                </div>
            </div>
            <div class="tabs" id="sortTabs">
                <button class="tab-btn ${currentExploreFilter.sort === 'popular' ? 'active' : ''}" data-sort="popular">Populares</button>
                <button class="tab-btn ${currentExploreFilter.sort === 'recent' ? 'active' : ''}" data-sort="recent">Recentes</button>
                <button class="tab-btn ${currentExploreFilter.sort === 'rated' ? 'active' : ''}" data-sort="rated">Melhor Avaliadas</button>
            </div>
            <div id="exploreGrid" class="card-grid">
                ${paginatedStories.map(renderStoryCard).join("")}
            </div>
            ${hasMore ? '<button id="loadMore" class="btn-outline btn" style="margin: 20px auto; display: block;">Carregar mais histórias</button>' : ''}
        </div>
    `;
}

// Filtra stories baseado nos parâmetros
function filterStories(filters) {
    let filtered = [...allStories];
    
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(s => 
            s.title.toLowerCase().includes(searchLower) || 
            s.author.toLowerCase().includes(searchLower)
        );
    }
    
    if (filters.category !== "all") {
        filtered = filtered.filter(s => s.category === filters.category);
    }
    
    if (filters.sort === "popular") {
        filtered.sort((a, b) => b.reads - a.reads);
    } else if (filters.sort === "rated") {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === "recent") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return filtered;
}

// Página Em Alta
function renderTrending() {
    const trendingStories = allStories.filter(s => s.trending === true);
    
    return `
        <div class="container">
            <h1>Em Alta</h1>
            <p>Histórias mais comentadas e interativas da semana</p>
            <div class="card-grid">
                ${trendingStories.map(renderStoryCard).join("")}
            </div>
        </div>
    `;
}

// Página Login
function renderLogin() {
    return `
        <div class="form-container">
            <h2 style="margin-bottom: 24px;">Bem-vindo de volta</h2>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="loginEmail" placeholder="seu@email.com">
            </div>
            <div class="form-group">
                <label>Senha</label>
                <input type="password" id="loginPassword" placeholder="********">
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
                <label><input type="checkbox" id="rememberMe"> Lembrar de mim</label>
                <a href="#" style="color:#7c3aed;">Esqueceu a senha?</a>
            </div>
            <button class="btn-primary btn" style="width:100%; justify-content:center;" id="doLogin">Entrar</button>
            <div class="social-login">
                <div class="social-btn"><i class="fab fa-google"></i> Google</div>
                <div class="social-btn"><i class="fab fa-github"></i> GitHub</div>
            </div>
            <p style="text-align:center; margin-top: 24px;">Não tem uma conta? <a href="#" data-page="register" style="color:#7c3aed;">Cadastre-se gratuitamente</a></p>
        </div>
    `;
}

// Página Cadastro
function renderRegister() {
    return `
        <div class="form-container">
            <h2>Crie sua conta</h2>
            <div class="form-group">
                <label>Nome completo</label>
                <input type="text" id="regName" placeholder="João Silva">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="regEmail" placeholder="seu@email.com">
            </div>
            <div class="form-group">
                <label>Senha</label>
                <input type="password" id="regPassword" placeholder="********">
                <small>Mínimo de 8 caracteres</small>
            </div>
            <div style="margin: 16px 0;">
                <label><input type="checkbox" id="termsCheck"> Eu concordo com os <strong>Termos de Serviço</strong></label>
            </div>
            <button class="btn-primary btn" style="width:100%" id="doRegister">Criar Conta</button>
            <div class="social-login">
                <div class="social-btn"><i class="fab fa-google"></i> Google</div>
                <div class="social-btn"><i class="fab fa-github"></i> GitHub</div>
            </div>
            <p style="text-align:center; margin-top:24px;">Já tem uma conta? <a href="#" data-page="login" style="color:#7c3aed;">Faça login</a></p>
        </div>
    `;
}

// ===== DASHBOARD CLIENTE PROFISSIONAL =====
function renderDashboard() {
    const user = getCurrentUser();
    
    // Dados do autor (mock)
    const authorStats = {
        totalStories: 4,
        totalReads: 12480,
        totalInteractions: 3847,
        avgRating: 4.7,
        completionRate: 78,
        monthlyGrowth: 23,
        topStory: "A Jornada do Herói Esquecido",
        recentActivity: [
            { action: "Nova leitura", story: "A Jornada do Herói Esquecido", time: "2 min atrás", icon: "book-open" },
            { action: "Comentário recebido", story: "Mistério no Laboratório", time: "15 min atrás", icon: "comment" },
            { action: "Avaliação 5 estrelas", story: "Romance nas Estrelas", time: "1 hora atrás", icon: "star" },
            { action: "História compartilhada", story: "Aventura nas Ilhas", time: "3 horas atrás", icon: "share" }
        ],
        stories: [
            { id: 1, title: "A Jornada do Herói Esquecido", status: "published", reads: 5240, rating: 4.8, chapters: 12, lastUpdate: "2025-03-20" },
            { id: 2, title: "Mistério no Laboratório", status: "published", reads: 3890, rating: 4.9, chapters: 8, lastUpdate: "2025-03-18" },
            { id: 3, title: "Romance nas Estrelas", status: "draft", reads: 0, rating: 0, chapters: 3, lastUpdate: "2025-03-22" },
            { id: 4, title: "O Segredo da Floresta", status: "published", reads: 3350, rating: 4.6, chapters: 10, lastUpdate: "2025-03-15" }
        ]
    };
    
    return `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <div class="dashboard-title-section">
                    <h1>Meu Painel</h1>
                    <p>Bem-vindo de volta, <strong>${user?.name || "Visitante"}</strong>! Aqui está o resumo da sua carreira como escritor.</p> 
                </div> 
                <button class="btn-primary btn" id="createNewStoryBtn">
                    <i class="fas fa-plus"></i> Criar Nova História
                </button>
            </div>
            
            <!-- Métricas Principais -->
            <div class="stats-grid">
                <div class="stat-card premium">
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-content">
                        <h3>${authorStats.totalStories}</h3>
                        <p>Histórias Publicadas</p>
                        <span class="stat-trend up"><i class="fas fa-arrow-up"></i> +2 este mês</span>
                    </div>
                </div>
                <div class="stat-card premium">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <h3>${authorStats.totalReads.toLocaleString()}</h3>
                        <p>Leitores Totais</p>
                        <span class="stat-trend up"><i class="fas fa-arrow-up"></i> +${authorStats.monthlyGrowth}%</span>
                    </div>
                </div>
                <div class="stat-card premium">
                    <div class="stat-icon"><i class="fas fa-star"></i></div>
                    <div class="stat-content">
                        <h3>${authorStats.avgRating}</h3>
                        <p>Avaliação Média</p>
                        <div class="stars">
                            ${renderStars(authorStats.avgRating)}
                        </div>
                    </div>
                </div>
                <div class="stat-card premium">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-content">
                        <h3>${authorStats.completionRate}%</h3>
                        <p>Taxa de Conclusão</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${authorStats.completionRate}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Gráfico de Desempenho (Simulado com CSS) -->
            <div class="chart-container">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-line"></i> Desempenho Semanal</h3>
                    <select id="chartPeriod" class="chart-select">
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                    </select>
                </div>
                <div class="chart-bars" id="weeklyChart">
                    ${generateWeeklyChart()}
                </div>
            </div>
            
            <!-- Minhas Histórias e Atividades -->
            <div class="dashboard-two-columns">
                <!-- Minhas Histórias -->
                <div class="stories-section">
                    <div class="section-header">
                        <h3><i class="fas fa-pen-fancy"></i> Minhas Histórias</h3>
                        <a href="#" class="view-all">Ver todas <i class="fas fa-arrow-right"></i></a>
                    </div>
                    <div class="stories-list">
                        ${authorStats.stories.map(story => `
                            <div class="story-item ${story.status === 'draft' ? 'draft' : ''}">
                                <div class="story-info">
                                    <h4>${escapeHtml(story.title)}</h4>
                                    <div class="story-meta">
                                        <span><i class="fas fa-book-open"></i> ${story.reads.toLocaleString()} leituras</span>
                                        <span><i class="fas fa-star"></i> ${story.rating || 'Em desenvolvimento'}</span>
                                        <span><i class="fas fa-layer-group"></i> ${story.chapters} capítulos</span>
                                        <span class="status-badge ${story.status}">${story.status === 'published' ? 'Publicada' : 'Rascunho'}</span>
                                    </div>
                                </div>
                                <div class="story-actions">
                                    <button class="icon-btn" onclick="editStory(${story.id})" title="Editar"><i class="fas fa-edit"></i></button>
                                    <button class="icon-btn" onclick="viewStats(${story.id})" title="Estatísticas"><i class="fas fa-chart-simple"></i></button>
                                    ${story.status === 'draft' ? 
                                        `<button class="icon-btn success" onclick="publishStory(${story.id})" title="Publicar"><i class="fas fa-cloud-upload-alt"></i></button>` :
                                        `<button class="icon-btn" onclick="shareStory(${story.id})" title="Compartilhar"><i class="fas fa-share-alt"></i></button>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-outline btn full-width" id="viewAllStoriesBtn">
                        <i class="fas fa-list"></i> Gerenciar Todas as Histórias
                    </button>
                </div>
                
                <!-- Atividades Recentes -->
                <div class="activities-section">
                    <div class="section-header">
                        <h3><i class="fas fa-bell"></i> Atividades Recentes</h3>
                        <span class="badge-new">${authorStats.recentActivity.length} novas</span>
                    </div>
                    <div class="activities-list">
                        ${authorStats.recentActivity.map(activity => `
                            <div class="activity-item">
                                <div class="activity-icon ${activity.icon}">
                                    <i class="fas fa-${activity.icon}"></i>
                                </div>
                                <div class="activity-content">
                                    <p><strong>${activity.action}</strong> em "${activity.story}"</p>
                                    <span class="activity-time">${activity.time}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Dica do Dia -->
                    <div class="tip-card">
                        <i class="fas fa-lightbulb"></i>
                        <div class="tip-content">
                            <h4>Dica do Dia</h4>
                            <p>Histórias com capítulos semanais têm <strong>47% mais engajamento</strong>! Mantenha uma rotina de publicações.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Top Story -->
            <div class="top-story-card">
                <div class="top-story-content">
                    <span class="top-badge"><i class="fas fa-trophy"></i> História em Destaque</span>
                    <h3>${authorStats.topStory}</h3>
                    <p>Esta é sua história mais lida! Continue com o sucesso e considere criar uma continuação.</p>
                    <button class="btn-outline btn" onclick="viewStoryDetails()">
                        Ver Estatísticas Detalhadas <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                <div class="top-story-icon">
                    <i class="fas fa-crown"></i>
                </div>
            </div>
        </div>
    `;
}

// ===== DASHBOARD ADMIN PROFISSIONAL =====
function renderAdminDashboard() {
    // Dados do admin (mock)
    const adminStats = {
        totalUsers: 1247,
        totalStories: 342,
        totalReads: 158432,
        totalInteractions: 45678,
        avgRating: 4.6,
        pendingModeration: 8,
        reportedStories: 3,
        newUsersThisWeek: 89,
        platformGrowth: 23.5,
        revenue: 12450,
        activeAuthors: 342,
        completionRate: 68
    };
    
    const recentStories = [
        { id: 1, title: "O Último Dragão", author: "Carlos Silva", status: "pending", category: "Fantasia", date: "2025-03-24", reports: 0 },
        { id: 2, title: "Mistério na Biblioteca", author: "Ana Souza", status: "approved", category: "Mistério", date: "2025-03-23", reports: 0 },
        { id: 3, title: "Amor Proibido", author: "Mariana Lima", status: "reported", category: "Romance", date: "2025-03-22", reports: 2 },
        { id: 4, title: "Terror no Subsolo", author: "Pedro Rocha", status: "pending", category: "Terror", date: "2025-03-24", reports: 0 },
        { id: 5, title: "Futuro Distópico", author: "Lucas Mendes", status: "approved", category: "Ficção", date: "2025-03-21", reports: 1 }
    ];
    
    const topAuthors = [
        { name: "Maria Silva", stories: 12, reads: 45200, rating: 4.9 },
        { name: "João Pedro", stories: 8, reads: 38700, rating: 4.8 },
        { name: "Ana Costa", stories: 6, reads: 29300, rating: 4.7 },
        { name: "Carlos Mendes", stories: 5, reads: 18700, rating: 4.6 }
    ];
    
    return `
        <div class="dashboard-container admin-dashboard">
            <div class="dashboard-header">
                <div class="dashboard-title-section">
                    <h1><i class="fas fa-shield-alt"></i> Painel Administrativo</h1>
                    <p>Visão geral da plataforma StoryNodes - Gerencie conteúdo, usuários e análises.</p>
                </div>
                <div class="header-actions">
                    <button class="btn-outline btn" id="exportDataBtn">
                        <i class="fas fa-download"></i> Exportar Dados
                    </button>
                    <button class="btn-primary btn" id="generateReportBtn">
                        <i class="fas fa-chart-line"></i> Gerar Relatório
                    </button>
                </div>
            </div>
            
            <!-- Métricas Principais -->
            <div class="stats-grid admin-stats">
                <div class="stat-card premium">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <h3>${adminStats.totalUsers.toLocaleString()}</h3>
                        <p>Usuários Totais</p>
                        <span class="stat-trend up"><i class="fas fa-arrow-up"></i> +${adminStats.newUsersThisWeek} esta semana</span>
                    </div>
                </div>
                <div class="stat-card premium">
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-content">
                        <h3>${adminStats.totalStories}</h3>
                        <p>Histórias Publicadas</p>
                        <span class="stat-trend up"><i class="fas fa-arrow-up"></i> +12 este mês</span>
                    </div>
                </div>
                <div class="stat-card premium">
                    <div class="stat-icon"><i class="fas fa-eye"></i></div>
                    <div class="stat-content">
                        <h3>${adminStats.totalReads.toLocaleString()}</h3>
                        <p>Leituras Totais</p>
                        <span class="stat-trend up"><i class="fas fa-arrow-up"></i> +${adminStats.platformGrowth}%</span>
                    </div>
                </div>
                <div class="stat-card premium warning">
                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="stat-content">
                        <h3>${adminStats.pendingModeration}</h3>
                        <p>Pendentes de Moderação</p>
                        <span class="stat-trend neutral"><i class="fas fa-exclamation-triangle"></i> Requer atenção</span>
                    </div>
                </div>
            </div>
            
            <!-- Gráficos e Métricas Avançadas -->
            <div class="admin-grid">
                <!-- Crescimento da Plataforma -->
                <div class="admin-card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-line"></i> Crescimento da Plataforma</h3>
                        <select id="growthPeriod" class="mini-select">
                            <option value="7">Últimos 7 dias</option>
                            <option value="30">Últimos 30 dias</option>
                            <option value="90">Últimos 90 dias</option>
                        </select>
                    </div>
                    <div class="growth-chart" id="growthChart">
                        ${generateGrowthChart()}
                    </div>
                    <div class="chart-stats">
                        <div class="chart-stat-item">
                            <span class="label">Taxa de Crescimento</span>
                            <span class="value positive">+${adminStats.platformGrowth}%</span>
                        </div>
                        <div class="chart-stat-item">
                            <span class="label">Novos Usuários (mês)</span>
                            <span class="value">${adminStats.newUsersThisWeek * 4}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Categorias Populares -->
                <div class="admin-card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-pie"></i> Categorias Populares</h3>
                    </div>
                    <div class="categories-list">
                        ${generateCategoriesList()}
                    </div>
                </div>
            </div>
            
            <div class="admin-grid">
                <!-- Moderação de Conteúdo -->
                <div class="admin-card full-width">
                    <div class="card-header">
                        <h3><i class="fas fa-flag"></i> Moderação de Conteúdo</h3>
                        <div class="filter-tabs">
                            <button class="filter-tab active" data-filter="all">Todos</button>
                            <button class="filter-tab" data-filter="pending">Pendentes (${adminStats.pendingModeration})</button>
                            <button class="filter-tab" data-filter="reported">Denunciadas (${adminStats.reportedStories})</button>
                        </div>
                    </div>
                    <div class="moderation-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>História</th>
                                    <th>Autor</th>
                                    <th>Categoria</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentStories.map(story => `
                                    <tr class="${story.status === 'reported' ? 'warning-row' : ''}">
                                        <td><strong>${escapeHtml(story.title)}</strong></td>
                                        <td>${escapeHtml(story.author)}</td>
                                        <td><span class="category-badge">${story.category}</span></td>
                                        <td>${formatDate(story.date)}</td>
                                        <td>
                                            <span class="status-badge ${story.status}">
                                                ${story.status === 'pending' ? '⏳ Pendente' : story.status === 'approved' ? '✓ Aprovada' : '⚠️ Denunciada'}
                                            </span>
                                            ${story.reports > 0 ? `<span class="reports-count">${story.reports} denúncias</span>` : ''}
                                        </td>
                                        <td class="action-buttons">
                                            <button class="icon-btn small" onclick="approveStory(${story.id})" title="Aprovar"><i class="fas fa-check-circle"></i></button>
                                            <button class="icon-btn small" onclick="rejectStory(${story.id})" title="Rejeitar"><i class="fas fa-times-circle"></i></button>
                                            <button class="icon-btn small" onclick="viewStoryDetails(${story.id})" title="Visualizar"><i class="fas fa-eye"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer">
                        <button class="btn-text" id="viewAllModerationBtn">
                            Ver todas as pendências <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="admin-grid">
                <!-- Top Autores -->
                <div class="admin-card">
                    <div class="card-header">
                        <h3><i class="fas fa-trophy"></i> Top Autores</h3>
                    </div>
                    <div class="authors-ranking">
                        ${topAuthors.map((author, index) => `
                            <div class="author-rank-item">
                                <div class="rank-number ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">
                                    ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                                </div>
                                <div class="author-info">
                                    <h4>${escapeHtml(author.name)}</h4>
                                    <div class="author-stats">
                                        <span><i class="fas fa-book"></i> ${author.stories} histórias</span>
                                        <span><i class="fas fa-users"></i> ${(author.reads / 1000).toFixed(1)}k leituras</span>
                                        <span><i class="fas fa-star"></i> ${author.rating}</span>
                                    </div>
                                </div>
                                <div class="author-actions">
                                    <button class="icon-btn small" onclick="viewAuthorDetails('${author.name}')"><i class="fas fa-chart-line"></i></button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Métricas Rápidas -->
                <div class="admin-card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-simple"></i> Métricas Rápidas</h3>
                    </div>
                    <div class="quick-metrics">
                        <div class="metric-item">
                            <span class="metric-label">Taxa de Engajamento</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 78%"></div>
                            </div>
                            <span class="metric-value">78%</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Histórias por Usuário</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 42%"></div>
                            </div>
                            <span class="metric-value">3.2</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Tempo Médio de Leitura</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 65%"></div>
                            </div>
                            <span class="metric-value">18 min</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Retenção de Usuários</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 71%"></div>
                            </div>
                            <span class="metric-value">71%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== FUNÇÕES AUXILIARES =====
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    while (stars.length / 22 < 5) stars += '<i class="far fa-star"></i>';
    return `<div class="stars-display">${stars}</div>`;
}

function generateWeeklyChart() {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const values = [120, 145, 132, 168, 210, 189, 156];
    const maxValue = Math.max(...values);
    
    return days.map((day, index) => {
        const height = (values[index] / maxValue) * 100;
        return `
            <div class="chart-bar-item">
                <div class="bar" style="height: ${height}%"></div>
                <span class="bar-label">${day}</span>
                <span class="bar-value">${values[index]}</span>
            </div>
        `;
    }).join('');
}

function generateGrowthChart() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const values = [45, 52, 48, 63, 71, 89];
    const maxValue = Math.max(...values);
    
    return `
        <div class="line-chart">
            ${months.map((month, index) => {
                const height = (values[index] / maxValue) * 100;
                return `
                    <div class="chart-point">
                        <div class="point-marker" style="bottom: ${height}%"></div>
                        <span class="point-label">${month}</span>
                    </div>
                `;
            }).join('')}
            <div class="chart-line"></div>
        </div>
    `;
}

function generateCategoriesList() {
    const categories = [
        { name: "Fantasia", count: 78, percentage: 28, icon: "dragon" },
        { name: "Mistério", count: 52, percentage: 19, icon: "search" },
        { name: "Romance", count: 48, percentage: 17, icon: "heart" },
        { name: "Terror", count: 42, percentage: 15, icon: "ghost" },
        { name: "Ficção", count: 35, percentage: 13, icon: "robot" },
        { name: "Aventura", count: 28, percentage: 8, icon: "compass" }
    ];
    
    return categories.map(cat => `
        <div class="category-item">
            <div class="category-info">
                <i class="fas fa-${cat.icon}"></i>
                <span>${cat.name}</span>
                <span class="category-count">${cat.count} histórias</span>
            </div>
            <div class="category-bar">
                <div class="category-fill" style="width: ${cat.percentage}%"></div>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Funções globais para ações (serão chamadas pelos botões)
window.editStory = (id) => {
    alert(`Editando história #${id}`);
};

window.viewStats = (id) => {
    alert(`Visualizando estatísticas da história #${id}`);
};

window.publishStory = (id) => {
    alert(`Publicando história #${id}`);
};

window.shareStory = (id) => {
    alert(`Compartilhando história #${id}`);
};

window.viewStoryDetails = (id) => {
    alert(`Visualizando detalhes da história #${id}`);
};

window.approveStory = (id) => {
    alert(`História #${id} aprovada com sucesso!`);
};

window.rejectStory = (id) => {
    if(confirm('Tem certeza que deseja rejeitar esta história?')) {
        alert(`História #${id} rejeitada.`);
    }
};

window.viewAuthorDetails = (name) => {
    alert(`Visualizando detalhes do autor: ${name}`);
};