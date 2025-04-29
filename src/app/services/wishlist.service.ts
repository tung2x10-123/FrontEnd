import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: any[] = [];
  private wishlistSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    // load wishlist từ localStorage khi khởi tạo
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
      this.wishlistSubject.next(this.wishlist);
    }
  }

  // lấy danh sách yêu thích dưới dạng Observable
  getWishlist() {
    return this.wishlistSubject.asObservable();
  }

  // thêm sản phẩm vào wishlist
  addToWishlist(product: any) {
    if (!this.wishlist.find(item => item.id === product.id)) {
      this.wishlist.push(product);
      this.updateWishlist();
      return true;
    }
    return false;
  }

  // xóa sản phẩm khỏi wishlist
  removeFromWishlist(productId: number) {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    this.updateWishlist();
  }

  // cập nhật wishlist và lưu vào localStorage
  private updateWishlist() {
    this.wishlistSubject.next(this.wishlist);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }
}
