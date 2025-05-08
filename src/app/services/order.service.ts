import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Order } from '../models/order'; // Import interface Order
import { environment } from '../environment'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // private apiUrl = 'http://localhost:8080/api'; // Thay bằng URL backend thật
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createOrder(order: {
    customerName: string | null;
    customerAddress: string | null;
    customerPhone: string | null;
    email: string | null;
    orderDate: string;
    totalPrice: number;
    items: { productId: number; quantity: number }[]
  }): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/orders`, order, { headers });
  }

  getOrders(): Observable<Order[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { headers });
  }
}
