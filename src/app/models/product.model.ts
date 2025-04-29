export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  material?: string; // thêm chất liệu
  stock?: number; // thêm số lượng tồn
  selectedSize?: string; // thêm khi vào giỏ hàng
  selectedColor?: string; // thêm khi vào giỏ hàng
  quantity?: number; // thêm khi vào giỏ hàng
}

export interface Category {
  id: number;
  name: string;
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}
