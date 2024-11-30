import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/ui/loader";
import { ProtectedRoute } from "./protectedRoute";
import App from "../App";
import ErrorBoundary from "@/components/common/error";

const LandingPage = lazy((): any => import("../pages/home"));
const LoginPage = lazy((): any => import("../pages/auth/signIn"));
const Dashboard = lazy((): any => import("../pages/profile/userProfile"));
const NotFound = lazy((): any => import("@/components/common/notfound"));
const CreateRoom = lazy((): any => import("../pages/room/createRoom"));
const Room = lazy((): any => import("../pages/room"));


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loader />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "createroom",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "room/:roomId",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          </Suspense>
        ),
      },
     
      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
export default router;