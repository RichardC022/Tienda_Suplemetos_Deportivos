import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../core/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Boton flotante -->
    <button class="chatbot-fab" (click)="toggleChat()" [class.active]="isOpen">
      {{ isOpen ? '\u2715' : '\uD83D\uDCAC' }}
    </button>

    <!-- Panel de chat -->
    @if (isOpen) {
      <div class="chatbot-panel">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">AI</div>
            <div>
              <strong>SysSupplements</strong>
              <small>Asistente de soporte</small>
            </div>
          </div>
          <button class="chatbot-close" (click)="toggleChat()">\u2715</button>
        </div>

        <!-- Mensajes -->
        <div class="chatbot-messages" #messagesContainer>
          @for (msg of messages; track $index) {
            <div class="chatbot-msg" [class.user]="msg.sender === 'user'" [class.bot]="msg.sender === 'bot'">
              @if (msg.sender === 'bot') {
                <div class="chatbot-msg-avatar">AI</div>
              }
              <div class="chatbot-msg-bubble">
                <div [innerHTML]="msg.text"></div>
                @if (msg.sources && msg.sources.length > 0) {
                  <div class="chatbot-sources">
                    <small>Fuentes:</small>
                    @for (s of msg.sources; track $index) {
                      <span class="chatbot-source-chip">{{ s.source }}</span>
                    }
                  </div>
                }
              </div>
            </div>
          }
          @if (loading) {
            <div class="chatbot-msg bot">
              <div class="chatbot-msg-avatar">AI</div>
              <div class="chatbot-msg-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          }
        </div>

        <!-- Input -->
        <form class="chatbot-input" (ngSubmit)="sendMessage()">
          <input
            type="text"
            [(ngModel)]="inputText"
            name="chatInput"
            placeholder="Escribe tu pregunta..."
            [disabled]="loading"
            autocomplete="off"
          />
          <button type="submit" [disabled]="loading || !inputText.trim()">
            &#10148;
          </button>
        </form>
      </div>
    }
  `,
  styles: [`
    :host {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Boton flotante */
    .chatbot-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      border: none;
      font-size: 26px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
      z-index: 9999;
      transition: transform 0.2s, background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chatbot-fab:hover {
      transform: scale(1.08);
      background: #1d4ed8;
    }
    .chatbot-fab.active {
      background: #dc2626;
      box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4);
    }

    /* Panel */
    .chatbot-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 400px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 140px);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      z-index: 9998;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      animation: slideUp 0.25s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .chatbot-header {
      background: #2563eb;
      color: white;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chatbot-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chatbot-header-info strong {
      font-size: 15px;
      display: block;
    }
    .chatbot-header-info small {
      opacity: 0.8;
      font-size: 12px;
    }
    .chatbot-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }
    .chatbot-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .chatbot-close:hover { background: rgba(255,255,255,0.15); }

    /* Mensajes */
    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chatbot-msg {
      display: flex;
      gap: 8px;
      max-width: 88%;
    }
    .chatbot-msg.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .chatbot-msg-avatar {
      width: 28px;
      height: 28px;
      min-width: 28px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      margin-top: 2px;
    }
    .chatbot-msg-bubble {
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.45;
      word-break: break-word;
    }
    .chatbot-msg.bot .chatbot-msg-bubble {
      background: #f3f4f6;
      color: #111;
      border-bottom-left-radius: 4px;
    }
    .chatbot-msg.user .chatbot-msg-bubble {
      background: #2563eb;
      color: white;
      border-bottom-right-radius: 4px;
    }
    .chatbot-sources {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }
    .chatbot-sources small {
      color: #6b7280;
      font-size: 11px;
    }
    .chatbot-source-chip {
      background: #e5e7eb;
      color: #374151;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
    }

    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 18px !important;
    }
    .typing-indicator span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #9ca3af;
      animation: bounce 1.2s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    /* Input */
    .chatbot-input {
      display: flex;
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      gap: 8px;
      background: white;
    }
    .chatbot-input input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .chatbot-input input:focus {
      border-color: #2563eb;
    }
    .chatbot-input button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #2563eb;
      color: white;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .chatbot-input button:disabled {
      background: #93c5fd;
      cursor: not-allowed;
    }
    .chatbot-input button:not(:disabled):hover {
      background: #1d4ed8;
    }

    /* Scrollbar */
    .chatbot-messages::-webkit-scrollbar { width: 5px; }
    .chatbot-messages::-webkit-scrollbar-track { background: transparent; }
    .chatbot-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }

    @media (max-width: 480px) {
      .chatbot-panel {
        right: 8px;
        bottom: 88px;
        width: calc(100vw - 16px);
        height: calc(100vh - 120px);
        border-radius: 12px;
      }
      .chatbot-fab { bottom: 16px; right: 16px; width: 52px; height: 52px; font-size: 22px; }
    }
  `]
})
export class ChatbotComponent {
  isOpen = false;
  inputText = '';
  loading = false;
  messages: ChatMessage[] = [
    {
      sender: 'bot',
      text: 'Hola! Soy el asistente de <strong>SysSupplementsGym</strong>. Puedo ayudarte con dudas sobre compras, envios, devoluciones y mas. <br>&iquest;En que puedo ayudarte?'
    }
  ];

  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.messages.push({ sender: 'user', text });
    this.inputText = '';
    this.loading = true;

    this.chatbotService.sendMessage(text).subscribe({
      next: (res) => {
        this.messages.push({
          sender: 'bot',
          text: this.formatAnswer(res.answer),
          sources: res.sources
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.messages.push({
          sender: 'bot',
          text: 'Lo siento, hubo un error al procesar tu pregunta. Intenta de nuevo.'
        });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private formatAnswer(raw: string): string {
    // Convertir saltos de linea simples a <br>
    return raw
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
