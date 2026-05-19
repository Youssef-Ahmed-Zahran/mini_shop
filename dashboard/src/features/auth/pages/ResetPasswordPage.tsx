import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schema";
import { useResetPassword } from "../hooks/useAuth";
import { ShoppingBag, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Derive the token directly from the URL during render instead of using state
  const token = useMemo(() => {
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const searchParams = new URLSearchParams(location.search);
    return (
      hashParams.get("access_token") ||
      searchParams.get("code") ||
      searchParams.get("token_hash")
    );
  }, [location.hash, location.search]);

  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // 2. Only use the effect to handle the redirect if the token is missing
  useEffect(() => {
    if (!token) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const errorDesc = hashParams.get("error_description");

      if (errorDesc) {
        toast.error(`Reset failed: ${errorDesc.replace(/\+/g, " ")}`);
      } else {
        toast.error("No token found in URL. URL is: " + window.location.href, {
          duration: 10000,
        });
      }

      setTimeout(() => navigate("/login"), 3000);
    }
  }, [token, navigate, location.hash]);

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;
    resetPassword.mutate({ password: values.password, access_token: token });
  };

  if (!token) return null; // or a loading spinner while redirecting

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-2xl mb-4 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create New Password</h1>
          <p className="text-indigo-300 mt-1">
            Please enter your new password below
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetPassword.isPending}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {resetPassword.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
