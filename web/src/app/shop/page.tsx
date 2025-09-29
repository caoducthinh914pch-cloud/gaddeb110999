"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { MinProduct } from "@/types/product";

// Định nghĩa các giới hạn có thể chọn
const LIMIT_OPTIONS = [8, 12, 16];
// Giới hạn mặc định, nếu không có trong URL
const DEFAULT_LIMIT = 12;

// Định nghĩa các tùy chọn sắp xếp đầy đủ
const SORT_OPTIONS = [
    { value: "default", label: "Mặc định (Theo ID)" },
    { value: "price-desc", label: "Giá: Cao → Thấp" },
    { value: "price-asc", label: "Giá: Thấp → Cao" },
    { value: "title-desc", label: "Tên: Z → A" },
    { value: "title-asc", label: "Tên: A → Z" },
];
// Giá trị sắp xếp mặc định
const DEFAULT_SORT = "default";

export default function ShopPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Lấy params từ URL
    const pageParam = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const qParam = searchParams.get("q") || "";
    const limitParam = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10);
    const LIMIT = LIMIT_OPTIONS.includes(limitParam) ? limitParam : DEFAULT_LIMIT;
    const sortParam = searchParams.get("sort") || "";
    const SORT = SORT_OPTIONS.map((opt) => opt.value).includes(sortParam)
        ? sortParam
        : DEFAULT_SORT;

    // States cho inputs
    const [qInput, setQInput] = useState(qParam);
    useEffect(() => setQInput(qParam), [qParam]);

    const [limitInput, setLimitInput] = useState(String(LIMIT));
    useEffect(() => setLimitInput(String(LIMIT)), [LIMIT]);

    const [sortInput, setSortInput] = useState(SORT);
    useEffect(() => setSortInput(SORT), [SORT]);

    // Arguments cho custom hook useProductsQuery
    const queryArgs = useMemo(
        () => ({
            page: pageParam,
            limit: LIMIT,
            q: qParam || undefined,
            sort: SORT || undefined,
        }),
        [pageParam, LIMIT, qParam, SORT]
    );
    const { data, isLoading, isError, error } = useProductsQuery(queryArgs);

    // Hàm để cập nhật URL với các tham số mới
    function setUrl(next: { page?: number; q?: string | null; limit?: number | null; sort?: string | null }) {
        const sp = new URLSearchParams(searchParams.toString());

        // Cập nhật trang
        if (typeof next.page === "number") sp.set("page", String(next.page));

        // Cập nhật tìm kiếm (q)
        if (next.q !== undefined) {
            if (next.q && next.q.trim()) {
                sp.set("q", next.q.trim());
                sp.set("page", "1");
            } else {
                sp.delete("q");
                sp.set("page", "1");
            }
        }

        // Cập nhật giới hạn (limit)
        if (next.limit !== undefined) {
            if (next.limit && LIMIT_OPTIONS.includes(next.limit)) {
                sp.set("limit", String(next.limit));
                sp.set("page", "1");
            } else if (next.limit === null || next.limit === DEFAULT_LIMIT) {
                sp.delete("limit"); 
                sp.set("page", "1");
            }
        }

        // Cập nhật sắp xếp (sort)
        if (next.sort !== undefined) {
            const isAValidSortOption = SORT_OPTIONS.map(opt => opt.value).includes(next.sort || '');
            if (next.sort && isAValidSortOption && next.sort !== DEFAULT_SORT) {
                sp.set("sort", next.sort);
                sp.set("page", "1");
            } else {
                sp.delete("sort"); 
                sp.set("page", "1");
            }
        }

        // Đẩy URL mới
        router.push(`${pathname}?${sp.toString()}`);
    }

    // --- LOGIC TÍNH TOÁN DẢI HIỂN THỊ (Range) ---
    const displayRange = useMemo(() => {
        if (!data || data.total === 0) return null;

        const { page, limit, total, data: currentData } = data;

        // Vị trí bắt đầu: (trang - 1) * giới hạn + 1
        const start = (page - 1) * limit + 1;

        // Vị trí kết thúc: start + số lượng sản phẩm trên trang hiện tại - 1, không vượt quá total
        const end = Math.min(start + currentData.length - 1, total);

        return `Hiển thị ${start}–${end} trên ${total}`;
    }, [data]);
    // ---------------------------------------------


    return (
        <main className="py-8">
            <h1 className="text-2xl font-semibold">Shop</h1>

            {/* Control Panel: Search, Limit Select & Sort Select */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">

                {/* Search Form */}
                <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setUrl({ q: qInput });
                    }}
                >
                    <input
                        value={qInput}
                        onChange={(e) => setQInput(e.target.value)}
                        placeholder="Tìm sản phẩm..."
                        className="h-10 px-3 rounded-md border text-sm w-full md:w-80"
                        aria-label="Tìm kiếm sản phẩm"
                    />
                    <button className="h-10 px-4 rounded-md border">Tìm</button>
                </form>

                {/* Flex container cho Limit và Sort */}
                <div className="flex flex-wrap items-center gap-4 ml-auto">

                    {/* Limit Select */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="limit-select" className="text-sm text-gray-700 whitespace-nowrap">
                            Giới Hạn:
                        </label>
                        <select
                            id="limit-select"
                            value={limitInput}
                            onChange={(e) => {
                                const newLimit = parseInt(e.target.value, 10);
                                setLimitInput(e.target.value);
                                setUrl({ limit: newLimit });
                            }}
                            className="h-10 px-2 rounded-md border text-sm"
                            aria-label="Chọn số sản phẩm trên mỗi trang"
                        >
                            {LIMIT_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Select */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-select" className="text-sm text-gray-700 whitespace-nowrap">
                            Sắp Xếp:
                        </label>
                        <select
                            id="sort-select"
                            value={sortInput}
                            onChange={(e) => {
                                const newSort = e.target.value;
                                setSortInput(newSort);
                                setUrl({ sort: newSort });
                            }}
                            className="h-10 px-2 rounded-md border text-sm"
                            aria-label="Chọn tùy chọn sắp xếp sản phẩm"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* States */}
            {isLoading && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                    {Array.from({ length: LIMIT }).map((_, i) => (
                        <div key={i} className="h-60 bg-gray-100 rounded-xl border" />
                    ))}
                </div>
            )}

            {isError && (
                <p className="mt-6 text-red-600">Lỗi tải dữ liệu: {(error as Error)?.message}</p>
            )}

            {data && data.data.length === 0 && (
                <p className="mt-6 text-gray-600">Không tìm thấy sản phẩm phù hợp.</p>
            )}

            {data && data.data.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.data.map((p) => (
                        <ProductCard key={p.slug} product={p as unknown as MinProduct} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {data && (
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">

                    {/* Hiển thị Range/Total */}
                    {displayRange && (
                        <span className="text-sm text-gray-500 sm:mr-auto">
                            {displayRange}
                        </span>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            className="h-9 px-3 rounded-md border disabled:opacity-40"
                            onClick={() => setUrl({ page: Math.max(pageParam - 1, 1) })}
                            disabled={pageParam <= 1}
                        >
                            ← Trước
                        </button>
                        <span className="text-sm text-gray-600">Trang {data.page}</span>
                        <button
                            className="h-9 px-3 rounded-md border disabled:opacity-40"
                            onClick={() => setUrl({ page: data.page + 1 })}
                            disabled={!data.hasNext}
                        >
                             Sau →
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}