export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  category: string;
  imageUrl?: string;
  image?: string; // Maintained for compatibility if needed, but backend uses imageUrl
  benefits?: string[];
  usage?: string;
  medicalAdvice?: string;
  agricultureAdvice?: string;
  wateringAdvice?: string;
  availableStock: number;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingZone {
  id: string;
  governorate: string;
  areas: string[];
  shippingCost: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  governorate: string;
  area: string;
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  paymentMethod: 'cash' | 'vodafone';
  vodafoneNumber?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  productId?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
}
