import ShopLayout from '@/app/shop/ShopLayoutComponent';
import { notFound } from 'next/navigation';
import type { MinProduct } from "@/types/product";
import { MIN_PRODUCTS } from "@/mock/min-products";

// Hàm tìm nạp dữ liệu sản phẩm hiện tại dựa trên slug
async function fetchProductData(slug: string): Promise<MinProduct | undefined> {
  const product = MIN_PRODUCTS.find(p => p.slug === slug);
  return product;
}

export default async function ProductDetailLayout({ 
  children,
  params,
}: { 
  children: React.ReactNode; 
  params: { slug: string }; 
}) {
  const { slug } = await params;
  const product = await fetchProductData(slug); 
  
  if (!product) {
    // Nếu không tìm thấy, hiển thị trang 404
    notFound(); 
  }

  // Truyền tên sản phẩm vào ShopLayout để hiển thị Breadcrumb
  return (
    <ShopLayout productName={product.title}> 
      {children}
    </ShopLayout>
  );
}