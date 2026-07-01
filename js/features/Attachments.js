// js/features/Attachments.js

import { ChatEngine } from '../chat/ChatEngine.js';
import { AppState } from '../app.js';
import { UIController } from '../ui/UIController.js';
import { Security } from '../core/Security.js';

export const Attachments = {
    // Отправка опроса
    sendPoll: () => {
        const q = document.getElementById('pollQuestion').value.trim();
        const o1 = document.getElementById('pollOpt1').value.trim();
        const o2 = document.getElementById('pollOpt2').value.trim();

        if (!q || !o1 || !o2) return alert("Заполните все поля опроса!");

        // Формируем безопасный объект опроса
        const pollData = {
            type: 'poll',
            question: Security.escapeHTML(q),
            options: [
                { text: Security.escapeHTML(o1), votes: 0 },
                { text: Security.escapeHTML(o2), votes: 0 }
            ],
            voted: [] // массив тех, кто уже проголосовал
        };

        // Используем метод из ChatEngine для отправки спец-сообщения
        ChatEngine.sendCustomMessage(pollData);
        
        // Очищаем и закрываем
        document.getElementById('pollQuestion').value = '';
        document.getElementById('pollOpt1').value = '';
        document.getElementById('pollOpt2').value = '';
        document.getElementById('pollModal').style.display = 'none';
    },

    // Отправка Геопозиции
    sendLocation: () => {
        if (!navigator.geolocation) {
            return alert("Ваш браузер не поддерживает геолокацию.");
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const link = `https://yandex.ru/maps/?pt=${lon},${lat}&z=15&l=map`;
                
                ChatEngine.sendCustomMessage({
                    type: 'geo',
                    text: `📍 Моя геопозиция`,
                    link: link
                });
            },
            (error) => {
                alert("❌ Ошибка получения геопозиции. Разрешите доступ в браузере.");
            }
        );
    }
};
