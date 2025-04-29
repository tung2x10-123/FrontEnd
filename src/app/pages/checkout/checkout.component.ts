import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CustomCurrencyPipe } from '../../pipes/currency.pipe';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomCurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: { product: any; quantity: number }[] = [];
  total: number = 0;
  checkoutForm = {
    name: '',
    address: '',
    phone: '',
    email: ''
  };
  isSubmitting = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.checkoutForm.name = currentUser.username;
      this.checkoutForm.email = currentUser.email;
    }
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  submitCheckout(): void {
    if (!this.checkoutForm.name || !this.checkoutForm.address || !this.checkoutForm.phone || !this.checkoutForm.email) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin!', 'Lỗi');
      return;
    }

    this.isSubmitting = true;
    const order: Order = {
      customerName: this.checkoutForm.name, // map đúng field
      customerAddress: this.checkoutForm.address,
      customerPhone: this.checkoutForm.phone,
      email: this.checkoutForm.email,
      items: this.cartItems,
      totalPrice: this.total, // map đúng field
      orderDate: new Date().toISOString() // map đúng field
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.toastr.success('Thanh toán thành công!', 'Thành công');
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastr.error('Lỗi khi gửi đơn hàng: ' + err.message, 'Lỗi');
        this.isSubmitting = false;
        console.error('Lỗi trong CheckoutComponent:', err);
      }
    });
  }
}
