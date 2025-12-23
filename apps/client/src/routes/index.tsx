import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/ui/loader";
import { ProtectedRoute } from "./protectedRoute";
import App from "../App";
import ErrorBoundary from "@/components/common/error";
import RootLayout from "@/layouts/rootLayout";

const LandingPage = lazy(() => import("../pages/home"));
const LoginPage = lazy(() => import("../pages/auth/signIn"));
const Dashboard = lazy(() => import("../pages/profile/userProfile"));
const NotFound = lazy(() => import("@/components/common/notfound"));
const CreateRoom = lazy(() => import("../pages/room/createRoom"));
const SignUp = lazy(() => import("../pages/auth/signUp"));
const Room = lazy(() => import("../pages/room"));
const JoinRoom = lazy(() => import("../pages/room/joinRoom"));
const MyRooms = lazy(() => import("../pages/room/myRooms"));

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
        path: "spaces",
        element: (
          <Suspense fallback={<Loader />}>
            <RootLayout>
              <ProtectedRoute>
                <MyRooms />
              </ProtectedRoute>
            </RootLayout>
          </Suspense>
        ),
      },
      {
        path: "space/:roomCode",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "space/join",
        element: (
          <Suspense fallback={<Loader />}>
            <RootLayout>
              <ProtectedRoute>
                <JoinRoom />
              </ProtectedRoute>
            </RootLayout>
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
