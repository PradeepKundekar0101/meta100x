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
    setValue,
  } = useForm<TSignUpType>({
    resolver: zodResolver(signUpSchema),
  });
  let toastId: number | string = "";
  const api = useAxios();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: TSignUpType) => {
      toastId = toast.loading("Creating Account");
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.dismiss(toastId);
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
      toast.dismiss(toastId);
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
    const randomString = Math.random().toString(36).substring(7);
    const userName = `user_${randomString}`;
    const email = `${userName}@example.com`;
    const password = `Pass_${randomString}!`;

    setValue("userName", userName);
    setValue("email", email);
    setValue("password", password);
  };

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-[60%_40%] xl:min-h-[100vh]">
      <div className="hidden lg:block h-full w-full">
        <img
          src="/assets/hero.png"
          alt="Image"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <main className="w-[350px] mx-auto gap-6">
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
                <span className="text-red-600 text-sm">
                  {errors.userName.message}
                </span>
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
                <span className="text-red-600 text-sm">
                  {errors.email.message}
                </span>
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
                <span className="text-red-600 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating account..." : "Sign up"}
              </Button>
              <Button
                onClick={generateCredentials}
                type="button"
                className="w-full mt-2"
                variant="outline"
              >
                Generate Credentials
              </Button>
            </div>
            <Link to={"/login"} className=" text-blue-700">
              Already have an account
            </Link>
            {signupMutation.isError && (
              <p className="text-red-600 text-sm">
                {signupMutation.error?.response?.data?.message ||
                  "An error occurred while logging in."}
              </p>
            )}
          </form>
        </main>
      </div>
    </div>
  );
};

export default SignUp;
