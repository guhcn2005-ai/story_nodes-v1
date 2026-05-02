// ===== SISTEMA DE NOTIFICAÇÕES =====
// Gerencia notificações tipo toast, modais de confirmação e alertas, e um overlay de loading
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Criar container de notificações
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', title = '') {
        const titles = {
            success: 'Sucesso!',
            error: 'Erro!',
            warning: 'Atenção!',
            info: 'Informação'
        };

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title || titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-close">✕</div>
            <div class="toast-progress"></div>
        `;

        this.container.appendChild(toast);

        // Fechar ao clicar no X
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.close(toast));

        // Auto-fechar após 3 segundos
        setTimeout(() => this.close(toast), 3000);

        return toast;
    }

    close(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }

    success(message, title = '') {
        return this.show(message, 'success', title);
    }

    error(message, title = '') {
        return this.show(message, 'error', title);
    }

    warning(message, title = '') {
        return this.show(message, 'warning', title);
    }

    info(message, title = '') {
        return this.show(message, 'info', title);
    }
}

// ===== MODAL DE CONFIRMAÇÃO =====
class ModalDialog {
    static async confirm(message, title = 'Confirmar') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            
            const modal = document.createElement('div');
            modal.className = 'modal-content';
            
            modal.innerHTML = `
                <div class="modal-icon info">
                    <i class="fas fa-question-circle"></i>
                </div>
                <div class="modal-title">${title}</div>
                <div class="modal-message">${message}</div>
                <div class="modal-buttons">
                    <button class="btn-outline btn" id="modalCancel">Cancelar</button>
                    <button class="btn-primary btn" id="modalConfirm">Confirmar</button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            const cancelBtn = modal.querySelector('#modalCancel');
            const confirmBtn = modal.querySelector('#modalConfirm');
            
            const cleanup = () => {
                overlay.remove();
            };
            
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
            
            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });
            
            // Fechar ao clicar no overlay
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            });
        });
    }
    
    static async alert(message, title = 'Aviso', type = 'info') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            
            const modal = document.createElement('div');
            modal.className = 'modal-content';
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            modal.innerHTML = `
                <div class="modal-icon ${type}">
                    ${icons[type]}
                </div>
                <div class="modal-title">${title}</div>
                <div class="modal-message">${message}</div>
                <div class="modal-buttons">
                    <button class="btn-primary btn" id="modalOk">Ok</button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            const okBtn = modal.querySelector('#modalOk');
            
            const cleanup = () => {
                overlay.remove();
                resolve();
            };
            
            okBtn.addEventListener('click', cleanup);
            
            // Fechar ao clicar no overlay
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                }
            });
        });
    }
}

// ===== LOADING OVERLAY =====
class LoadingOverlay {
    constructor() {
        this.overlay = null;
    }
    
    show(message = 'Processando...') {
        this.hide();
        
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
    }
    
    hide() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
}

// Inicializar sistemas globais
const notifications = new NotificationSystem();
const loading = new LoadingOverlay();
window.ModalDialog = ModalDialog;