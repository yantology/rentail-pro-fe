import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Moon, Sun, Globe } from 'lucide-react'
import { Header } from '@/components/custom/header'
import type { ThemeMode } from '@/utils/theme'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/setting')({
  loader: async ({ context }) => {
    const { theme } = context
    return { theme }
  },
  component: RouteComponent,
});

function SettingItem({ 
  title, 
  description, 
  children 
}: { 
  title: string
  description: string
  children: React.ReactNode 
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2">
      <div className="space-y-1">
        <h4 className="text-base font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground max-w-[90%] lg:max-w-[60%]">{description}</p>
      </div>
      {children}
    </div>
  )
}

function RouteComponent() {
  const { theme } = Route.useLoaderData()
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(theme.getThemeMode())

  useEffect(() => {
    theme.setTheme(currentTheme)
  }, [currentTheme])


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-6 py-6 sm:py-8 lg:py-10">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h2>
                <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                  Manage your general preferences.
                </p>
              </div>
              
              <Separator className="my-6" />
              
              <Card>
                <CardHeader className="space-y-1 px-2 sm:px-6">
                  <CardTitle className="text-xl">General Settings</CardTitle>
                  <CardDescription>
                    Manage your general account preferences and settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-2 sm:px-6">
                    <SettingItem
                    title="Display Theme"
                    description="Choose your preferred theme mode for the interface."
                    >
                    <div className="flex items-center gap-2 min-w-[200px]">
                      {currentTheme === 'dark' ? (
                      <Moon className="h-4 w-4 text-muted-foreground hidden sm:block" />
                      ) : (
                      <Sun className="h-4 w-4 text-muted-foreground hidden sm:block" />
                      )}
                      <Select value={currentTheme} onValueChange={(value) => setCurrentTheme(value as ThemeMode)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </SettingItem>

                  <Separator />

                  <SettingItem
                    title="Language"
                    description="Select your preferred language for the interface."
                  >
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <Globe className="h-4 w-4 text-muted-foreground hidden sm:block" />
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="id">Indonesian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </SettingItem>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
