// js/auth/Auth.js
import { Storage } from '../core/Storage.js';
import { Security } from '../core/Security.js';
import { UIController } from '../ui/UIController.js';
import { AppState } from '../app.js';

export const Auth = {
    init: () => {
        const savedUser = Storage.get('aura_current_user');
        if (!savedUser) {
            // Если не вошел, показываем окно входа
            UIController.openModal('authModal');
        } else {
            // Если уже был авторизован
            AppState.currentUser = savedUser;
            Auth.onLoginSuccess();
        }
    },

    login: () => {
        const idInput = document.getElementById('authId').value.trim().toLowerCase();
        const passInput = document.getElementById('authPass').value;
        
        if (idInput.length < 3 || !passInput) {
            return alert("Логин должен быть от 3 символов, пароль не пустой!");
        }
        
        // Хэшируем пароль (теперь он не лежит в открытом виде в консоли)
        const hashedPass = Security.hashPassword(passInput); 
        const savedPass = Storage.get(`pwd_${idInput}`);
        
        if (savedPass && savedPass !== hashedPass) {
            return alert("❌ Неверный пароль!");
        }
        
        // Если это новый аккаунт, регистрируем
        if (!savedPass) {
            Storage.set(`pwd_${idInput}`, hashedPass);
            Storage.set(`prof_${idInput}`, { balance: 500, role: 'user' }); // Бонус новичку
        }
        
        // Сохраняем сессию
        Storage.set('aura_current_user', idInput);
        AppState.currentUser = idInput;
        
        UIController.closeModal('authModal');
        Auth.onLoginSuccess();
    },

    logout: () => {
        Storage.remove('aura_current_user');
        location.reload();
    },

    onLoginSuccess: () => {
        console.log(`Пользователь ${AppState.currentUser} вошел в систему.`);
        // Здесь позже будет запуск ChatEngine.init()
    }
};
