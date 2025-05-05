import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  // private apiUrl = 'http://localhost:8080/api/chatbot/message';
  private apiUrl = environment.apiUrl + "/chatbot/message";
  constructor(private http: HttpClient) {}

  sendMessage(chatId: string, message: string): Observable<string> {
    const body = { chatId, message };
    return this.http.post(this.apiUrl, body, { responseType: 'json' }).pipe(
      map((response: any) => {
        if (response.reply) {
          return response.reply;
        }
        throw new Error('No reply from chatbot');
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse | Error) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Failed to send message to chatbot; please try again later.'));
  }
}
