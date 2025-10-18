import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useLogin } from "../services/useApi";
import { toast } from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data) => {
    login(data, {
      onSuccess: () => {
        toast.success("ورود موفقیت‌آمیز بود");
      },
      onError: (error) => {
        toast.error(error.message || "خطا در ورود");
      }
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, var(--primary-brown), var(--primary-brown-dark))",
        fontFamily: "var(--font-family)"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div 
          className="card"
          style={{
            background: "var(--surface)",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: "1px solid var(--border)"
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, var(--primary-brown), var(--primary-brown-light))"
              }}
            >
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <h1 
              className="font-bold"
              style={{
                fontSize: "var(--h2-size)",
                color: "var(--text-dark)",
                marginBottom: "var(--space-2)"
              }}
            >
              ورود به سیستم
            </h1>
            <p 
              style={{
                color: "var(--text-medium)",
                fontSize: "var(--body-regular)"
              }}
            >
              لطفاً اطلاعات خود را وارد کنید
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                نام کاربری
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5" style={{ color: "var(--text-light)" }} />
                </div>
                <input
                  {...register("username", { 
                    required: "نام کاربری الزامی است",
                    minLength: {
                      value: 3,
                      message: "نام کاربری باید حداقل 3 کاراکتر باشد"
                    }
                  })}
                  type="text"
                  className="form-input pr-10"
                  placeholder="نام کاربری خود را وارد کنید"
                  style={{
                    paddingRight: "2.5rem",
                    borderColor: errors.username ? "var(--error-red)" : "var(--border)"
                  }}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm" style={{ color: "var(--error-red)" }}>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                رمز عبور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5" style={{ color: "var(--text-light)" }} />
                </div>
                <input
                  {...register("password", { 
                    required: "رمز عبور الزامی است",
                    minLength: {
                      value: 6,
                      message: "رمز عبور باید حداقل 6 کاراکتر باشد"
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                  className="form-input pr-10 pl-10"
                  placeholder="رمز عبور خود را وارد کنید"
                  style={{
                    paddingRight: "2.5rem",
                    paddingLeft: "2.5rem",
                    borderColor: errors.password ? "var(--error-red)" : "var(--border)"
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: "var(--text-light)" }}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm" style={{ color: "var(--error-red)" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: "var(--primary-brown)" }}
                />
                <label 
                  htmlFor="remember-me" 
                  className="mr-2 block text-sm"
                  style={{ color: "var(--text-medium)" }}
                >
                  مرا به خاطر بسپار
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--primary-brown)" }}
              >
                فراموشی رمز عبور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full btn-primary flex items-center justify-center"
              style={{
                padding: "0.875rem 1.5rem",
                fontSize: "var(--body-regular)",
                fontWeight: "600",
                opacity: isPending ? 0.7 : 1,
                cursor: isPending ? "not-allowed" : "pointer"
              }}
            >
              {isPending ? (
                <div className="flex items-center">
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                  ></div>
                  در حال ورود...
                </div>
              ) : (
                "ورود"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p 
              className="text-sm"
              style={{ color: "var(--text-light)" }}
            >
              © 2024 سیستم مدیریت تجارت و توزیع
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
