
import { useLocation } from "react-router-dom";
import { navigation } from "../data/dashboardData";
import { Construction } from "lucide-react";

const PlaceholderPage = () => {
  const location = useLocation();

  const currentPage = navigation
    .flatMap((group) => group.items)
    .find((item) => item.path === location.pathname);

  const title = currentPage?.name || "Dashboard";

  return (
    <div className="flex min-h-[65vh] items-center justify-center rounded-2xl border border-[#DFE7F5] bg-white p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#246BFA]">
          <Construction size={30} />
        </div>

        <h2 className="text-xl font-bold text-[#0B1C3B]">
          {title}
        </h2>

        <p className="mt-2 text-sm text-[#8292B0]">
          This module is under development.
        </p>

        <p className="mt-1 text-xs text-[#A0AEC0]">
          We will add its functionality in the next development phase.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
