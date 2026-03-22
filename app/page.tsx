"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Calendar, FolderOpen } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()

  const handleContinue = () => {
    router.push("/home")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-background">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-sm">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative size-32 shrink-0">
            <Image
              src="/shakshoukaAI.png"
              alt="shakshoukAI"
              width={256}
              height={256}
              className="size-32 object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">shakshoukAI</h1>
            <p className="text-muted-foreground mt-2">Your personal document manager</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-4 w-full">
          <FeatureItem
            icon={<FolderOpen className="size-5 text-primary" />}
            title="Organize Documents"
            description="Keep all your files sorted by category"
          />
          <FeatureItem
            icon={<Calendar className="size-5 text-primary" />}
            title="Track Deadlines"
            description="Never miss important dates and events"
          />
          <FeatureItem
            icon={<Shield className="size-5 text-primary" />}
            title="Secure Storage"
            description="Your documents are safe and private"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-sm pb-8">
        <Button
          onClick={handleContinue}
          className="w-full h-14 text-lg font-semibold rounded-xl"
          size="lg"
        >
          Get Started
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          No account needed to get started
        </p>
      </div>
    </main>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
