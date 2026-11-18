
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { navigation } from "../data/dashboardData";

const Header = ({ setIsOpen }) => {
  const location = useLocation();

  const currentPage = navigation
    .flatMap((group) => group.items)
    .find((item) => item.path === location.pathname);

  const pageTitle = currentPage?.name || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-[73px] items-center justify-between border-b border-[#E5EAF3] bg-white px-5 md:px-7">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-[#17305C] hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-xl font-bold text-[#0B1C3B]">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-sm font-bold text-white">
          L
        </div>

        <div>
          <p className="text-xs font-bold text-[#0B1C3B]">
            lifesproutcare
          </p>
          <p className="mt-1 text-[11px] text-[#8292B0]">
            Owner
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
