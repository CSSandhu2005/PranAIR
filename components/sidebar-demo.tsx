"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconActivity,
  IconDrone,
} from "@tabler/icons-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarDemo() {
  const { user } = useUser();
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Drone Fleet",
      href: "#",
      icon: (
        <IconDrone className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Activity",
      href: "#",
      icon: (
        <IconActivity className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: user?.fullName || user?.username || "User",
                href: "#",
                icon: (
                  <img
                    src={user?.imageUrl || "https://assets.aceternity.com/manu.png"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            <SignOutButton redirectUrl="/">
              <button className="flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 text-red-600 dark:text-red-400">
                <IconArrowLeft className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="text-red-600 dark:text-red-400 text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0! m-0!"
                >
                  Logout
                </motion.span>
              </button>
            </SignOutButton>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-red-500 dark:bg-red-400" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        PranAIR
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-red-500 dark:bg-red-400" />
    </a>
  );
};

// Dashboard component with PranAIR content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
            Welcome to PranAIR Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            AI-powered drone emergency response system for rapid crisis management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex gap-2">
          {[
            { label: "Active Drones", value: "12" },
            { label: "Response Time", value: "2.3s" },
            { label: "Coverage Area", value: "450 km²" },
            { label: "Emergencies", value: "8" },
          ].map((stat, idx) => (
            <div
              key={"stat-" + idx}
              className="h-32 w-full rounded-lg bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 p-4 flex flex-col justify-between border border-neutral-200 dark:border-neutral-700"
            >
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                {stat.label}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="flex flex-1 gap-2">
          <div className="h-full w-full rounded-lg bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
              Recent Activity
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              No recent emergency responses to display.
            </p>
          </div>
          <div className="h-full w-full rounded-lg bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
              Drone Status
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              All systems operational.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
