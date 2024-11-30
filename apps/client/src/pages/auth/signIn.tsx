import { SubmitHandler, useForm } from "react-hook-form";
import { signInSchema, TSignInType } from "@repo/types/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SignIn = () => {
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
      toast.success("Login successful")
    },
    onError: (error: any) => {
      toast.error("Login failed:", error.response?.data || error.message);
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
    <main className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email*</Label>
          <Input
            {...register("email")}
            name="email"
            placeholder="pradeep@kundekar.com"
            className="w-full"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password*</Label>
          <Input
            {...register("password")}
            name="password"
            type="password"
            placeholder="*****"
            className="w-full"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">{errors.password.message}</span>
          )}
        </div>
        <div>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </div>
        <Link to={"/signup"} className=" text-blue-700">Don't have an account?</Link>

        {loginMutation.isError && (
          <p className="text-red-600 text-sm">
            {loginMutation.error?.response?.data?.message ||
              "An error occurred while logging in."}
          </p>
        )}
      </form>
    </main>
  );
};

export default SignIn;
