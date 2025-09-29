// src/components/ProductCard.tsx

import Image from "next/image";
import Link from "next/link";
import { formatVND } from "@/lib/format";
import type { MinProduct } from "@/types/product";


// Cập nhật ProductCardProps: CHỈ CHẤP NHẬN prop 'product'
export type ProductCardProps = {
  product: MinProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Destructure tất cả các thuộc tính cần thiết từ object 'product'
  const { title, price, brand,color, rating, slug, image, stock } = product;

  // Tái tạo các biến cần thiết (href, imageSrc)
  const imageSrc = image && typeof image === 'string' ? image : "/aaa.png";
  const outOfStock = (stock ?? 0) <= 0;
  // Dùng (price ?? 0) để an toàn hơn khi tính isDeal
  const isDeal = (price ?? 0) < 150000; 
  const href = `/shop/${slug}`;

  return (
    <div className="border rounded-xl overflow-hidden bg-white hover:shadow-sm transition">
      {/* Sử dụng href đã được tạo từ slug */}
      <Link href={href} className="block">
        <div className="relative aspect-square">
          {/* Sử dụng imageSrc đã kiểm tra */}
          <Image src={imageSrc} alt={title} fill className="object-cover" />
          
          {outOfStock && (
            <span className="absolute left-2 top-2 text-xs bg-red-500 text-white px-2 py-1 rounded-md">
              Hết hàng
            </span>
          )}
          {isDeal && (
            <span className="absolute right-2 top-2 text-xs bg-amber-500 text-white px-2 py-1 rounded-md">
              Deal
            </span>
          )}
        </div>
        <div className="p-3">
          {/* Title */}
          <h3 className="text-lg font-medium line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
          
          {/* Xuất hiện ở phần SHOP */}
          <p className="mt-1 font-semi text-sm text-gray-700">Hãng: {product.brand}</p>
          <p className="mt-1 font-semi text-sm text-gray-700">Màu: {product.color}  &nbsp;|&nbsp; Size: {product.size}</p>
          <p className="mt-1 font-semi text-sm text-gray-700">Đánh giá: {rating}</p>

          {/* Price */}
          <p className="mt-1 font-semibold">{formatVND(price)}</p>
          
          {/* Button */}
          <button
            disabled={outOfStock}
            className="mt-3 w-full h-9 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-40"
            aria-disabled={outOfStock}
          >
            Thêm vào giỏ
          </button>
        </div>
      </Link>
    </div>
  );
}