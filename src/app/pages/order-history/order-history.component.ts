import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../pipes/currency.pipe';
import { OrderService } from '../../services/order.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { Order, Product } from '../../models/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, CustomCurrencyPipe, LoadingSpinnerComponent],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        // map dữ liệu từ API sang format của Order
        this.orders = orders.map(order => ({
          customerName: order.customerName,
          customerAddress: order.customerAddress,
          customerPhone: order.customerPhone,
          email: order.email || null, // API chưa có email, để null
          items: order.items.filter(item => item.product != null),
          totalPrice: order.totalPrice,
          orderDate: order.orderDate
        })).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.error = 'Lỗi khi tải lịch sử đơn hàng: ' + err.message;
        this.isLoading = false;
      }
    });
  }
}
