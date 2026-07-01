// js/app.js
import { Auth } from './auth/Auth.js';
import { ChatEngine } from './chat/ChatEngine.js';
import { Bank } from './features/Bank.js';
import { Attachments } from './features/Attachments.js';

export const AppState = {
    currentUser: null,
    activeChatId: null
};

// Функция вызывается после успешного входа
export const onSystemReady = () => {
    ChatEngine.renderChatList();
    Bank.updateUI();
};

document.addEventListener('DOMContentLoaded', () => {
    // Привязка кнопок авторизации и чата
    document.getElementById('btnLogin').addEventListener('click', Auth.login);
    document.getElementById('btnSend').addEventListener('click', ChatEngine.sendMessage);
    
    // Привязка кнопки добавления нового чата
    document.getElementById('btnAddChat').addEventListener('click', () => {
        const name = prompt("Введите ID пользователя для создания чата:");
        if(name) ChatEngine.createNewChat(name);
    });

    // Отправка по нажатию Enter
    document.getElementById('msgInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') ChatEngine.sendMessage();
    });

    // Привязки для фич (Банк, Опросы, Гео)
    document.getElementById('btnBuyNFT').addEventListener('click', Bank.buyNFT);
    document.getElementById('btnSendPoll').addEventListener('click', Attachments.sendPoll);
    document.getElementById('btnGeo').addEventListener('click', Attachments.sendLocation);

    // Анимация Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            
            Auth.init(); // Запускаем проверку входа
        }, 800);
    }, 1500);
});
