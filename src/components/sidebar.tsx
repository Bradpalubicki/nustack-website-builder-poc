"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Sparkles,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-white/10 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
            NuStack
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-600 dark:hover:text-white transition-all duration-200 group cursor-pointer",
                    isActive && "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 group-hover:scale-110 transition-transform",
                    isActive && "text-brand-500"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <Separator className="my-4 dark:bg-white/10" />

        {/* Quick Actions */}
        <div className="space-y-1">
          <Link href="/projects/new">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 cursor-pointer group">
              <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">New Project</span>
            </div>
          </Link>
        </div>
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t border-slate-200 dark:border-white/10 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
              <Avatar className="h-10 w-10 ring-2 ring-brand-500/20">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-brand-500 to-purple-600 text-white">U</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">User</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">user@example.com</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
