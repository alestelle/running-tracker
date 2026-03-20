"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "홈", icon: "🏠" },
  { href: "/dashboard/calendar", label: "달력", icon: "📅" },
  { href: "/dashboard/charts", label: "차트", icon: "📊" },
  { href: "/dashboard/runs", label: "기록", icon: "🏃" },
];

interface Props {
  user: { name: string; image: string };
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900">Running Tracker</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          {user.image && (
            <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" />
          )}
          <p className="text-sm font-medium text-gray-900 truncate flex-1">{user.name}</p>
        </div>
        <a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          로그아웃
        </a>
      </div>
    </aside>
  );
}
