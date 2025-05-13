import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product, Category} from '../models/product.model';
import { AuthService } from './auth.service';
import { environment } from '../environment'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // private apiUrl = 'http://localhost:8080/api'; // Thay bằng URL backend thật
  private apiUrl = environment.apiUrl;
  private productsCache: { [key: string]: Product[] } = {};
  private categoriesCache: Category[] | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProducts(
    page: number = 1,
    size: number = 5,
    keyword?: string,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number
  ): Observable<Product[]> {
    let cacheKey = `page=${page}&size=${size}`;
    if (keyword) cacheKey += `&keyword=${keyword}`;
    if (categoryId) cacheKey += `&categoryId=${categoryId}`;
    if (minPrice) cacheKey += `&minPrice=${minPrice}`;
    if (maxPrice) cacheKey += `&maxPrice=${maxPrice}`;

    if (this.productsCache[cacheKey]) {
      return of(this.productsCache[cacheKey]);
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (keyword) params = params.set('keyword', keyword);
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(
      tap(products => {
        this.productsCache[cacheKey] = products;
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    if (this.categoriesCache) {
      return of(this.categoriesCache);
    }
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      tap(categories => {
        this.categoriesCache = categories;
      })
    );
  }

  clearCache(): void {
    this.productsCache = {};
    this.categoriesCache = null;
  }
}
