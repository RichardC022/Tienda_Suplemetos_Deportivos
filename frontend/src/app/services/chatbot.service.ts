import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  sources?: ChatSource[];
}

export interface ChatSource {
  source: string | null;
  page: number | null;
  snippet: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly CHAT_URL = '/chatbot/chat';

  constructor(private http: HttpClient) {}

  sendMessage(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.CHAT_URL, { question });
  }
}
