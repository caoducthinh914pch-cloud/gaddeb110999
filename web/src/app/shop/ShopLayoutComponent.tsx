import type { Metadata } from "next";
import Link from "next/link";
// Không cần dùng headers/pathname nữa vì ta dùng prop productName
// import { headers } from "next/headers"; 

export const metadata: Metadata = { title: "Shop — Shoply" };

// Định nghĩa kiểu dữ liệu cho Breadcrumb Item
type BreadcrumbItem = {
  href: string;
  label: string;
  isCurrent: boolean;
};

export default async function ShopLayout({ children, productName }: { children: React.ReactNode, productName?: string;}) {
  
  const isProductDetail = !!productName;

  // 1. Tạo Breadcrumb dựa trên prop productName
  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/", label: "Home", isCurrent: false },
    // Mặc định, "Shop" là bước hiện tại nếu KHÔNG có productName
    { href: "/shop", label: "Shop", isCurrent: !isProductDetail }, 
  ];

  // 2. Nếu là trang chi tiết, thêm tên sản phẩm vào cuối
  if (isProductDetail) {
    // Đặt lại "Shop" thành không phải là trang hiện tại
    breadcrumbs[1].isCurrent = false; 

    // Thêm bước tên sản phẩm (bước hiện tại)
    breadcrumbs.push({
      href: "", 
      label: productName!, 
      isCurrent: true 
    });
  }

  return (
    <section>
      {/* KHẮC PHỤC LỖI LẶP LẠI BREADCRUMB: 
          Phần tử này chỉ render ở layout cha. Nếu bạn thấy tiêu đề 
          và breadcrumb lặp lại, hãy kiểm tra đảm bảo page.tsx hoặc 
          layout con không tự render lại chúng. */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <nav className="text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="inline-flex items-center">
              {/* Thêm dấu phân cách */}
              {index > 0 && <span className="mx-2">→</span>} 

              {/* Render Link hoặc text tĩnh */}
              {crumb.isCurrent ? (
                <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px] sm:max-w-none">
                  {crumb.label}
                </span>
              ) : (
                <Link className="underline hover:text-black-700" href={crumb.href}>
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      {children}
    </section>
  );
}