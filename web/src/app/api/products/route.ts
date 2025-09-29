import { NextResponse } from "next/server";
// Thay thế bằng đường dẫn mock data thực tế của bạn
import { PRODUCTS } from "@/mock/products"; 

// Giả định kiểu dữ liệu sản phẩm có sẵn
type Product = { 
  id: number; 
  title: string; 
  price: number | null; 
  brand?: string; 
  category?: string;
  // ... thêm các thuộc tính khác nếu cần
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // 1. Lấy và chuẩn hóa các tham số
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.max(parseInt(searchParams.get("limit") || "12", 10), 1);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const sort = searchParams.get("sort") || "default"; // Mặc định là 'default'

  let list: Product[] = PRODUCTS as unknown as Product[]; // Ép kiểu cho mock data
  
  // 2. Lọc (Tìm kiếm)
  if (q) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      (p.brand?.toLowerCase().includes(q) ?? false) ||
      (p.category?.toLowerCase().includes(q) ?? false)
    );
  }

  // 3. Sắp xếp (Sorting) - ĐÃ CẬP NHẬT LOGIC SORT
  list.sort((a, b) => {
    // Sắp xếp Mặc định (Theo ID sản phẩm)
    if (sort === "default" || sort === "") {
        return a.id - b.id; 
    }
    
    // Sắp xếp theo Giá
    if (sort === "price-desc") {
      return (b.price ?? 0) - (a.price ?? 0); // Cao -> Thấp (DESC)
    }
    if (sort === "price-asc") {
      return (a.price ?? 0) - (b.price ?? 0); // Thấp -> Cao (ASC)
    }
    
    // Sắp xếp theo Tên (Title)
    if (sort === "title-asc") {
      return a.title.localeCompare(b.title); // A -> Z (ASC)
    }
    if (sort === "title-desc") {
      return b.title.localeCompare(a.title); // Z -> A (DESC)
    }
    
    return 0; // Giữ nguyên thứ tự nếu không khớp
  });
  
  // 4. Phân trang (Pagination)
  const total = list.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const data = list.slice(start, end);
  const hasNext = end < total;

  return NextResponse.json({ data, page, limit, total, hasNext });
}