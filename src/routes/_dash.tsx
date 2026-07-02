import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Library,
  History,
  GraduationCap,
  Search,
  Bell,
} from "lucide-react";
import { InkWaves } from "@/components/InkWaves";
import { STUDENT_NAME } from "@/data/mock";

export const Route = createFileRoute("/_dash")({
  component: DashLayout,
});

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/exams", label: "Full-Length Exams", icon: FileText, exact: false },
  { to: "/question-bank", label: "Question Bank", icon: Library, exact: false },
  { to: "/history", label: "Performance History", icon: History, exact: false },
] as const;

function DashLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-screen">
      <InkWaves />
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 px-4 py-6 backdrop-blur-xl md:flex">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-[var(--shadow-soft)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              Nalu<span className="text-primary">Prep</span>
            </span>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-xl border border-sidebar-border bg-card/60 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-xs font-bold text-white">
              KO
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{STUDENT_NAME}</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/70 px-5 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 md:hidden">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-extrabold">
                Nalu<span className="text-primary">Prep</span>
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground sm:flex">
                <Search className="h-4 w-4" />
                <span>Search…</span>
              </div>
              <button className="rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
