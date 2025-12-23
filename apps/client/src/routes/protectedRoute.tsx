import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      toast.error("Please login");
      navigate("/");
      return;
    }
    try {
      const decodedToken: { expiresIn: number } = jwtDecode(token);
      console.log(decodedToken);
      if (decodedToken.expiresIn * 1000 < Date.now()) {
        alert("Session Expired");
        navigate("/");
        return;
      }
    } catch (error) {
      console.log(error);
      navigate("/");
      return;
    }
  }, [token, navigate]);
  return children;
};
