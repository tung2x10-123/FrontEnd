import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CustomCurrencyPipe } from '../../pipes/currency.pipe';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomCurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  total: number = 0;
  checkoutForm = {
    name: '',
    address: '',
    phone: '',
    email: ''
  };
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItemsObservable().pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.loadCartItems(items);
      this.calculateTotal();
    });

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.checkoutForm.name = currentUser.username || '';
      this.checkoutForm.email = currentUser.email || '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCartItems(items: CartItem[]): void {
    this.cartItems = items.filter(item => {
      const isValid = item && item.product &&
        item.product.name &&
        typeof item.product.price === 'number';
      // không kiểm tra id vì Product mới không có id
      if (!isValid) {
        console.warn('Item không hợp lệ trong Checkout:', item);
      }
      return isValid;
    });
    console.log('Filtered cart items:', this.cartItems); // log để debug
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);
    console.log('Total calculated:', this.total); // log để debug
  }

  submitCheckout(): void {
    if (!this.checkoutForm.name || !this.checkoutForm.address || !this.checkoutForm.phone || !this.checkoutForm.email) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin!', 'Lỗi');
      return;
    }

    this.isSubmitting = true;
    const validItems = this.cartItems.filter(item =>
      item && item.product &&
      item.product.name &&
      typeof item.product.price === 'number'
    );

    if (validItems.length === 0) {
      this.toastr.error('Giỏ hàng trống hoặc không hợp lệ!', 'Lỗi');
      this.isSubmitting = false;
      return;
    }

    const order: Order = {
      customerName: this.checkoutForm.name,
      customerAddress: this.checkoutForm.address,
      customerPhone: this.checkoutForm.phone,
      email: this.checkoutForm.email,
      orderDate: new Date().toISOString(),
      totalPrice: this.total,
      items: validItems.map(item => ({
        product: {
          name: item.product.name,
          price: item.product.price,
          category: item.product.category || { name: 'Không có danh mục' }
        },
        quantity: item.quantity
      }))
    };

    const orderForApi = {
      customerName: order.customerName,
      customerAddress: order.customerAddress,
      customerPhone: order.customerPhone,
      email: order.email,
      orderDate: order.orderDate,
      totalPrice: order.totalPrice,
      items: validItems.map(item => ({
        productId: item.product.id || 0, // fallback nếu không có id
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderForApi).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.toastr.success('Thanh toán thành công!', 'Thành công');
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Không thể kết nối đến server';
        this.toastr.error('Lỗi khi gửi đơn hàng: ' + errorMessage, 'Lỗi');
        this.isSubmitting = false;
        console.error('Lỗi trong CheckoutComponent:', err);
      }
    });
  }
}
