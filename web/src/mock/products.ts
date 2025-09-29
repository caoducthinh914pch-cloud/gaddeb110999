import type { Product } from "@/types/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu", "Vàng", "Đỏ", "Xám", "Hồng", "Tím"];
const SIZES = ["S", "M", "L", "XL"];
const RATINGS =["⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"]; 
const BRANDS = ["Acme", "Contoso", "Umbra", "Nova"];


export const PRODUCTS: Product[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  return {
    _id: `p${n}`,
    title: `Sản phẩm #${n}`,
    slug: `san-pham-${n}`,
    price: 29000 + n * 10000,
    images: ["/aaa.png"],
    stock: n % 3 === 0 ? 0 : ((n * 3) % 21) + 1,
    // Áp dụng thứ tự tuần hoàn thay vì ngẫu nhiên
    rating: RATINGS[i % RATINGS.length],
    brand: BRANDS[i % BRANDS.length],
    variants: [{ 
      color: COLORS[i % COLORS.length], 
      size: SIZES[i % SIZES.length] 
    }],
    description: "Mô tả ngắn cho sản phẩm.",
    category: n % 2 ? "fashion" : "accessories",
    color: COLORS[i % COLORS.length],
    size: SIZES[i % SIZES.length],
  };
});