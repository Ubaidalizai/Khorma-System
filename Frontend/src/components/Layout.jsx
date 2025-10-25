import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section
      className="h-screen flex  overflow-hidden w-full lg:max-w-[1440px] lg:mx-auto"
      style={{
        backgroundColor: "var(--background)",
        fontFamily: "var(--font-family)",
      }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - sticky at top */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content - scrollable area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default Layout;
