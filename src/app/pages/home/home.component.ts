// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductService } from '../../services/product.service';
// import { SeoService } from '../../services/seo.service';
// import { Product, Category } from '../../models/product.model';
// import { ProductCardComponent } from '../../components/product-card/product-card.component';
// import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
// import { trigger, transition, style, animate } from '@angular/animations';
//
// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ProductCardComponent, SkeletonLoaderComponent],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
//   animations: [
//     trigger('fadeInOut', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(20px)' }),
//         animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
//       ]),
//       transition(':leave', [
//         animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(20px)' }))
//       ])
//     ])
//   ]
// })
// export class HomeComponent implements OnInit {
//   products: Product[] = [];
//   filteredProducts: Product[] = [];
//   categories: Category[] = [];
//   isLoading = true;
//   error: string | null = null;
//   searchTerm: string = '';
//   selectedCategory: number | null = null;
//   minPrice: number | null = null;
//   maxPrice: number | null = null;
//   currentPage: number = 1;
//   pageSize: number = 6; // 4 sản phẩm mỗi trang
//   totalPages: number = 1; // mặc định 1
//   sortBy: string = 'name';
//   sortOrder: 'asc' | 'desc' = 'asc';
//
//   constructor(
//     private productService: ProductService,
//     private seoService: SeoService
//   ) {}
//
//   ngOnInit(): void {
//     this.seoService.setTitle('ToxicFitShop - Mua sắm trực tuyến');
//     this.seoService.setMetaDescription('Mua sắm trực tuyến với ToxicFitShop - Sản phẩm đa dạng, giá cả hợp lý.');
//     this.seoService.setMetaKeywords('mua sắm, trực tuyến, sản phẩm, ToxicFitShop');
//
//     this.loadCategories();
//     this.loadProducts();
//   }
//
//   loadCategories(): void {
//     this.productService.getCategories().subscribe({
//       next: (categories) => {
//         this.categories = categories;
//         console.log('Danh mục:', categories);
//       },
//       error: (err) => {
//         console.error('Lỗi khi tải danh mục:', err);
//       }
//     });
//   }
//
//   loadProducts(): void {
//     this.isLoading = true;
//     this.productService
//       .getProducts(
//         this.currentPage,
//         this.pageSize,
//         this.searchTerm,
//         this.selectedCategory || undefined,
//         this.minPrice || undefined,
//         this.maxPrice || undefined
//       )
//       .subscribe({
//         next: (products) => {
//           // tính chỉ số bắt đầu và kết thúc cho trang hiện tại
//           const startIndex = (this.currentPage - 1) * this.pageSize;
//           const endIndex = startIndex + this.pageSize;
//           // cắt danh sách sản phẩm theo trang
//           this.products = products.slice(startIndex, endIndex);
//           this.filteredProducts = this.products;
//           // tính totalPages dựa trên tổng số sản phẩm
//           this.totalPages = Math.max(1, Math.ceil(products.length / this.pageSize));
//           console.log('Sản phẩm gốc:', products);
//           console.log('Sản phẩm trang ' + this.currentPage + ':', this.products);
//           console.log('Tổng sản phẩm:', products.length);
//           console.log('Tổng trang:', this.totalPages);
//           this.isLoading = false;
//           this.filterProducts();
//         },
//         error: (err) => {
//           this.error = `Lỗi khi tải sản phẩm: ${err.message}`;
//           this.isLoading = false;
//           console.error('Lỗi trong HomeComponent:', err);
//         }
//       });
//   }
//
//   filterProducts(): void {
//     let filtered = [...this.products];
//
//     filtered.sort((a, b) => {
//       let comparison = 0;
//       if (this.sortBy === 'name') {
//         comparison = a.name.localeCompare(b.name);
//       } else if (this.sortBy === 'price') {
//         comparison = a.price - b.price;
//       }
//       return this.sortOrder === 'asc' ? comparison : -comparison;
//     });
//
//     this.filteredProducts = filtered;
//     console.log('Sản phẩm sau filter:', this.filteredProducts);
//   }
//
//   onSearchChange(): void {
//     this.currentPage = 1;
//     this.productService.clearCache();
//     this.loadProducts();
//   }
//
//   onCategoryChange(): void {
//     this.currentPage = 1;
//     this.productService.clearCache();
//     this.loadProducts();
//   }
//
//   onPriceChange(): void {
//     this.currentPage = 1;
//     this.productService.clearCache();
//     this.loadProducts();
//   }
//
//   onSortChange(): void {
//     this.filterProducts();
//   }
//
//   goToPage(page: number): void {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.loadProducts();
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import { Product, Category } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, SkeletonLoaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  products: Product[] = []; // mảng đầy đủ từ backend
  filteredProducts: Product[] = []; // mảng sau lọc và phân trang
  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm: string = '';
  selectedCategory: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  sortBy: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private productService: ProductService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.setTitle('ToxicFitShop - Mua sắm trực tuyến');
    this.seoService.setMetaDescription('Mua sắm trực tuyến với ToxicFitShop - Sản phẩm đa dạng, giá cả hợp lý.');
    this.seoService.setMetaKeywords('mua sắm, trực tuyến, sản phẩm, ToxicFitShop');

    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Danh mục:', categories);
      },
      error: (err) => {
        console.error('Lỗi khi tải danh mục:', err);
        this.error = 'Lỗi khi tải danh mục';
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService
      .getProducts(
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        this.selectedCategory || undefined,
        this.minPrice || undefined,
        this.maxPrice || undefined
      )
      .subscribe({
        next: (products) => {
          this.products = products || [];
          console.log('Sản phẩm gốc:', this.products);
          this.filterProducts(); // lọc và phân trang
          this.isLoading = false;
        },
        error: (err) => {
          this.error = `Lỗi khi tải sản phẩm: ${err.message}`;
          this.isLoading = false;
          console.error('Lỗi trong HomeComponent:', err);
        }
      });
  }

  filterProducts(): void {
    let filtered = [...this.products];

    // lọc theo searchTerm
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower));
    }

    // lọc theo minPrice và maxPrice
    if (this.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }

    // sắp xếp
    filtered.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (this.sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    // tính phân trang
    const totalFiltered = filtered.length;
    this.totalPages = Math.max(1, Math.ceil(totalFiltered / this.pageSize));
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // slice cho trang hiện tại
    this.filteredProducts = filtered.slice(startIndex, endIndex);

    // lỗi nếu rỗng
    if (this.filteredProducts.length === 0 && (this.selectedCategory || this.searchTerm || this.minPrice || this.maxPrice)) {
      this.error = 'Không tìm thấy sản phẩm phù hợp';
    } else if (this.filteredProducts.length === 0) {
      this.error = 'Không có sản phẩm nào';
    } else {
      this.error = null;
    }

    console.log('Sản phẩm sau lọc:', filtered);
    console.log('Sản phẩm trang ' + this.currentPage + ':', this.filteredProducts);
    console.log('Tổng sản phẩm sau lọc:', totalFiltered);
    console.log('Tổng trang:', this.totalPages);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.filterProducts(); // lọc lại trên dữ liệu hiện có
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.productService.clearCache();
    this.loadProducts(); // gọi API vì category thay đổi
  }

  onPriceChange(): void {
    this.currentPage = 1;
    this.filterProducts(); // lọc lại trên dữ liệu hiện có
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.filterProducts(); // lọc lại để sắp xếp
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterProducts(); // slice lại cho trang mới
    }
  }
}
