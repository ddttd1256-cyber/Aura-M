// js/chat/ChatEngine.js
import { Storage } from '../core/Storage.js';
import { Security } from '../core/Security.js';
import { AppState } from '../app.js';

export const ChatEngine = {
    getMsgKey: () => {
        return `msg_${[AppState.currentUser, AppState.activeChatId].sort().join('_')}`;
    },

    renderChatList: () => {
        const listContainer = document.getElementById('chatList');
        if (!listContainer) return;
        
        let chats = Storage.get(`chats_${AppState.currentUser}`, []);
        
        if (chats.length === 0) {
            listContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--text-muted);">
                    У вас пока нет чатов. Создайте новый!
                </div>`;
            return;
        }

        listContainer.innerHTML = chats.map(chat => {
            const isActive = chat.id === AppState.activeChatId ? 'background: rgba(255,255,255,0.1);' : '';
            const safeName = Security.escapeHTML(chat.id);
            const firstLetter = safeName.charAt(0).toUpperCase();

            return `
                <div class="chat-item" data-id="${safeName}" style="padding: 15px; border-bottom: 1px solid var(--glass-border); cursor: pointer; display: flex; gap: 15px; align-items: center; transition: 0.3s; ${isActive}">
                    <div style="width: 45px; height: 45px; font-size: 1.2rem; background: var(--accent-grad); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${firstLetter}
                    </div>
                    <div style="font-weight: 600; font-size: 1.1rem;">${safeName}</div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                ChatEngine.openChat(e.currentTarget.dataset.id);
            });
        });
    },

    openChat: (chatId) => {
        AppState.activeChatId = chatId;
        document.getElementById('noChatOverlay').style.display = 'none';
        
        const header = document.getElementById('chatHeader');
        header.style.display = 'flex';
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; font-size: 1rem; background: var(--accent-grad); border-radius: 50%; display: flex; align-items: center; justify-content: center;">${chatId.charAt(0).toUpperCase()}</div>
                <h3 style="margin: 0; font-size: 1.2rem;">${Security.escapeHTML(chatId)}</h3>
            </div>
            <button class="btn" id="btnCloseChat" style="padding: 8px 15px; font-size: 0.8rem; background: transparent; border: 1px solid var(--glass-border); color: #fff;">Закрыть</button>
        `;

        document.getElementById('btnCloseChat').addEventListener('click', ChatEngine.closeChat);
        document.getElementById('inputAreaContainer').style.display = 'flex';
        
        ChatEngine.loadMessages();
        ChatEngine.renderChatList();
    },

    closeChat: () => {
        AppState.activeChatId = null;
        document.getElementById('noChatOverlay').style.display = 'flex';
        document.getElementById('chatHeader').style.display = 'none';
        document.getElementById('inputAreaContainer').style.display = 'none';
        ChatEngine.renderChatList();
    },

    loadMessages: () => {
        const chatArea = document.getElementById('chatMessages');
        chatArea.innerHTML = '';
        
        const history = Storage.get(ChatEngine.getMsgKey(), []);
        
        if (history.length === 0) {
            chatArea.innerHTML = `
                <div style="text-align: center; margin-top: 50px; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 10px;">👋</div>
                    <h3>Начало истории</h3>
                    <p>Здесь будет сохранена ваша переписка.</p>
                </div>
            `;
            return;
        }

        history.forEach(msg => {
            chatArea.insertAdjacentHTML('beforeend', ChatEngine.generateMessageHTML(msg));
        });

        setTimeout(() => chatArea.scrollTop = chatArea.scrollHeight, 50);
    },

    generateMessageHTML: (msg) => {
        const isMe = msg.sender === AppState.currentUser;
        const align = isMe ? 'flex-end' : 'flex-start';
        const bg = isMe ? 'var(--accent-grad)' : 'var(--glass-bg)';
        
        let contentHtml = '';

        if (msg.text) {
            const safeText = Security.escapeHTML(msg.text);
            contentHtml = `<div style="word-break: break-word;">${safeText}</div>`;
            
            if (msg.text.startsWith('[img]')) {
                const imgSrc = msg.text.replace('[img]', '');
                contentHtml = `<img src="${Security.escapeHTML(imgSrc)}" style="max-width: 100%; border-radius: 8px; margin-top: 5px;">`;
            }
        } 
        else if (msg.payload) {
            if (msg.payload.type === 'poll') {
                contentHtml = `
                    <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px; min-width: 200px;">
                        <strong style="display: block; margin-bottom: 10px;">📊 ${msg.payload.question}</strong>
                        <button class="btn" style="width: 100%; margin-bottom: 5px; padding: 5px; font-size: 0.9rem; background: transparent; border: 1px solid var(--glass-border); color: #fff;">${msg.payload.options[0].text}</button>
                        <button class="btn" style="width: 100%; padding: 5px; font-size: 0.9rem; background: transparent; border: 1px solid var(--glass-border); color: #fff;">${msg.payload.options[1].text}</button>
                    </div>
                `;
            } else if (msg.payload.type === 'geo') {
                contentHtml = `
                    <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px; text-align: center;">
                        <strong style="display: block; margin-bottom: 10px;">${msg.payload.text}</strong>
                        <a href="${Security.escapeHTML(msg.payload.link)}" target="_blank" class="btn btn-primary" style="text-decoration: none; display: inline-block; padding: 8px 15px; font-size: 0.9rem;">Открыть карту</a>
                    </div>
                `;
            }
        }

        return `
            <div style="display: flex; flex-direction: column; align-items: ${align}; margin-bottom: 15px;">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 5px;">
                    ${isMe ? 'Вы' : Security.escapeHTML(msg.sender)}
                </div>
                <div style="background: ${bg}; padding: 12px 18px; border-radius: 16px; max-width: 75%; color: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    ${contentHtml}
                </div>
            </div>
        `;
    },

    sendMessage: () => {
        const input = document.getElementById('msgInput');
        const text = input.value.trim();
        if (!text || !AppState.activeChatId) return;

        const msg = { id: Date.now(), sender: AppState.currentUser, text: text };
        ChatEngine.saveAndRenderMsg(msg);
        input.value = ''; 
    },

    sendCustomMessage: (payload) => {
        if (!AppState.activeChatId) return;
        const msg = { id: Date.now(), sender: AppState.currentUser, payload: payload };
        ChatEngine.saveAndRenderMsg(msg);
    },

    saveAndRenderMsg: (msg) => {
        const key = ChatEngine.getMsgKey();
        const history = Storage.get(key, []);
        history.push(msg);
        Storage.set(key, history);
        ChatEngine.loadMessages();
    },

    createNewChat: (chatId) => {
        chatId = chatId.trim().toLowerCase();
        if(chatId.length < 3) return alert("Имя чата от 3 символов!");
        if(chatId === AppState.currentUser) return alert("Нельзя создать чат с самим собой.");

        let chats = Storage.get(`chats_${AppState.currentUser}`, []);
        if(!chats.find(c => c.id === chatId)) {
            chats.push({ id: chatId, type: 'user' });
            Storage.set(`chats_${AppState.currentUser}`, chats);
        }
        
        ChatEngine.renderChatList();
        ChatEngine.openChat(chatId);
    }
};
