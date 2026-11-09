export type TaxonomyId = 
  | 'flowers'
  | 'foliage-herbs'
  | 'indoors-succulents'
  | 'fruit-plants';

export interface TaxonomyCategory {
  id: TaxonomyId;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  count: number;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  scientificName?: string;
  category: TaxonomyId;
  categoryName: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  inStock: boolean;
  stockCount?: number;
  tags: string[];
  light?: 'Direct Sunlight' | 'Bright Indirect' | 'Medium Light' | 'Low Light';
  maintenance?: 'Low' | 'Moderate' | 'High';
  environment?: 'Indoor' | 'Outdoor' | 'Balcony/Patio' | 'Both';
  petFriendly?: boolean;
  purpose?: 'Air Purifier' | 'Flowering Bloom' | 'Edible/Herb' | 'Lush Foliage' | 'Soil Health' | 'Tool/Care';
  featured?: boolean;
  dimensions?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  potVariant?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface MatchmakerAnswers {
  light: string;
  maintenance: string;
  environment: string;
  petSafe: string;
  purpose: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  items: { product: Product; quantity: number }[];
  subtotal: number;
  delivery: number;
  total: number;
  date: string;
  dispatchMethod: 'WhatsApp' | 'Email';
  status: OrderStatus;
}
