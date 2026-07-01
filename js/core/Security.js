// js/core/Security.js

export const Security = {
    escapeHTML: (str) => {
        if (!str) return '';
        return str.toString().replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            }[tag])
        );
    },
    
    // Простейшее хэширование пароля для локальной среды, чтобы не хранить в открытом виде
    hashPassword: (password) => {
        return btoa(password); 
    }
};
