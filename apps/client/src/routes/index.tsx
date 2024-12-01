import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/ui/loader";
import { ProtectedRoute } from "./protectedRoute";
import App from "../App";
import ErrorBoundary from "@/components/common/error";
import RootLayout from "@/layouts/rootLayout";


const LandingPage = lazy((): any => import("../pages/home"));
const LoginPage = lazy((): any => import("../pages/auth/signIn"));
const Dashboard = lazy((): any => import("../pages/profile/userProfile"));
const NotFound = lazy((): any => import("@/components/common/notfound"));
const CreateRoom = lazy((): any => import("../pages/room/createRoom"));
const SignUp = lazy(():any=>import ("../pages/auth/signUp"))
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
            <RootLayout>
            <LandingPage />
            </RootLayout>
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
            <RootLayout>
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
            </RootLayout>
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
        path: "signup",
        element: <SignUp />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
export default router;