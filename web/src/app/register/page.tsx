"use client";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";

// Đã loại bỏ các import thư viện bên ngoài để tránh lỗi phiên bản.

// Định nghĩa kiểu dữ liệu cho form
type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Regex cho mật khẩu mạnh
const STRONG_PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{6,}$/;

export default function RegisterPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sử dụng state để quản lý dữ liệu form
  const [formValues, setFormValues] = useState<RegisterValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Sử dụng state để quản lý lỗi
  const [errors, setErrors] = useState<{ [key: string]: string; }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm xác thực thủ công
  const validateForm = (values: RegisterValues) => {
    const newErrors: { [key: string]: string; } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!values.name) {
      newErrors.name = "Họ tên không được để trống";
    }
    
    if (!values.email || !emailRegex.test(values.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!values.password) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!STRONG_PASSWORD_REGEX.test(values.password)) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 1 số, 1 chữ in hoa và 1 ký tự đặc biệt.";
    }

    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Nhập lại mật khẩu không khớp";
    }

    // Luôn gọi setErrors để cập nhật state lỗi sau khi tính toán xong
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Xử lý thay đổi input và cập nhật state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => {
      const newValues = { ...prev, [name]: value };
      // Gọi validateForm ở đây để cập nhật lỗi ngay khi người dùng gõ
      validateForm(newValues);
      return newValues;
    });
  };

  // FIX: Chỉ kiểm tra state lỗi hiện tại, không gọi hàm validateForm tại đây
  const hasEmptyFields = !Object.values(formValues).every(v => v.length > 0);
  const hasValidationErrors = Object.keys(errors).length > 0;
  const isFormValid = !hasEmptyFields && !hasValidationErrors;


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerMsg(null);
    
    // Đảm bảo validateForm được gọi lần cuối trước khi submit
    if (!validateForm(formValues)) {
      return;
    }

    setIsSubmitting(true);
    const res = await fetch("/api/auth/register", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });

    if (!res.ok) {
      const data = await res.json();
      setServerMsg(data?.message ?? "Đăng ký thất bại");
    } else {
      setServerMsg("Đăng ký thành công (-> Đến Đăng Nhập thoai nào!)");
    }
    setIsSubmitting(false);
  }

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center">Đăng ký</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          
          {/* HỌ TÊN */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">Họ tên</label>
            <input
              className="mt-1 w-full border rounded-md h-10 px-3 focus:ring-blue-500 focus:border-blue-500"
              name="name"
              id="name"
              onChange={handleChange}
              value={formValues.name}
              disabled={isSubmitting}
              placeholder="Nguyễn Văn AAA"
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              className="mt-1 w-full border rounded-md h-10 px-3 focus:ring-blue-500 focus:border-blue-500"
              name="email"
              id="email"
              onChange={handleChange}
              value={formValues.email}
              disabled={isSubmitting}
              placeholder="ban@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* MẬT KHẨU */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Mật khẩu</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"} 
                className="w-full border rounded-md h-10 px-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
                name="password"
                id="password"
                onChange={handleChange}
                value={formValues.password}
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

          {/* NHẬP LẠI MẬT KHẨU */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Nhập lại mật khẩu</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"} 
                className="w-full border rounded-md h-10 px-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
                name="confirmPassword"
                id="confirmPassword"
                onChange={handleChange}
                value={formValues.confirmPassword}
                disabled={isSubmitting}
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? "🔒" : "🔓"} 
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
            {formValues.password && !errors.confirmPassword && (
              <p className="mt-1 text-xs text-gray-500">
                Mẹo: Tối thiểu 6 ký tự, có 1 số, 1 chữ in hoa, 1 ký tự đặc biệt.
              </p>
            )}
          </div>
          
          {/* NÚT SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full h-10 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition"
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {serverMsg && (
            <p className={`text-sm mt-2 text-center ${serverMsg.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
              {serverMsg}
            </p>
          )}
        </form>
        <SiteFooter />
      </div>
    </main>
  );
}