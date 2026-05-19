import { NavLink } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { useLogout } from "../../features/auth/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  ListTree,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/categories", label: "Categories", icon: ListTree, end: false },
  { to: "/products", label: "Products", icon: Package, end: false },
  { to: "/orders", label: "Orders", icon: ShoppingCart, end: false },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const logout = useLogout();

  return (
    <aside
      className={`h-screen bg-gray-900 dark:bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-lg tracking-tight">Mini Shop</span>
        )}
        <button
          onClick={toggleSidebar}
          className={`ml-auto p-1 text-gray-400 hover:text-white transition ${!sidebarOpen && "hidden"}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition text-sm font-medium"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
