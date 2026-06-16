// ===== MOCK DATA =====
const allStories = [
    { 
        id: 1, 
        title: "A Jornada do Herói Esquecido", 
        author: "Maria Silva", 
        category: "Fantasia", 
        reads: 15200, 
        rating: 4.8, 
        desc: "Uma história épica com 12 finais diferentes baseados nas suas escolhas. Embarque em uma aventura onde cada decisão molda o destino.", 
        trending: true, 
        date: "2025-01-10",
        image: null
    },
    { 
        id: 2, 
        title: "Mistério no Laboratório", 
        author: "João Pedro", 
        category: "Mistério", 
        reads: 23500, 
        rating: 4.9, 
        desc: "Resolva o mistério seguindo pistas e tomando decisões cruciais que determinam quem é culpado.", 
        trending: true, 
        date: "2025-02-01",
        image: null
    },
    { 
        id: 3, 
        title: "Romance nas Estrelas", 
        author: "Ana Costa", 
        category: "Romance", 
        reads: 31800, 
        rating: 4.7, 
        desc: "Uma história de amor interativa com múltiplos caminhos românticos e finais emocionantes.", 
        trending: true, 
        date: "2025-02-15",
        image: null
    },
    { 
        id: 4, 
        title: "Sobrevivência no Futuro", 
        author: "Carlos Mendes", 
        category: "Ficção Científica", 
        reads: 19300, 
        rating: 4.6, 
        desc: "Em um futuro distópico, suas escolhas determinarão a sobrevivência da humanidade.", 
        trending: false, 
        date: "2025-01-20",
        image: null
    },
    { 
        id: 5, 
        title: "A Mansão Amaldiçoada", 
        author: "Beatriz Santos", 
        category: "Terror", 
        reads: 27100, 
        rating: 4.8, 
        desc: "Explore os mistérios de uma mansão assombrada onde cada porta leva a um novo terror.", 
        trending: true, 
        date: "2025-02-10",
        image: null
    },
    { 
        id: 6, 
        title: "Aventura nas Ilhas Perdidas", 
        author: "Rafael Lima", 
        category: "Aventura", 
        reads: 18900, 
        rating: 4.5, 
        desc: "Navegue por ilhas misteriosas, encontre tesouros e enfrente perigos em cada esquina.", 
        trending: false, 
        date: "2025-01-28",
        image: null
    },
    { 
        id: 7, 
        title: "O Último Feitiço", 
        author: "Elena Vaz", 
        category: "Fantasia", 
        reads: 9800, 
        rating: 4.9, 
        desc: "Magia ancestral e escolhas que podem mudar reinos inteiros. Uma jornada única.", 
        trending: false, 
        date: "2025-03-01",
        image: null
    },
    { 
        id: 8, 
        title: "Drama no Conservatório", 
        author: "Lucas Andrade", 
        category: "Drama", 
        reads: 12400, 
        rating: 4.4, 
        desc: "Emoções profundas e reviravoltas em uma história sobre sonhos e sacrifícios.", 
        trending: false, 
        date: "2025-02-18",
        image: null
    }
];

// Configurações
const STORIES_PER_PAGE = 6;