import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import { Product, Review } from '../../models/product.model';
import { CustomCurrencyPipe } from '../../pipes/currency.pipe';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyPipe,
    FormsModule,
    SkeletonLoaderComponent,
    ProductCardComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(20px)' })),
      ]),
    ]),
  ],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;
  reviews: Review[] = [];
  relatedProducts: Product[] = [];
  newReview: Review = {
    user: '',
    rating: 5,
    comment: '',
    date: new Date().toISOString(),
  };
  isSubmittingReview = false;
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  colors: string[] = ['Trắng', 'Đen', 'Xanh', 'Đỏ'];
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private seoService: SeoService,
    private cartService: CartService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(+productId);
      this.loadReviews(+productId);
    } else {
      this.error = 'Không tìm thấy sản phẩm';
      this.isLoading = false;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.newReview.user = currentUser.username;
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        console.log('Sản phẩm:', product);
        console.log('URL ảnh:', product.imageUrl);
        this.seoService.setTitle(`${product.name} - ToxicFitShop`);
        this.seoService.setMetaDescription(product.description);
        this.seoService.setMetaKeywords(`${product.name}, ${product.category.name}, ToxicFitShop`);
        this.selectedSize = this.sizes[0];
        this.selectedColor = this.colors[0];
        this.loadRelatedProducts(product.category.id);
      },
      error: (err) => {
        this.error = `Lỗi khi tải sản phẩm: ${err.message}`;
        this.isLoading = false;
        console.error('Lỗi trong ProductDetailComponent:', err);
      },
    });
  }

  loadReviews(productId: number): void {
    this.productService.getReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        console.log('Đánh giá:', reviews);
      },
      error: (err) => {
        console.error('Lỗi khi tải đánh giá:', err);
        this.reviews = [];
      },
    });
  }

  loadRelatedProducts(categoryId: number): void {
    this.productService.getProducts(1, 10, undefined, categoryId).subscribe({
      next: (products) => {
        this.relatedProducts = products.filter((p) => p.id !== this.product?.id).slice(0, 4);
        console.log('Sản phẩm liên quan:', this.relatedProducts);
      },
      error: (err) => {
        console.error('Lỗi khi tải sản phẩm liên quan:', err);
        this.relatedProducts = [];
      },
    });
  }

  addToCart(product: Product): void {
    if (this.quantity > (product.stock || 10)) {
      this.toastr.error('Số lượng vượt quá tồn kho!', 'Lỗi');
      return;
    }
    const cartItem = {
      ...product,
      selectedSize: this.selectedSize,
      selectedColor: this.selectedColor,
      quantity: this.quantity,
    };
    this.cartService.addToCart(cartItem);
    this.toastr.success(`${product.name} đã được thêm vào giỏ hàng!`, 'Thành công');
  }

  onImageError(event: Event): void {
    console.error('Lỗi tải hình ảnh:', this.product?.imageUrl);
    (event.target as HTMLImageElement).style.display = 'none';
  }

  submitReview(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.error('Vui lòng đăng nhập để đánh giá!', 'Lỗi');
      return;
    }

    if (!this.newReview.comment || this.newReview.rating < 1 || this.newReview.rating > 5) {
      this.toastr.error('Vui lòng nhập đầy đủ thông tin và chọn đánh giá từ 1-5 sao!', 'Lỗi');
      return;
    }

    this.isSubmittingReview = true;
    const productId = this.product?.id;
    if (productId) {
      this.newReview.date = new Date().toISOString();
      this.productService.addReview(productId, this.newReview).subscribe({
        next: (review) => {
          this.reviews.push(review);
          this.newReview.comment = '';
          this.newReview.rating = 5;
          this.toastr.success('Đánh giá của bạn đã được gửi!', 'Thành công');
          this.isSubmittingReview = false;
        },
        error: (err) => {
          this.toastr.error('Lỗi khi gửi đánh giá: ' + err.message, 'Lỗi');
          this.isSubmittingReview = false;
        },
      });
    }
  }
}
