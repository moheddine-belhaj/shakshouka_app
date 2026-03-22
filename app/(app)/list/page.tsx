"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Shield, BookOpen, Tv, Mail } from "lucide-react"
import { useStore, type FileCategory, categoryLabels, categoryColors } from "@/lib/store"

const categoryIcons: Record<FileCategory, React.ElementType> = {
  insurance: Shield,
  homework: BookOpen,
  "tv-radio-tax": Tv,
  "post-mail": Mail,
}

const categories: FileCategory[] = ["insurance", "homework", "tv-radio-tax", "post-mail"]

export default function ListPage() {
  const { files } = useStore()

  const getFileCount = (category: FileCategory) => {
    return files.filter((f) => f.category === category).length
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="py-2">
        <h1 className="text-2xl font-bold text-foreground">Files</h1>
        <p className="text-sm text-muted-foreground">
          Browse your documents by category
        </p>
      </header>

      {/* Category Cards */}
      <div className="grid gap-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category]
          const count = getFileCount(category)
          
          return (
            <Link key={category} href={`/list/${category}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 py-4">
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center ${categoryColors[category]}`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {categoryLabels[category]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "file" : "files"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="mr-2">
                    {count}
                  </Badge>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Total Files Summary */}
      <Card className="mt-4">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold text-foreground">{files.length}</p>
            </div>
            <div className="flex gap-1">
              {categories.map((category) => {
                const count = getFileCount(category)
                if (count === 0) return null
                return (
                  <div
                    key={category}
                    className={`h-8 rounded-full ${categoryColors[category]}`}
                    style={{ width: `${Math.max(8, (count / files.length) * 80)}px` }}
                  />
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
