import { LogOut, User, Settings } from 'lucide-react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function Header() {
  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            RenTail Pro
          </h1>

          <Menubar className="border-0 bg-transparent shadow-none p-0">
            <MenubarMenu>
              <MenubarTrigger className="focus:bg-accent data-[state=open]:bg-accent hover:bg-accent/50 rounded-full">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </MenubarTrigger>
              <MenubarContent align="end" className="w-56 bg-popover border-border">
                <div className="px-3 py-2 mb-2">
                  <div className="text-sm font-medium text-foreground">John Doe</div>
                  <div className="text-xs text-muted-foreground">john@example.com</div>
                </div>
                <MenubarSeparator className="bg-border" />
                <MenubarItem className="focus:bg-accent hover:bg-accent/50 flex items-center gap-2 cursor-pointer text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </MenubarItem>
                <MenubarItem className="focus:bg-accent hover:bg-accent/50 flex items-center gap-2 cursor-pointer text-foreground">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </MenubarItem>
                <MenubarSeparator className="bg-border" />
                <MenubarItem
                  onClick={handleLogout}
                  className="focus:bg-destructive/10 hover:bg-destructive/10 flex items-center gap-2 cursor-pointer text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  )
}