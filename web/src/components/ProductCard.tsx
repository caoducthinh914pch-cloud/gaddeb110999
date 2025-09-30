import Image from "next/image";
import Link from "next/link";
import { formatVND } from "@/lib/format";
import type { Product } from "@/types/product";
import AddToCartButton from "@/features/cart/AddToCartButton";
import SiteFooter from "@/components/SiteFooter";

// Cập nhật ProductCardProps: CHỈ CHẤP NHẬN prop 'product'
export type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Destructure tất cả các thuộc tính cần thiết từ object 'product'
  const { title, price, brand, color, rating, slug, images, stock } = product;

  // Tái tạo các biến cần thiết (href, imageSrc)
  const imageSrc = Array.isArray(images) && images.length > 0 && typeof images[0] === 'string' ? images[0] : "/aaa.png";
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
          {stock !== undefined && (
                            <p className="font-semi text-sm text-gray-700">
                                Kho: <span className={outOfStock ? 'text-red-400 font-semibold' : 'text-green-500 font-semibold'}>
                                    {outOfStock ? 'Hết hàng' : `${stock} sản phẩm`}
                                </span>
                            </p>
                        )}
          <p className="mt-1 font-semi text-sm text-gray-700">Đánh giá: {rating}</p>
          
          {/* Price */}
          <p className="mt-1 font-semibold">{formatVND(price)}</p>
          
          {/* Button */}
          <AddToCartButton product={product} disabled={outOfStock} />
        </div>
      </Link>
    </div>
  );
}


