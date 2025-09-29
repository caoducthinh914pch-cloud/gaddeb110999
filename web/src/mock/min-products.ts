// src/mock/min-products.ts

import type { Category, MinProduct } from "@/types/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu", "Vàng", "Đỏ", "Xám", "Hồng", "Tím"];
const RATINGS = ["⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
const BRANDS = ["Acme", "Contoso", "Umbra", "Nova"];

export const MIN_PRODUCTS: MinProduct[] = Array.from({ length: 30 }, (_, i) => {
    const n = i + 1;
    return {
        slug: `san-pham-${n}`,
        title: `Sản phẩm #${n}`,
        price: 29000 + n * 10000,
        image: "/aaa.png",
        stock: n % 3 === 0 ? 0 : ((n * 3) % 21) + 1,
        rating: RATINGS[i % RATINGS.length],
        brand: BRANDS[i % BRANDS.length],
        category: (n % 2 ? "fashion" : "accessories") as Category,
        color: COLORS[i % COLORS.length],
    };
});
