import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from '@/mock/products';
import { formatVND } from "@/lib/format"; 
import type { Product } from "@/types/product";
import SiteFooter from "@/components/SiteFooter";

// Ép kiểu cho PRODUCTS để TypeScript biết rõ ràng
const ProductList = PRODUCTS as Product[];

// Hàm generateMetadata để tạo tiêu đề trang động
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // KHẮC PHỤC LỖI: Tách await params ra biến riêng để tránh lỗi runtime "sync-dynamic-apis"
  const slug = (await params).slug;
  const product = ProductList.find((p) => p.slug === slug);
  return {
    title: product ? `${product.title} — Shoply` : "Sản phẩm — Shoply",
  };
}

// Hàm lấy sản phẩm ngẫu nhiên để hiển thị ở mục "Có thể bạn quan tâm"
function getRandomProducts(currentSlug: string, count: number) {
  // Lọc sản phẩm: loại bỏ sản phẩm hiện tại và các sản phẩm hết hàng
  const filteredProducts = ProductList.filter(
    (p) => p.slug !== currentSlug && (p.stock ?? 0) > 0
  );
  
  // Xáo trộn mảng sản phẩm đã lọc
  const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
  
  // Trả về số lượng sản phẩm được yêu cầu
  return shuffled.slice(0, count);
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  // KHẮC PHỤC LỖI: Await params trước khi truy cập thuộc tính
  const slug = (await params).slug;
  const product = ProductList.find((p) => p.slug === slug); 
  
  if (!product) {
    notFound();
  }
  
  // Xử lý logic hiển thị ảnh: nếu product.images là mảng và có phần tử, dùng phần tử đầu tiên.
  const imageSrc: string = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images[0]
    : "/aaa.png"; 

  const currentStock = product.stock ?? 0;
  const isDeal = (product.price ?? 0) < 150000;
  const outOfStock = currentStock <= 0;

  const relatedProducts = getRandomProducts(slug, 4); // Sử dụng slug đã await

  return (
    <main className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative w-full">
          <div className="relative aspect-square">
            <Image
              src={imageSrc} 
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-auto rounded-xl border object-cover"
            />
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
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{product.title}</h2>
          <p className="mt-2 text-gray-600">Mã: {product.slug}</p>
          <p className="mt-2 text-black-600">Hãng: {product.brand}</p>
          <p className="mt-2 text-black-600">Màu: {product.color}&nbsp;|&nbsp; Size: {product.size}</p>
          <p className="mt-2 text-black-600">Đánh giá: {product.rating}</p>
          <p className="mt-4 text-2xl font-bold">{formatVND(product.price)}</p> 
          
          {outOfStock ? (
            <p className="mt-2 text-red-600 font-medium">Hết hàng</p>
          ) : (
            <p className="mt-2 text-green-600 font-medium">Còn {currentStock} sản phẩm</p>
          )}

          <div className="mt-6 flex gap-3">
            <button 
              className="h-10 px-4 rounded-md border disabled:opacity-50"
              disabled={outOfStock}
            >
              Thêm vào giỏ
            </button>
            <button 
              className="h-10 px-4 rounded-md border bg-black text-white disabled:opacity-50"
              disabled={outOfStock}
            >
              Mua ngay
            </button>
            <Link className="h-10 px-4 rounded-md border flex items-center" href="/shop">← Quay lại Shop</Link>
          </div>
        </div>
      </div>
      
      {/* --- Có thể bạn quan tâm --- */}

      {relatedProducts.length > 0 && (
        <section className="mt-6">
          <h3 className="text-2xl font-semibold mb-6">Có thể bạn quan tâm</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
              // Sửa logic ảnh để tương thích với kiểu mảng
              const relatedImageSrc: string = (Array.isArray(p.images) && p.images.length > 0) 
                ? p.images[0] 
                : "/aaa.png";
              const relatedIsDeal = (p.price ?? 0) < 150000;
              const relatedOutOfStock = (p.stock ?? 0) <= 0;

              return (
                <Link key={p.slug} href={`/shop/${p.slug}`} className="block">
                  <div className="relative rounded-xl border hover:shadow-lg transition-shadow duration-300">
                    <Image
                      src={relatedImageSrc}
                      alt={p.title}
                      width={300}
                      height={300}
                      className="w-full h-auto rounded-t-xl object-cover"
                    />
                    {relatedOutOfStock && (
                      <span className="absolute left-2 top-2 text-xs bg-red-500 text-white px-2 py-1 rounded-md">
                        Hết hàng
                      </span>
                    )}
                    {relatedIsDeal && (
                      <span className="absolute right-2 top-2 text-xs bg-amber-500 text-white px-2 py-1 rounded-md">
                        Deal
                      </span>
                    )}

                    <div className="p-4">
                      <h4 className="font-semibold text-lg truncate">{p.title}</h4>
                      <p className="mt-2 text-gray-600 text-sm">Hãng: {p.brand}</p>
                      <p className="mt-2 text-black-600">Màu: {p.color}&nbsp;|&nbsp; Size: {p.size}</p> 
                      <p className="mt-2 text-black-600">Đánh giá: {p.rating}</p>
                      <p className="mt-2 font-bold text-gray-800">
                        {formatVND(p.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
