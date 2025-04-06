import * as React from "react"
import {
  AudioWaveform,
  Database,
  GalleryVerticalEnd,
  Map,
  Package2,
  ShoppingBag,
  Store,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { LinkOptions } from "@tanstack/react-router"

type User = {
  name: string
  email: string
  avatar: string
}

type Team = {
  name: string
  logo: React.ComponentType
  plan: string
}

type NavMainItem = {
  title: string
  link : LinkOptions
}

type NavMainGroup = {
  title: string
  url: string
  icon?: React.ComponentType
  isActive?: boolean
  items: NavMainItem[]
}

const user: User = {
  name: "shadcn",
  email : "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

const teams: Team[] = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Map,
    plan: "Free",
  },
]

const navMainGroup : NavMainGroup[] = [
  {
    title: "Master Data",
    url: "#",
    icon: Database,
    isActive: true,
    items: [
      {
        title: "Products",
        link: {
          to: "/tenant/master-data/products"
        }
      },
    ],
  },
  {
    title: "User",
    url: "#",
    icon: User,
    isActive: true,
    items: [
      {
        title: "User Management",
        link: {
          to: "/tenant/user/user-management"
        }
      },
    ],
  },
  {
    title: "Sales",
    url: "#",
    icon: ShoppingBag,
    isActive: true,
    items: [
      {
        title: "Chasier",
        link: {
          to: "/tenant/penjualan/chasier"
        }
      },
      {
        title: "Sales Invoice",
        link: {
          to: "/tenant/penjualan/sales-invoice"
        }
      },
    ],
  },
]


// This is sample data.
const data = {

  projects: [
    {
      name: "Store Management",
      url: "#",
      icon: Store,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: ShoppingBag,
    },
    {
      name: "Inventory",
      url: "#",
      icon: Package2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainGroup} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
