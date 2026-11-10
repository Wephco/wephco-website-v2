export interface IPropertyAgent {
  name: string;
  email: string;
  phone: string;
}

export interface IPropertyUnit {
  bedroom: string | number;
  bathroom: string | number;
  square_foot: string | number;
}

export interface IProperty {
  id?: string;
  title: string;
  developer: string;
  location: string;
  price: number;
  yieldValue?: number;
  status: 'Available' | 'Under Offer' | 'Sold';
  description: string;
  images: string[];
  currency: 'USD' | 'NGN';
  tag: 'Local' | 'International';
  pdfUrl: string | null;
  category: 'Rent' | 'Lease' | 'Sale';
  bedroom: string | number | (string | number)[];
  bathroom: string | number | (string | number)[];
  square_foot: string | number | (string | number)[];
  units?: IPropertyUnit[];
  verified: boolean;
  featured?: boolean | null;
  agent?: IPropertyAgent | null;
  interests: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface ISellEnquiry {
  id?: string;
  address: string;
  name: string;
  email: string;
  status: boolean;
  phone: string;
  timeline: string;
  createdAt?: Date;
}

export interface IPropertyEnquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  property?: IProperty;
  propertyId: string;
  createdAt?: Date;
}