import { SubmitHandler, useForm } from "react-hook-form";
import { signInSchema, TSignInType } from "@repo/types/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, Lock } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = useForm<TSignInType>({
    resolver: zodResolver(signInSchema),
  });

  const api = useAxios();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: TSignInType) => {
      const response = await api.post("/auth/signin", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Login successful");
    },
    onError: (error: {
      response: {
        data: string;
      };
    }) => {
      toast.error("Login failed: " + error.response.data);
    },
  });

  const onSubmit: SubmitHandler<TSignInType> = (data) => {
    try {
      loginMutation.mutate(data);
      reset();
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050508] flex items-center justify-center overflow-hidden">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6658fe]/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-600/[0.05] blur-[100px]" />
        <div className="absolute top-[50%] left-[60%] w-[250px] h-[250px] rounded-full bg-violet-500/[0.04] blur-[80px]" />
      </div>

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Home
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6658fe] to-indigo-600 shadow-[0_0_30px_rgba(102,88,254,0.3)] mb-5">
            <span className="text-white font-bold text-lg tracking-tight">
              M
            </span>
          </div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/30 text-sm mt-1.5">
            Sign in to continue to your spaces
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/50 block">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  {...register("email")}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#6658fe]/50 focus:ring-1 focus:ring-[#6658fe]/30 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-400/80 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/50 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  {...register("password")}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#6658fe]/50 focus:ring-1 focus:ring-[#6658fe]/30 transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-400/80 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error message */}
            {loginMutation.isError && (
              <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">
                  {(
                    loginMutation.error as unknown as {
                      response: { data: { message: string } };
                    }
                  )?.response?.data?.message ||
                    "An error occurred while logging in."}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 rounded-xl bg-[#6658fe] hover:bg-[#5a4ee6] text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(102,88,254,0.35)] hover:shadow-[0_4px_20px_rgba(102,88,254,0.45)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center mt-6 text-sm text-white/25">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#a49bff] hover:text-[#c0b9ff] transition-colors font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
