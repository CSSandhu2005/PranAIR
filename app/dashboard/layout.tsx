"use client";
import React from "react";
import { SidebarDemo } from "@/components/sidebar-demo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-neutral-900 overflow-hidden">
      <SidebarDemo />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
