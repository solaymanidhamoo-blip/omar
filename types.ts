
export enum Language {
  AR = 'ar',
  FR = 'fr',
  EN = 'en'
}

export interface Product {
  id: string;
  nameKey: string;
  descKey: string;
  price: number;
  image: string;
  category: 'oil' | 'food' | 'honey' | 'amlou' | 'other';
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  groundingUrls?: { uri: string; title: string }[];
}

export type ManagerTab = 'analytics' | 'pricing' | 'orders' | 'marketing' | 'advisor' | 'settings';

export interface BusinessMetric {
  label: string;
  value: string;
  trend: string;
}

export interface Order {
  id: string;
  customer: string;
  phone?: string;
  city?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: string;
}

export interface Promotion {
  isActive: boolean;
  discount: number;
  code: string;
  message: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  image?: string;
  date: string;
}
