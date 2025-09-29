"use client";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
// Đã loại bỏ các import thư viện bên ngoài (useForm, zodResolver, zod) để tránh lỗi phiên bản.

// Định nghĩa kiểu dữ liệu form và các giá trị ban đầu
type LoginValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State quản lý dữ liệu form
  const [formValues, setFormValues] = useState<LoginValues>({ email: "", password: "" });
  // State quản lý lỗi
  const [errors, setErrors] = useState<{ [key: string]: string; }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm xác thực thủ công
  const validateForm = (values: LoginValues): boolean => {
    const newErrors: { [key: string]: string; } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!values.email || !emailRegex.test(values.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!values.password || values.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý thay đổi input và cập nhật state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);
    
    // Gọi validation ngay khi gõ để cập nhật trạng thái isValid
    validateForm(updatedValues); 
  };
  
  // Kiểm tra tính hợp lệ của form (dựa trên state lỗi và trạng thái điền)
  const isFormValid = Object.keys(errors).length === 0 && 
                      formValues.email.length > 0 && 
                      formValues.password.length > 0;


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerMsg(null);
    
    // Xác thực lần cuối trước khi gửi
    if (!validateForm(formValues)) {
      return;
    }

    setIsSubmitting(true);
    
    // Mock call: gửi tới Route Handler /api/auth/login
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });

    if (!res.ok) {
      const data = await res.json();
      setServerMsg(data?.message ?? "Đăng nhập thất bại");
      setIsSubmitting(false);
      return;
    }
    
    // Đăng nhập thành công -> Kích hoạt điều hướng UI-only
    setIsLoggedIn(true);
  }
    
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  
  // Điều kiện render UI-only navigation
   if (isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <a 
          href="/shop" 
          className="block text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer"
        >
          <h1 className="text-3xl font-bold text-green-600">
            Đăng nhập thành công! 🎉
          </h1>
          <p className="mt-4 text-lg text-blue-600 font-semibold ">
            Nhấn vào đây để đến trang mua sắm 🛒
          </p>
        </a>
      </main>
    );
  }

  // Hiển thị form đăng nhập nếu chưa đăng nhập
  return (
    <main className="py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
            placeholder="ban@example.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="password">Mật khẩu</label>
          <div className="relative mt-1"> 
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              className="w-full border rounded-md h-10 px-3 pr-10" 
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700" 
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? "🔒" : "🔓"} 
            </button>
          </div>
          
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="h-10 px-4 rounded-md border bg-black text-white disabled:opacity-50"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {serverMsg && <p className="text-sm mt-2">{serverMsg}</p>}
      </form>
      <SiteFooter />
    </main>
  );
}