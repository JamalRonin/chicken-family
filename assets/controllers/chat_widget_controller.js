import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['window', 'toggleBtn', 'history', 'input', 'loader'];

    connect() {
        this.messageCount = 0;
        this.ctaShown = false;
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

    async sendMessage(messageOverride = null) {
        const message = (messageOverride ?? this.inputTarget.value).trim();
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
                this.maybeShowCta();
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
            let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/^\-\s+/gm, '• ');
            html = html.replace(/\n/g, '<br>');
            bubble.innerHTML = html;
        } else {
            bubble.innerText = text;
            this.messageCount += 1;
        }

        this.historyTarget.appendChild(bubble);
        this.scrollToBottom();
    }

    sendSuggestion(event) {
        const suggestion = event.currentTarget.dataset.suggestion;
        this.sendMessage(suggestion);
    }

    maybeShowCta() {
        if (this.ctaShown) return;
        if (this.messageCount < 3) return;

        const bubble = document.createElement('div');
        bubble.className = 'bot-message message-bubble shadow-sm';
        bubble.innerHTML = `
            Besoin de commander ? 
            <a href="https://france.booqcloud.com/webshop/Order2POSChickenFamily/" target="_blank" class="ml-2 inline-flex items-center bg-brand-red text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">Commander</a>
        `;
        this.historyTarget.appendChild(bubble);
        this.ctaShown = true;
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
