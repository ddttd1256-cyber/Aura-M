// js/features/Bank.js

import { Storage } from '../core/Storage.js';
import { AppState } from '../app.js';
import { UIController } from '../ui/UIController.js';

export const Bank = {
    // Получение профиля (если нет, создаем с 500 AUR)
    getProfile: () => {
        return Storage.get(`prof_${AppState.currentUser}`, { balance: 500, nfts: [] });
    },

    // Сохранение профиля
    saveProfile: (profData) => {
        Storage.set(`prof_${AppState.currentUser}`, profData);
    },

    // Обновление отображения баланса везде
    updateUI: () => {
        const prof = Bank.getProfile();
        const formatted = UIController.formatBalance(prof.balance);
        
        const headBal = document.getElementById('headBalance');
        if (headBal) headBal.innerText = `${formatted} AUR`;
        
        const modBal = document.getElementById('modalBalance');
        if (modBal) modBal.innerText = formatted;
    },

    // Покупка NFT
    buyNFT: () => {
        const prof = Bank.getProfile();
        const price = 100;

        if (prof.balance < price) {
            return alert("❌ Недостаточно средств для покупки NFT!");
        }

        prof.balance -= price;
        const newNFT = `NFT #${Math.floor(1000 + Math.random() * 9000)}`;
        prof.nfts.push(newNFT);
        
        Bank.saveProfile(prof);
        Bank.updateUI();
        alert(`🎉 Вы успешно приобрели ${newNFT}! Остаток: ${prof.balance} AUR`);
    }
};
