import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink], // Bỏ FormsModule vì không còn dùng ngModel
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  removeFromCart(item: CartItem): void {
    if (item.product) {
      this.cartService.removeFromCart(item.product);
      this.cartItems = this.cartService.getCartItems();
      this.toastr.success(`${item.product.name} đã được xóa khỏi giỏ hàng!`, 'Thành công');
    } else {
      this.toastr.error('Không thể xóa sản phẩm, dữ liệu không hợp lệ!', 'Lỗi');
    }
  }

  increaseQuantity(item: CartItem): void {
    if (item.product) {
      this.cartService.updateQuantity(item.product, item.quantity + 1);
      this.cartItems = this.cartService.getCartItems();
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1 && item.product) {
      this.cartService.updateQuantity(item.product, item.quantity - 1);
      this.cartItems = this.cartService.getCartItems();
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
