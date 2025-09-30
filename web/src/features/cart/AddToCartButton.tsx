"use client";
import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/types/product";
import { productToCartItem } from "@/types/cart";
import { useState } from "react"; 

export default function AddToCartButton({
    product,
    disabled,
    fullWidth = true,
    className = "",
}: {
    product: Product;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}) {
    const { state, dispatch } = useCart(); 
    const [warning, setWarning] = useState<string | null>(null);

    const currentItem = state.items.find(item => item.slug === product.slug);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    
    const maxStock = product.stock ?? 0;
    const canAddOne = currentQuantity < maxStock;
    const finalDisabled = disabled || !canAddOne;


    const base =
        "h-10 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-40";
    const width = fullWidth ? "w-full" : "px-4";

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        setWarning(null); 

        if (currentQuantity + 1 > maxStock) {
            setWarning(`⚠️ Đã có ${currentQuantity} sản phẩm trong giỏ. Không thể thêm nữa do hết hàng trong kho (${maxStock}).`);
            return; 
        }

        dispatch({ type: "ADD", payload: productToCartItem(product, 1) });
    };
    
    const buttonElement = (
        <button
            type="button" 
            disabled={finalDisabled}
            onClick={handleAddToCart}
            // Kết hợp các class: base, width, và class truyền vào (className)
            className={`${base} ${width} ${className}`}
            aria-disabled={finalDisabled}
        >
            {finalDisabled && !disabled ? 'Đã đạt giới hạn kho' : 'Thêm vào giỏ'}
        </button>
    );

    if (!warning && !fullWidth) {
        return buttonElement;
    }

    return (
        <div className="space-y-2 mt-3">
            {warning && ( 
                <p className="text-red-600 text-xs p-2 bg-red-50 rounded-md font-medium">
                    {warning}
                </p>
            )}
            {buttonElement}
        </div>
    );
}