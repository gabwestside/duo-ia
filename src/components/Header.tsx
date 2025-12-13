import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { IoDiamond, IoHeart } from "react-icons/io5";
import { useUserProfile } from "@/hooks/useUserProfile";

const Header = () => {
  const { logout, isAuthenticated } = useAuth();

  const { profile, loading } = useUserProfile();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left: Course badge */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-md bg-yellow-400 text-black text-sm font-bold w-7 h-7 select-none">
            JS
          </span>
          <div className="h-6 w-px bg-gray-200" />
        </div>

        {/* Right: Status + logout */}
        <div className="flex items-center gap-5 text-gray-800">
          <div className="flex items-center gap-2">
            <IoDiamond className="w-5 h-5 text-[#0EA5E9]" strokeWidth={2} />
            <span className="font-semibold">{ loading ? "..." : profile?.total_xp }</span>
          </div>

          <div className="flex items-center gap-2">
            <IoHeart className="w-5 h-5 text-[#EF4444]" strokeWidth={2} />
            <span className="font-semibold">∞</span>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 text-[#9225D4] hover:text-[#7a1fb3] font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mt-4 rounded-xl bg-[#7a0dbf] text-white shadow-lg">
            <div className="px-6 py-6">
              <p className="uppercase text-xs tracking-widest opacity-90">
                Começar unidade
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-wide">
                Fundamentos JavaScript
              </h2>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
