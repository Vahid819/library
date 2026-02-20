import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Analytics", icon: BarChart3, href: "#" },
  { label: "Users", icon: Users, href: "#" },
  { label: "Payments", icon: CreditCard, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="h-16 px-6 flex items-center font-semibold">
        Shadcnblocks
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
