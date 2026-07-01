

export const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Ошибка чтения БД:', e);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert("⚠️ Память устройства переполнена. Очистите историю, чтобы сохранить новые данные.");
            }
        }
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    }
};
