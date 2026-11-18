import { NavLink } from "react-router-dom";
import { ExternalLink, LogOut, UserRound, X } from "lucide-react";
import { navigation } from "../data/dashboardData";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[234px] flex-col bg-[#0D204B] text-white transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="px-[13px] pb-5 pt-[19px]">
          <div className="flex h-[60px] items-center justify-center rounded-xl bg-white">
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-blue-700">
                L<span className="text-orange-500">SC</span>
              </h2>
              <p className="text-[9px] font-bold text-[#243E8B]">
                Lifesprout Care
              </p>
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-4 rounded-lg p-1 hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Navigation */}
        <nav className="sidebar-scroll flex-1 space-y-4 overflow-y-auto px-[13px] pb-5">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[9px] font-bold tracking-[1.5px] text-blue-300/60">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-[#246BFA] text-white shadow-lg"
                            : "text-blue-100 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={16} strokeWidth={2.5} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom navigation */}
        <div
          className="space-y-1 border-t border-white/10 px-[13px] py-3"
          onClick={() => navigate("/my-profile")}
        >
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-blue-100 transition hover:bg-white/10">
            <UserRound size={17} />
            My Profile
          </button>

          <button
            onClick={() =>
              window.open(
                "https://lifesproutcare.com/",
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-blue-100 transition hover:bg-white/10"
          >
            <ExternalLink size={17} />
            View website
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-blue-100 transition hover:bg-white/10">
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
