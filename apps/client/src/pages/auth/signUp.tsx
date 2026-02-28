import { useState, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpSchema, TSignUpType } from "@repo/types/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { ArrowLeft, Loader2, Mail, Lock, User, Sparkles } from "lucide-react";
import DecryptedText from "@/components/DecryptedText";

const ADJECTIVES = [
  "Happy", "Angry", "Sleepy", "Lazy", "Brave", "Clever", "Silly", "Funny",
  "Tiny", "Giant", "Shiny", "Noisy", "Quiet", "Speedy", "Sneaky", "Hungry",
  "Chilly", "Frosty", "Spicy", "Sweet", "Wild", "Gentle", "Lucky", "Grumpy",
  "Curious",
];

const NOUNS = [
  "Cow", "Snowman", "Icecream", "Panda", "Tiger", "Penguin", "Monkey",
  "Rabbit", "Fox", "Bear", "Owl", "Dolphin", "Shark", "Dragon", "Unicorn",
  "Robot", "Pirate", "Ninja", "Wizard", "Knight", "Alien", "Ghost", "Pumpkin",
  "Donut", "Cupcake",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFunName(): string {
  return `${pickRandom(ADJECTIVES)}${pickRandom(NOUNS)}`;
}

const SignUp = () => {
  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
    setValue,
  } = useForm<TSignUpType>({
    resolver: zodResolver(signUpSchema),
  });

  const [generatedCreds, setGeneratedCreds] = useState<{
    userName: string;
    email: string;
    password: string;
  } | null>(null);
  const [genKey, setGenKey] = useState(0);
  const toastIdRef = useRef<number | string>("");
  const api = useAxios();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: TSignUpType) => {
      toastIdRef.current = toast.loading("Creating Account");
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.dismiss(toastIdRef.current);
      const { id, avatarId, userName, email, createdAt } =
        data?.data?.user || {};
      const token = data?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
      }
      dispatch(
        login({ user: { userName, email, avatarId, id, createdAt }, token })
      );
      toast.success("Account created successful");
      navigate("/");
      reset();
    },
    onError: (error: {
      response?: { data: { message: string } };
      message: string;
    }) => {
      toast.dismiss(toastIdRef.current);
      console.log(error);
      toast.error(`signup failed`);
    },
  });

  const onSubmit: SubmitHandler<TSignUpType> = (data) => {
    try {
      signupMutation.mutate(data);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const generateCredentials = (e: React.MouseEvent) => {
    e.preventDefault();
    const userName = generateFunName();
    const email = `${userName.toLowerCase()}@example.com`;
    const randomStr = Math.random().toString(36).substring(2, 8);
    const password = `Pass_${randomStr}!`;

    setValue("userName", userName);
    setValue("email", email);
    setValue("password", password);

    setGeneratedCreds({ userName, email, password });
    setGenKey((k) => k + 1);
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#050508] flex items-center justify-center overflow-hidden"
      id="resources"
    >
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

      <main className="flex flex-col items-center justify-center w-full max-w-[420px] mx-4">
        <div className="text-center mb-8 w-full">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shadow-[0_0_30px_rgba(102,88,254,0.3)] mb-5">
            <img src="/logo.png" alt="logo" className="w-10 h-10" />
          </div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-white/30 text-sm mt-1.5">
            Join and start exploring virtual spaces
          </p>
        </div>

        <div className="relative z-10 w-full max-w-[420px] mx-4 bg-[#050508] rounded-2xl border border-white/[0.06]">
          <div className="backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-white/50 block">
                  Username
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />
                  <input
                    {...register("userName")}
                    name="userName"
                    placeholder="Choose a username"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#6658fe]/50 focus:ring-1 focus:ring-[#6658fe]/30 transition-all"
                  />
                </div>
                {errors.userName && (
                  <p className="text-red-400/80 text-xs mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>

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
                    placeholder="Create a strong password"
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
              {signupMutation.isError && (
                <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">
                    {signupMutation.error?.response?.data?.message ||
                      "An error occurred while creating your account."}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full h-11 rounded-xl bg-[#6658fe] hover:bg-[#5a4ee6] text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(102,88,254,0.35)] hover:shadow-[0_4px_20px_rgba(102,88,254,0.45)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {signupMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              {/* Generate credentials */}
              <button
                onClick={generateCredentials}
                type="button"
                className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/70 hover:bg-white/[0.06] text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                Generate test credentials
              </button>

              {/* Decrypted credentials reveal */}
              {generatedCreds && (
                <div
                  key={genKey}
                  className="rounded-xl bg-[#6658fe]/[0.06] border border-[#6658fe]/20 p-4 space-y-2.5"
                >
                  <p className="text-[11px] font-medium text-[#a49bff]/60 uppercase tracking-widest mb-3">
                    Generated credentials
                  </p>
                  <CredentialRow label="User" value={generatedCreds.userName} speed={30} />
                  <CredentialRow label="Email" value={generatedCreds.email} speed={20} />
                  <CredentialRow label="Pass" value={generatedCreds.password} speed={25} />
                </div>
              )}
            </form>

            <p className="text-center py-6 text-sm text-white/25 bg-[#050508]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#a49bff] hover:text-[#c0b9ff] transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

function CredentialRow({
  label,
  value,
  speed,
}: {
  label: string;
  value: string;
  speed: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium text-white/25 w-10 shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 min-w-0 font-mono text-[13px] text-white/80 truncate">
        <DecryptedText
          text={value}
          speed={speed}
          sequential
          animateOn="view"
          revealDirection="start"
          className="text-white/80"
          encryptedClassName="text-[#6658fe]/60"
        />
      </div>
    </div>
  );
}

export default SignUp;
