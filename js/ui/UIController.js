// js/ui/UIController.js

export const UIController = {
    openModal: (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
        }
    },
    
    closeModal: (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    formatBalance: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
};
