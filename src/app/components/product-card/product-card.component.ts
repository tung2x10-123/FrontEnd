import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../pipes/currency.pipe';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CustomCurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  isInWishlist: boolean = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // kiểm tra xem sản phẩm có trong wishlist không
    this.wishlistService.getWishlist().subscribe(wishlist => {
      this.isInWishlist = wishlist.some(item => item.id === this.product.id);
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastr.success(`${product.name} đã được thêm vào giỏ hàng!`, 'Thành công');
  }

  toggleWishlist(product: Product) {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(product.id);
      this.toastr.success(`${product.name} đã được xóa khỏi danh sách yêu thích!`, 'Thành công');
    } else {
      const added = this.wishlistService.addToWishlist(product);
      if (added) {
        this.toastr.success(`${product.name} đã được thêm vào danh sách yêu thích!`, 'Thành công');
      } else {
        this.toastr.info(`${product.name} đã có trong danh sách yêu thích!`, 'Thông báo');
      }
    }
    this.isInWishlist = !this.isInWishlist;
  }

  onImageError(event: Event): void {
    console.error('Lỗi tải hình ảnh:', this.product.imageUrl);
    (event.target as HTMLImageElement).style.display = 'none'; // ẩn thẻ img nếu lỗi
  }
}
