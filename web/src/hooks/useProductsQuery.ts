import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product";

export type ProductsResponse = {
  data: Product[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
};

export function useProductsQuery(args: { 
    page: number; 
    limit: number; 
    q?: string; 
    sort?: string; 
}) {
  const { page, limit, q, sort } = args;

  return useQuery<ProductsResponse>({
    // Cập nhật queryKey để cache theo tất cả các tham số
    queryKey: ["products", { page, limit, q: q ?? "", sort: sort ?? "" }], 
    
    queryFn: async () => {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit) 
      });
      
      if (q) params.set("q", q);
      // Gửi tham số sort lên API
      if (sort) params.set("sort", sort); 
      
      const res = await fetch(`/api/products?${params.toString()}`);
      
      if (!res.ok) throw new Error("Failed to fetch products");
      
      return (await res.json()) as ProductsResponse;
    },
    
    // Thêm tùy chọn ổn định và cache
    retry: 3, // Thử lại 3 lần nếu fetch thất bại
    refetchOnWindowFocus: true, // Tải lại khi focus cửa sổ
    
    placeholderData: (prev) => prev, 
  });
}