// src/lib/format.ts

import type { Product } from "@/types/product"; // 👈 Cần import type Product

// ----------------------------------------------------------------------
// 1. FORMATTING HELPERS
// ----------------------------------------------------------------------

/**
 * Định dạng giá trị số thành đơn vị tiền tệ Việt Nam Đồng (VND).
 * * @param value Số cần định dạng.
 * @returns Chuỗi đã định dạng (ví dụ: "129.000 ₫"), hoặc "0 ₫" nếu giá trị không hợp lệ.
 */
export function formatVND(value: number | undefined | null): string {
  // 1. Kiểm tra nếu 'value' không phải là số (NaN, undefined, null)
  if (value === undefined || value === null || isNaN(value)) {
    // 2. Trả về giá trị mặc định "0 ₫" nếu dữ liệu bị thiếu
    return "0 ₫"; 
  }
  
  // 3. Nếu là số hợp lệ, thực hiện định dạng
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

/**
 * Định dạng chuỗi ngày tháng ISO 8601 (ví dụ: Order.createdAt)
 * thành định dạng DD/MM/YYYY, HH:mm (Ngày/Tháng/Năm, Giờ:Phút).
 * * @param iso Chuỗi ngày tháng theo chuẩn ISO 8601.
 * @returns Chuỗi ngày tháng đã được định dạng, hoặc chuỗi rỗng nếu đầu vào không hợp lệ.
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return "";
  }

  try {
    const date = new Date(iso);

    // Kiểm tra tính hợp lệ của đối tượng Date
    if (isNaN(date.getTime())) {
      return "";
    }

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Dùng định dạng 24h
    };

    // 'vi-VN' đảm bảo định dạng ngày/tháng/năm và múi giờ được xử lý đúng.
    return date.toLocaleString('vi-VN', options);
    
  } catch (error) {
    // Trường hợp chuỗi ISO không hợp lệ gây lỗi khi tạo new Date()
    return "";
  }
}

// ----------------------------------------------------------------------
// 2. DATA UTILITY HELPERS
// ----------------------------------------------------------------------

/**
 * Chọn hình ảnh chính cho sản phẩm.
 * Logic ưu tiên:
 * 1. Nếu product.images tồn tại và có ít nhất 1 phần tử, trả về ảnh đầu tiên.
 * 2. Ngược lại, trả về đường dẫn placeholder mặc định.
 *
 * @param p Đối tượng Product.
 * @returns Đường dẫn tuyệt đối (string) của hình ảnh.
 */
export function selectProductMainImage(p: Product): string {
    const defaultPlaceholder = "/placeholder.png";
    
    // 1. Kiểm tra xem mảng images có tồn tại, là mảng và có phần tử nào không
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
        // Kiểm tra thêm: đảm bảo ảnh đầu tiên là một chuỗi không rỗng
        const firstImage = p.images[0];
        if (typeof firstImage === 'string' && firstImage.trim() !== '') {
            return firstImage;
        }
    }

    // 2. Trả về placeholder nếu không tìm thấy ảnh hợp lệ
    return defaultPlaceholder;
}