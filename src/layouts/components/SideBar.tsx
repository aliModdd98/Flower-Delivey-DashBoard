import {
  BarChart,
  ChevronLeft,
  ChevronRight,
  Gem,
  Gift,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Phone,
  Receipt,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "../../dashboard/components/button";
import { cn } from "../../lib/utils";

const menuItems = [
  { id: "users", label: "User Management", icon: Users },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "subscribe-plans", label: "Subscribe Plans", icon: BarChart },
  { id: "category", label: "Categories", icon: Users },
  { id: "accessories", label: "Accessories", icon: Gem },
  { id: "orders", label: "Orders", icon: Receipt },
  { id: "reminder", label: "Reminedr", icon: MessageCircle },
  { id: "reviews", label: "reviews", icon: Star },
  { id: "gift-discount", label: "gift discounts", icon: Gift },
];
interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-muted  dark:bg-gray-800 border-r dark:border-gray-700 h-screen transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div
          className={cn(
            "flex items-center justify-between h-16 px-4 border-b border-gray-200 p-3 dark:border-gray-700",
            {
              " justify-center": !open,
            }
          )}
        >
          <h2 className={cn("font-semibold text-lg", !open && "opacity-0 w-0")}>
            {menuItems.find((item) =>
              location.pathname.startsWith("/dashboard/" + item.id)
            )?.label || "Dashboard"}
          </h2>
          <Button
            className=" shrink-0"
            variant="ghost"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className="flex-1  ">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.id}
              className={({ isActive }) =>
                cn(
                  "flex items-center p-3 transition-colors  text-gray-700 dark:text-gray-300 hover:bg-primary dark:hover:bg-primary",
                  {
                    "bg-gray-100 hover:text-foreground dark:bg-gray-700 text-primary dark:text-primary-foreground":
                      isActive,
                    "justify-center": !open,
                  }
                )
              }
            >
              <item.icon className="h-5 w-5  shrink-0" />
              <span
                className={cn(
                  "transition-opacity text-nowrap",
                  open ? "opacity-100 ml-2" : "opacity-0 w-0"
                )}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-3 dark:border-gray-700">
          <Button
            variant="ghost"
            className={cn(" w-full p-3 justify-start", {
              "justify-center": !open,
            })}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />{" "}
            <span
              className={cn(
                "transition-opacity text-nowrap",
                open ? "opacity-100 ml-2" : "opacity-0 w-0"
              )}
            >
              Log out
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
};
