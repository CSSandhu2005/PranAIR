// Dashboard sidebar demo component with navigation and user menu
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { Home, Settings, BarChart, Users, FileText, LogOut } from "lucide-react";

export function SidebarDemo() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="bg-white">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-red-500 to-orange-500" />
            <span className="font-bold text-lg">PranAIR</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="flex items-center gap-3">
                  <Home className="w-5 h-5" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3">
                  <BarChart className="w-5 h-5" />
                  Analytics
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Users
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Reports
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Preferences
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenuItem>
            <SignOutButton redirectUrl="/">
              <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </SignOutButton>
          </SidebarMenuItem>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to PranAIR Dashboard</h1>
            <p className="text-gray-600 mb-8">
              AI-powered drone emergency response system for rapid crisis management
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Cards */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Active Drones</h3>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Response Time</h3>
                <p className="text-3xl font-bold text-gray-900">2.3s</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Coverage Area</h3>
                <p className="text-3xl font-bold text-gray-900">450 km²</p>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <p className="text-gray-600">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
