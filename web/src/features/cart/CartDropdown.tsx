"use client";
import Link from 'next/link';
import { useCart } from '@/features/cart/cart-context';
import { formatVND } from '@/lib/format';
import Image from 'next/image';

export default function CartDropdown() {
    // Lấy dữ liệu giỏ hàng
    const { state, subtotal, totalItems } = useCart();
    
    // Class Tailwind CSS cho dropdown:
    const dropdownClasses = `
        absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-32px)] p-4 
        bg-white border shadow-xl rounded-lg 
        z-50 
        /* Hiệu ứng ẩn/hiện */
        opacity-0 invisible transition-all duration-300
        group-hover:opacity-100 group-hover:visible 
    `;

    return (
        <div className={dropdownClasses}>
            
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                Giỏ hàng ({totalItems} sản phẩm)
            </h3>

            {state.items.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Giỏ hàng trống.</p>
            ) : (
                <>
                    {/* Danh sách sản phẩm (Chỉ hiển thị 3 mục đầu) */}
                    <ul className="max-h-60 overflow-y-auto space-y-3 pr-2">
                        {state.items.slice(0, 3).map(item => ( 
                            <li key={item.slug} className="flex items-center gap-3">
                                {/* Hình ảnh sản phẩm */}
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    <Image 
                                        src={item.image ?? '/placeholder.png'} 
                                        alt={item.title} 
                                        fill 
                                        className="object-cover rounded" 
                                        sizes="48px"
                                    />
                                </div>
                                {/* Thông tin */}
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {item.quantity} x {formatVND(item.price)}
                                    </p>
                                </div>
                            </li>
                        ))}
                        {state.items.length > 3 && (
                            <li className="text-xs text-gray-500 text-center pt-2">
                                ...và {state.items.length - 3} mục khác
                            </li>
                        )}
                    </ul>

                    {/* Tổng tiền và nút xem giỏ hàng */}
                    <div className="mt-4 pt-3 border-t space-y-3">
                        <div className="flex justify-between font-semibold">
                            <span>Tổng phụ:</span>
                            <span className="text-red-600">{formatVND(subtotal)}</span>
                        </div>
                        <Link 
                            href="/cart" 
                            className="w-full block text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                        >
                            Xem giỏ hàng
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}