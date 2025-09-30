"use client";
import Link from "next/link";
// **IMPORT useROUTER để xử lý chuyển hướng**
import { useRouter, usePathname } from "next/navigation"; 
import { useState } from "react";
import { cn } from "@/lib/cn";
import CartIndicator from "@/components/CartIndicator";
import CartDropdown from "@/features/cart/CartDropdown"; 

export default function SiteHeader() {
  // **Khởi tạo useRouter**
  const router = useRouter(); 
  const pathname = usePathname();
  const [q, setQ] = useState("");

  const Nav = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-lg hover:underline",
        pathname === href && "font-semibold underline"
      )}
    >
      {children}
    </Link>
  );

  // **Hàm xử lý tìm kiếm**
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();

    if (query) {
      // Chuyển hướng đến trang /shop với tham số tìm kiếm (q)
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    } else {
      // Nếu không có input, chuyển hướng đến trang /shop mà không có tham số q
      router.push(`/shop`);
    }
    // (Tùy chọn: Bạn có thể muốn setQ("") sau khi tìm kiếm để xóa input)
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        <Link href="/" className="font-bold">Shoply</Link>
        <nav className="flex gap-2 ml-auto md:gap-4 items-center">
          <Nav href="/shop">Shop</Nav>
          <div className="relative group">
        
        {/* Nút kích hoạt/Link chính - CartIndicator */}
        <Link href="/cart" className="px-3 py-2 rounded-lg hover:underline flex items-center h-full">
            <CartIndicator /> 
        </Link>
        <CartDropdown /> 
            </div>
          <Nav href="/admin">Admin</Nav>
          <Nav href="/login">Login</Nav>
          <Nav href="/register">Register</Nav>
        </nav>
        
        {/* BỌC INPUT TÌM KIẾM TRONG FORM VÀ THÊM SỰ KIỆN ONSUBMIT */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="h-9 px-3 rounded-md border text-sm"
            aria-label="Tìm kiếm sản phẩm"
          />
          {/* Nút submit cho form (có thể ẩn hoặc dùng icon) */}
          <button type="submit" className="h-9 px-3 rounded-md border bg-gray-100 text-sm">
            Tìm
          </button>
        </form>
      </div>
    </header>
  );
}