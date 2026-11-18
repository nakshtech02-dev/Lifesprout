
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7FD]">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <main className="min-h-screen lg:ml-[234px]">
        <Header setIsOpen={setIsOpen} />

        <div className="p-4 md:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
