// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAGtP4Z_1D74HyReAnBaBKLU3g82yBhuh8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// DOM Elements
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// System prompt for healthcare context
const SYSTEM_PROMPT = `You are MediMate, an AI health assistant created to provide educational health insights. 

IMPORTANT RULES:
1. Always start with a disclaimer that you provide educational insights only and not professional medical advice
2. Analyze symptoms provided and suggest possible conditions (NOT a diagnosis)
3. Provide general wellness advice and suggest when to see a doctor
4. Keep responses clear, organized, and easy to understand
5. Use bullet points for multiple conditions or recommendations
6. Never prescribe medications
7. Always encourage users to consult healthcare professionals for proper diagnosis
8. Be empathetic and supportive in your responses
9. If the user asks about non-health topics, politely redirect to health-related queries

Format your responses clearly with:
- Possible conditions (if applicable)
- General care recommendations
- When to seek professional help`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  userInput.disabled = false;
  sendBtn.disabled = false;
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// Send message function
async function sendMessage() {
  const message = userInput.value.trim();
  
  if (!message) return;

  // Add user message to chat
  addMessageToChat(message, 'user');
  
  // Clear input
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;
  
  // Show loading spinner
  loadingSpinner.style.display = 'flex';

  try {
    // Call Gemini API
    const response = await callGeminiAPI(message);
    
    // Add bot response to chat
    addMessageToChat(response, 'bot');
  } catch (error) {
    console.error('Error:', error);
    addMessageToChat(
      `Sorry, I encountered an error: ${error.message}. Please try again.`,
      'bot'
    );
  } finally {
    // Hide loading spinner
    loadingSpinner.style.display = 'none';
    
    // Re-enable input
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// Call Gemini API
async function callGeminiAPI(userMessage) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nUser query: ${userMessage}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    
    // Extract text from response
    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        return content.parts[0].text;
      }
    }
    
    throw new Error('No response from API');
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// Add message to chat
function addMessageToChat(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', `${sender}-message`);
  
  const contentElement = document.createElement('div');
  contentElement.classList.add('message-content');
  
  // Parse markdown-like formatting
  let formattedMessage = message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  
  // Format bullet points
  if (formattedMessage.includes('-') || formattedMessage.includes('•')) {
    formattedMessage = formattedMessage.replace(/^[-•]\s+/gm, '<li>');
    formattedMessage = '<ul style="margin: 0.5rem 0; padding-left: 1.5rem;">' + formattedMessage.replace(/(<li>.*?)<br>/g, '$1</li><br>') + '</ul>';
  }
  
  if (sender === 'user') {
    contentElement.innerHTML = `<p>${formattedMessage}</p>`;
  } else {
    contentElement.innerHTML = `<p><strong>MediMate:</strong></p><div>${formattedMessage}</div>`;
  }
  
  messageElement.appendChild(contentElement);
  chatWindow.appendChild(messageElement);
  
  // Auto scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Optional: Clear chat history
function clearChat() {
  chatWindow.innerHTML = '';
  const initialMessage = document.createElement('div');
  initialMessage.classList.add('chat-message', 'bot-message');
  initialMessage.innerHTML = `
    <div class="message-content">
      <p><strong>MediMate:</strong> Hello! I'm your AI health assistant. Describe your symptoms, and I'll provide insights to help you understand your condition better.</p>
      <p style="font-size: 0.9em; margin-top: 10px; color: #666;">
        <i class="fa-solid fa-exclamation-circle"></i> Disclaimer: I provide educational insights only. Always consult a healthcare professional for proper diagnosis.
      </p>
    </div>
  `;
  chatWindow.appendChild(initialMessage);
}
