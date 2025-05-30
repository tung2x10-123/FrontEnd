import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import { Product } from '../../models/product.model';
import { CustomCurrencyPipe } from '../../pipes/currency.pipe';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
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
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;
  relatedProducts: Product[] = [];
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  colors: string[] = ['Trắng', 'Đen', 'Xanh', 'Đỏ'];
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private seoService: SeoService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(+productId);
      } else {
        this.error = 'Không tìm thấy sản phẩm';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.product = null;
    this.relatedProducts = [];
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        console.log('Sản phẩm từ API:', product);
        console.log('Category:', product.category);
        if (product && product.category && product.category.name && product.category.id) {
          this.seoService.setTitle(`${product.name} - ToxicFitShop`);
          this.seoService.setMetaDescription(product.description);
          this.seoService.setMetaKeywords(`${product.name}, ${product.category.name}, ToxicFitShop`);
          this.selectedSize = this.sizes[0];
          this.selectedColor = this.colors[0];
          this.loadRelatedProducts(product.category.id);
        } else {
          this.error = 'Sản phẩm không có thông tin category hợp lệ';
          console.error('Product category is missing or invalid:', product);
        }
      },
      error: (err) => {
        this.error = `Lỗi khi tải sản phẩm: ${err.message}`;
        this.isLoading = false;
        console.error('Lỗi trong ProductDetailComponent:', err);
      },
    });
  }

  loadRelatedProducts(categoryId: number): void {
    console.log('Category ID:', categoryId);
    console.log('Product ID hiện tại:', this.product?.id);
    if (categoryId) {
      this.productService.getProducts(1, 10, undefined, categoryId).subscribe({
        next: (products) => {
          console.log('Danh sách sản phẩm từ API:', products);
          if (products && products.length > 0) {
            this.relatedProducts = products
              .filter((p) => p.id !== this.product?.id)
              .slice(0, 4);
            console.log('Sản phẩm liên quan sau filter:', this.relatedProducts);
          } else {
            this.relatedProducts = [];
            console.log('Không có sản phẩm nào từ API');
          }
        },
        error: (err) => {
          console.error('Lỗi khi tải sản phẩm liên quan:', err);
          this.relatedProducts = [];
        },
      });
    } else {
      console.error('Category ID is undefined');
      this.relatedProducts = [];
    }
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
}
