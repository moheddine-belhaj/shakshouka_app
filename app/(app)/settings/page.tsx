"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="py-2">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </header>

      {/* Profile Card */}
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar className="size-16">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-foreground">User</p>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="size-4 text-primary" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue="User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="user@example.com" />
          </div>
          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Smartphone className="size-4 text-primary" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive deadline reminders
                </p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Use dark theme
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Other Options */}
      <Card>
        <CardContent className="py-0">
          <SettingsLink
            icon={<Shield className="size-5" />}
            label="Privacy & Security"
          />
          <Separator />
          <SettingsLink
            icon={<HelpCircle className="size-5" />}
            label="Help & Support"
          />
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        className="h-12 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 mt-4"
        onClick={handleLogout}
      >
        <LogOut className="size-5" />
        Sign Out
      </Button>

      {/* App Info */}
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">DocVault v1.0.0</p>
        <p className="text-xs text-muted-foreground">
          Built with Next.js
        </p>
      </div>
    </main>
  )
}

function SettingsLink({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <button className="flex items-center justify-between w-full py-4 text-left hover:bg-accent/50 transition-colors -mx-6 px-6">
      <div className="flex items-center gap-3 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <ChevronRight className="size-5 text-muted-foreground" />
    </button>
  )
}
