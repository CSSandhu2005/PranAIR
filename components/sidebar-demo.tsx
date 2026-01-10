"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconArrowLeft, IconRobot } from "@tabler/icons-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export function SidebarDemo() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Get current route
  const router = useRouter();

  const agentLinks = [
    {
      id: "agent1",
      label: "Agent 1",
      subtitle: "Human Distress",
      href: "/dashboard/agent1",
      icon: (
        <IconRobot className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      id: "agent2",
      label: "Agent 2",
      subtitle: "Clinical CDS",
      href: "/dashboard/agent2",
      icon: (
        <IconRobot className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      id: "agent3",
      label: "Agent 3",
      subtitle: "Coming Soon",
      href: "/dashboard/agent3",
      icon: (
        <IconRobot className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      id: "agent4",
      label: "Agent 4",
      subtitle: "PranAIR Emergency AI",
      href: "/dashboard/agent4",
      icon: (
        <IconRobot className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Account Name at Top */}
            <div className="mb-6">
              <SidebarLink
                link={{
                  label: user?.fullName || user?.username || "Guest User",
                  href: "#",
                  icon: (
                    <img
                      src={
                        user?.imageUrl ||
                        "https://assets.aceternity.com/manu.png"
                      }
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              {agentLinks.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => router.push(agent.href)}
                  className={cn(
                    "flex items-center justify-start gap-2 group/sidebar py-3 px-2 rounded-md transition-all duration-200",
                    pathname?.startsWith(agent.href)
                      ? "bg-red-500/10 border-l-2 border-red-500"
                      : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  )}
                >
                  {agent.icon}
                  <motion.div
                    animate={{
                      display: open ? "flex" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="flex flex-col items-start"
                  >
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-pre",
                        pathname?.startsWith(agent.href)
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-700 dark:text-neutral-200"
                      )}
                    >
                      {agent.label}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {agent.subtitle}
                    </span>
                  </motion.div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
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
