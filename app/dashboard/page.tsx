import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarDemo } from "@/components/sidebar-demo";

export default async function DashboardPage() {
  // Protect the route - check if user is authenticated
  const session = await auth();

  // If user is not authenticated, redirect to home page
  if (!session.userId) {
    redirect("/");
  }

  // Render the protected dashboard with sidebar
  return <SidebarDemo />;
}
