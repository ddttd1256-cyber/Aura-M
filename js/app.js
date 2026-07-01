// js/app.js
import { Auth } from './auth/Auth.js';

export const AppState = {
    currentUser: null,
    activeChatId: null
};

document.addEventListener('DOMContentLoaded', () => {
    // Привязываем события к кнопкам
    document.getElementById('btnLogin').addEventListener('click', Auth.login);

    // Анимация Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            
            // Запускаем систему авторизации
            Auth.init();
        }, 800);
    }, 1500);
});
