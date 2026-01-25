import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['window', 'toggleBtn', 'history', 'input', 'loader'];

    connect() {
        this.scrollToBottom();
    }

    toggle() {
        const isOpen = this.windowTarget.style.display === 'flex';
        this.windowTarget.style.display = isOpen ? 'none' : 'flex';
        this.toggleBtnTarget.style.display = isOpen ? 'flex' : 'none';
        document.body.classList.toggle('lock-scroll', !isOpen);

        if (!isOpen) {
            this.inputTarget.focus();
            this.scrollToBottom();
        }
    }

    async sendMessage() {
        const message = this.inputTarget.value.trim();
        if (!message) return;

        this.addMessage(message, true);
        this.inputTarget.value = '';

        this.showLoader();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            this.hideLoader();

            if (data.response) {
                this.addMessage(data.response, false);
            } else {
                this.addMessage('Désolé, une erreur est survenue.', false);
            }
        } catch (error) {
            this.hideLoader();
            this.addMessage('Souci technique ! Veuillez réessayer.', false);
        }
    }

    addMessage(text, isUser) {
        const bubble = document.createElement('div');
        bubble.className = isUser
            ? 'user-message message-bubble'
            : 'bot-message message-bubble shadow-sm';

        // Simple markdown-like bold handling for the bot
        if (!isUser) {
            bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
            bubble.innerText = text;
        }

        this.historyTarget.appendChild(bubble);
        this.scrollToBottom();
    }

    showLoader() {
        const loader = document.createElement('div');
        loader.id = 'chat-loader';
        loader.className = 'bot-message message-bubble italic text-[10px] opacity-60 flex items-center gap-2';
        loader.innerHTML = `<div class="loader !w-3 !h-3"></div> Chef IA réfléchit...`;
        this.historyTarget.appendChild(loader);
        this.scrollToBottom();
    }

    hideLoader() {
        const loader = document.getElementById('chat-loader');
        if (loader) loader.remove();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.historyTarget.scrollTop = this.historyTarget.scrollHeight;
        }, 100);
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }
}
