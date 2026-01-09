"use client";
import { SidebarDemo } from "@/components/sidebar-demo";
import Agent1Dashboard from "@/components/agent1-dashboard";
import { useState } from "react";

type AgentType = "agent1" | "agent2" | "agent3";

export default function DashboardPage() {
  const [activeAgent, setActiveAgent] = useState<AgentType>("agent1");

  const renderAgentContent = () => {
    switch (activeAgent) {
      case "agent1":
        return <Agent1Dashboard />;
      case "agent2":
        return (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-xl">
              Agent 2: Coming Soon
            </p>
          </div>
        );
      case "agent3":
        return (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-xl">
              Agent 3: Coming Soon
            </p>
          </div>
        );
      default:
        return <Agent1Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarDemo activeAgent={activeAgent} onAgentChange={setActiveAgent} />
      {renderAgentContent()}
    </div>
  );
}
