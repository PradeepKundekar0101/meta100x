import { createRoot } from "react-dom/client";
import "./index.css";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.tsx";
import ErrorBoundary from "@/components/common/error.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";

const queryClient = new QueryClient({ defaultOptions: {} });
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </Provider>
  </ErrorBoundary>
);
