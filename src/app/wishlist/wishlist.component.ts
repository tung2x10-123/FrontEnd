import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../services/wishlist.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];

  constructor(private toastr: ToastrService, private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe(wishlist => {
      this.wishlist = wishlist;
      console.log('Wishlist data:', this.wishlist); // log để kiểm tra dữ liệu
    });
  }

  addToCart(product: any): void {
    console.log(`Added ${product.name} to cart`);
    this.toastr.success(`${product.name} đã được thêm vào giỏ hàng!`, 'Thành công');
  }

  removeFromWishlist(product: any): void {
    this.wishlistService.removeFromWishlist(product.id);
    this.toastr.success(`${product.name} đã được xóa khỏi danh sách yêu thích!`, 'Thành công');
  }
}
