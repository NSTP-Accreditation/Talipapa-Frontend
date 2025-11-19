export interface RecordInterface {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  age: string;
  address: string;
  contact_number: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInterface {
  _id: string;
  name: string;
  image?: ImageInterface;
  category?: string;
  subCategory?: string;
  description?: string;
  stocks?: number;
  requiredPoints?: number;
}

export interface MaterialInterface {
  _id: string;
  name: string;
  image?: ImageInterface;
  description: string;
  pointsPerKg: number;
  createdAt: string;
}

export interface FarmItemInterface {
  _id: string;
  name: string;
  description: string;
  mainCategory: 'Agricultural';
  subCategory:
    | 'Vegetables'
    | 'Herbal Plants'
    | 'Fruits'
    | 'Seedlings'
    | 'Trees';
  stocks: number;
  unit: 'kg' | 'pieces' | 'bundles' | 'sacks' | 'pots';
  image: ImageInterface;
  farmOrigin?: string;
  lastRestocked?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImageInterface {
  key: string;
  mimetype: string;
  originalName: string;
  size: number;
  url: string;
}

export interface LogInterface {
  _id: string;
  action: string;
  title: string;
  description: string;
  category: string;
  performedBy?: any;
  details?: any;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  created_at: string;
}

export interface LogsApiResponse {
  success: boolean;
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: LogInterface[];
}
