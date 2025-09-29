export type Category = 
  | "Áo" 
  | "Quần" 
  | "Giày" 
  | "Túi"
  | "Phụ kiện"; 
export type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  color:string;
  images: string[];
  stock: number;
  rating?: string;
  brand?: string;
  size?:string;
  variants?: { color: string; size?: string }[];
  description?: string;
  category?: string;
};
export type MinProduct = {
  
    slug: string;
    title: string;
    size?:string;
    price: number;
    brand: string;
    rating: string;
    color:string;
    image?: string;
    stock?: number;
    // Thêm trường category bắt buộc
    category: Category; 
};