import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
            <SidebarTrigger />
            <div className="ml-1 flex min-w-0 items-center gap-2">
              <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
                Smart Productivity Hub
              </span>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          <footer className="border-t px-4 py-3 text-center text-xs text-muted-foreground">
            AI-generated content may contain inaccuracies. Users should review outputs before
            making business decisions.
          </footer>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}