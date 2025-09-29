// src/components/orders/OrderDetailsInfo.tsx
import { formatDate, formatVND } from "@/lib/format";
import type { Order } from "@/types/order"; // 👈 Import type Order

// Định nghĩa props rõ ràng
interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetailsInfo({ order }: OrderDetailsProps) {
  const orderDate = formatDate(order.createdAt);
  
  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold mb-3">Thông tin đơn hàng</h3>
      
      <p className="text-sm text-gray-700">
        Ngày đặt hàng: <span className="font-medium text-black">{orderDate}</span>
      </p>
      <p className="text-sm text-gray-700">
        Tổng cộng: <span className="font-bold text-black">{formatVND(order.total)}</span>
      </p>
      {/* ... */}
    </div>
  );
}