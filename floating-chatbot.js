// Floating Chatbot Widget
class FloatingChatbot {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.setupEventListeners();
  }

  createWidget() {
    // Create container
    const container = document.createElement('div');
    container.id = 'floating-chatbot-container';
    container.innerHTML = `
      <!-- Chat Toggle Button -->
      <div id="chat-toggle-btn" class="chat-toggle-btn" title="Chat with MediMate">
        <i class="fas fa-comments"></i>
        <span class="chat-badge" id="chat-badge" style="display: none;">1</span>
      </div>

      <!-- Chat Window -->
      <div id="chat-window-widget" class="chat-window-widget">
        <div class="chat-header-widget">
          <div class="chat-title-widget">
            <i class="fas fa-robot"></i> MediMate
          </div>
          <button id="chat-close-btn" class="chat-close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="chat-messages-widget" id="chat-messages-widget">
          <div class="chat-message-widget bot-message-widget">
            <div class="message-content-widget">
              <p><strong>MediMate:</strong> Hello! 👋 I'm your AI health assistant. Tell me about your symptoms, and I'll provide helpful insights.</p>
              <p style="font-size: 0.85em; margin-top: 8px; color: #666;">
                <i class="fas fa-exclamation-circle"></i> Educational purposes only. Always consult a healthcare professional.
              </p>
            </div>
          </div>
        </div>

        <div class="chat-input-widget-container">
          <div class="input-wrapper-widget">
            <input type="text" id="chat-input-widget" placeholder="Describe symptoms..." class="chat-input-widget" disabled>
            <button id="chat-send-btn-widget" class="chat-send-btn-widget" disabled>
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <div id="loading-spinner-widget" class="loading-spinner-widget" style="display: none;">
            <div class="spinner-widget"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Add CSS
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #floating-chatbot-container {
        position: fixed;
        bottom: 120px;
        right: 20px;
        z-index: 9999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .chat-toggle-btn {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        position: relative;
      }

      .chat-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .chat-toggle-btn:active {
        transform: scale(0.95);
      }

      .chat-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff4444;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        border: 2px solid white;
      }

      .chat-window-widget {
        position: absolute;
        bottom: 110px;
        right: 0;
        width: 450px;
        max-height: 700px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
      }

      .chat-window-widget.active {
        display: flex;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .chat-header-widget {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-title-widget {
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .chat-close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
      }

      .chat-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .chat-messages-widget {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        background: #f8f9fa;
        min-height: 300px;
        max-height: 480px;
        scroll-behavior: smooth;
      }

      .chat-messages-widget::-webkit-scrollbar {
        width: 6px;
      }

      .chat-messages-widget::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .chat-messages-widget::-webkit-scrollbar-thumb {
        background: #667eea;
        border-radius: 3px;
      }

      .chat-message-widget {
        margin-bottom: 1rem;
        display: flex;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .bot-message-widget {
        justify-content: flex-start;
      }

      .user-message-widget {
        justify-content: flex-end;
      }

      .message-content-widget {
        max-width: 85%;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        word-wrap: break-word;
        font-size: 0.95rem;
        line-height: 1.4;
      }

      .bot-message-widget .message-content-widget {
        background: #e9ecef;
        color: #333;
      }

      .user-message-widget .message-content-widget {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .chat-input-widget-container {
        padding: 1rem;
        background: white;
        border-top: 1px solid #e0e0e0;
      }

      .input-wrapper-widget {
        display: flex;
        gap: 0.5rem;
      }

      .chat-input-widget {
        flex: 1;
        padding: 0.6rem 0.85rem;
        border: 2px solid #e0e0e0;
        border-radius: 20px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }

      .chat-input-widget:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
      }

      .chat-input-widget:disabled {
        background-color: #f0f0f0;
        opacity: 0.6;
      }

      .chat-send-btn-widget {
        padding: 0.6rem 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }

      .chat-send-btn-widget:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .chat-send-btn-widget:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .loading-spinner-widget {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        color: #667eea;
      }

      .spinner-widget {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Responsive */
      @media (max-width: 480px) {
        .chat-window-widget {
          width: 100%;
          max-width: calc(100vw - 20px);
          height: 80vh;
          max-height: 80vh;
          bottom: 0;
          right: 10px;
          border-radius: 12px 12px 0 0;
        }

        #floating-chatbot-container {
          bottom: 10px;
          right: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupEventListeners() {
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('chat-send-btn-widget');
    const input = document.getElementById('chat-input-widget');
    const chatWindow = document.getElementById('chat-window-widget');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Enable input after a short delay
    setTimeout(() => {
      input.disabled = false;
      sendBtn.disabled = false;
    }, 500);
  }

  toggleChat() {
    const chatWindow = document.getElementById('chat-window-widget');
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      chatWindow.classList.add('active');
      document.getElementById('chat-input-widget').focus();
    } else {
      chatWindow.classList.remove('active');
    }
  }

  closeChat() {
    const chatWindow = document.getElementById('chat-window-widget');
    this.isOpen = false;
    chatWindow.classList.remove('active');
  }

  async sendMessage() {
    const input = document.getElementById('chat-input-widget');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';
    input.disabled = true;
    document.getElementById('chat-send-btn-widget').disabled = true;

    // Show loading
    const spinner = document.getElementById('loading-spinner-widget');
    spinner.style.display = 'flex';

    try {
      const response = await this.callGeminiAPI(message);
      this.addMessage(response, 'bot');
    } catch (error) {
      this.addMessage(`Error: ${error.message}. Please try again.`, 'bot');
    } finally {
      spinner.style.display = 'none';
      input.disabled = false;
      document.getElementById('chat-send-btn-widget').disabled = false;
      input.focus();
    }
  }

  async callGeminiAPI(userMessage) {
    const GEMINI_API_KEY = 'AIzaSyAGtP4Z_1D74HyReAnBaBKLU3g82yBhuh8';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    const SYSTEM_PROMPT = `You are MediMate, an AI health assistant. Provide educational health insights only (not medical diagnosis). Keep responses concise for a chat widget. Always include: 1) Possible conditions, 2) General care recommendations, 3) When to see a doctor.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API Error');
    }

    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('No response');
  }

  addMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages-widget');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message-widget', `${sender}-message-widget`);

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content-widget');

    if (sender === 'user') {
      contentElement.innerHTML = `<p>${message}</p>`;
    } else {
      contentElement.innerHTML = `<p><strong>MediMate:</strong></p><div>${message.replace(/\n/g, '<br>')}</div>`;
    }

    messageElement.appendChild(contentElement);
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FloatingChatbot();
  });
} else {
  new FloatingChatbot();
}
