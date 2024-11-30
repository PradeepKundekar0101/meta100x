import { SubmitHandler, useForm } from "react-hook-form";
import { signUpSchema, TSignUpType } from "@repo/types/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";

const SignUp = () => {
  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = useForm<TSignUpType>({
    resolver: zodResolver(signUpSchema),
  });
  let toastId:number|string = ""
  const api = useAxios();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: TSignUpType) => {
       toastId = toast.loading("Creating Account");
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.dismiss(toastId)
      console.log("first")
      console.log(data)
      const {id,avatarId, userName,email,createdAt} = data?.data?.user
      const token = data?.data?.token
      dispatch(login({user:{userName,email,avatarId,id,createdAt},token}))
      toast.success("Account created successful")
      navigate("/")
      reset(); 
    },
    onError: (error: any) => {
      toast.dismiss(toastId)
      console.log(error)
      toast.error(`signup failed`, error.response?.data.message || error.message);
    },
  });

  const onSubmit: SubmitHandler<TSignUpType> = (data) => {
    try {
      signupMutation.mutate(data);
     
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
          <Label htmlFor="userName">Username*</Label>
          <Input
            {...register("userName")}
            name="userName"
            placeholder="pradeep"
            className="w-full"
          />
          {errors.userName && (
            <span className="text-red-600 text-sm">{errors.userName.message}</span>
          )}
        </div>
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
          <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Logging in..." : "signup"}
          </Button>
        </div>
        <Link to={"/login"} className=" text-blue-700">Already have an account</Link>
        {signupMutation.isError && (
          <p className="text-red-600 text-sm">
            {signupMutation.error?.response?.data?.message ||
              "An error occurred while logging in."}
          </p>
        )}
      </form>
    </main>
  );
};

export default SignUp;
