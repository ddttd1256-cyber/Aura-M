// js/app.js

// Глобальное состояние приложения (заменяет хаотичные переменные)
export const AppState = {
    currentUser: null,
    activeChatId: null
};

document.addEventListener('DOMContentLoaded', () => {
    // Анимация загрузки
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            
            // Здесь мы скоро добавим вызов модуля Auth
            console.log("Aura System Initialized");
        }, 800);
    }, 1500);
});
