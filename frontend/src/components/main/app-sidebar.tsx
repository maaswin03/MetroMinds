import * as React from "react"
import {
  Home,
  Command,
  ShoppingCart,
  PieChart,
  Settings2,
  ChartNoAxesCombined
} from "lucide-react"

import { NavMain } from "@/components/main/nav-main"
import { NavUser } from "@/components/main/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: localStorage.getItem("name") || "Unknown User",
    email: localStorage.getItem("email") || "Unknown Email",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Dashboard",
      url: "/Dashboard/FloodMonitoring",
      icon: ChartNoAxesCombined,
      isActive: true,
      items: [
        { title: "Flood Monitoring", url: "/Dashboard/FloodMonitoring" },
        { title: "Earthquake Monitoring", url: "/Dashboard/EarthquakeMonitoring" },
        { title: "Smart Trash Bins", url: "/Dashboard/WasteMonitoring" },
        { title: "Noise Monitoring", url: "/Dashboard/NoiseMonitoring" },
        { title: "Traffic Management", url: "/Dashboard/TrafficMonitoring" },
      ],
    },
    {
      title: "Reports",
      url: "/",
      icon: PieChart,
      items: [
        { title: "Download Reports", url: "/" },
      ],
    },
    {
      title: "Sales & Orders",
      url: "/",
      icon: ShoppingCart,
      isActive: true,
      items: [
        { title: "Products", url: "/" },
      ],
    },
    {
      title: "Settings",
      url: "/",
      icon: Settings2,
    },
  ],
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Metro-Minds</span>
                  <span className="truncate text-xs">Urban Management</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
