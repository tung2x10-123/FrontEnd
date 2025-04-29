export interface Product {
  name: string;
  price: number;
  category: { name: string };
}

export interface Order {
  customerName: string | null; // khớp với API
  customerAddress: string | null;
  customerPhone: string | null;
  email: string | null;
  items: { product: Product | null; quantity: number }[];
  totalPrice: number; // khớp với API
  orderDate: string; // khớp với API
}
