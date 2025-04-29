import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  chatId: string = '123456789';
  messages: { sender: string, text: string }[] = [];
  newMessage: string = '';
  errorMessage: string = '';
  isChatVisible: boolean = true; // mặc định hiển thị chatbot

  constructor(private chatbotService: ChatbotService) {
    this.messages.push({ sender: 'bot', text: 'Chào bạn! Mình là chatbot của shop. Bạn cần giúp gì nha? 😊' });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }

    this.messages.push({ sender: 'user', text: this.newMessage });

    this.chatbotService.sendMessage(this.chatId, this.newMessage).subscribe({
      next: (reply) => {
        this.messages.push({ sender: 'bot', text: reply });
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to get response from chatbot. Please try again.';
        console.error(error);
      }
    });

    this.newMessage = '';
  }

  toggleChat(): void {
    this.isChatVisible = !this.isChatVisible;
  }
}
