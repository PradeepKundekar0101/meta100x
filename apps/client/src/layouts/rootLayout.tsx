import React from "react";
import Navbar from "@/pages/home/navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main className="min-h-screen">
        <div className="mx-auto ">{children}</div>
      </main>
    </div>
  );
};

export default RootLayout;
