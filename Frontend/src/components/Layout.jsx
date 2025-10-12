import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className='min-h-screen flex overflow-x-hidden'
      style={{
        backgroundColor: "var(--background)",
        fontFamily: "var(--font-family)",
      }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className='flex-1 flex flex-col w-full lg:w-auto overflow-x-hidden'>
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main
          className='flex-1 px-4 py-6 sm:px-6 overflow-x-hidden'
          style={{
            minHeight: "calc(100vh - 72px)",
          }}
        >
          <div className='max-w-full overflow-x-hidden'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
