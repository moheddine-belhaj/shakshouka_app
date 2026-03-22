"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronRight, Shield, BookOpen, Tv, Mail, Search, X } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")

  const getFileCount = (category: FileCategory) => {
    return files.filter((f) => f.category === category).length
  }

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories

    const query = searchQuery.toLowerCase()
    
    return categories.filter((category) => {
      // Match category name/label
      const labelMatch = categoryLabels[category].toLowerCase().includes(query)
      if (labelMatch) return true

      // Match if any file in this category matches the search
      const categoryFiles = files.filter((f) => f.category === category)
      return categoryFiles.some((file) => {
        // Search in file name
        if (file.name.toLowerCase().includes(query)) return true
        // Search in summary
        if (file.summary?.toLowerCase().includes(query)) return true
        // Search in categories/tags
        if (file.categories?.some((c) => c.toLowerCase().includes(query))) return true
        // Search in raw key phrases
        if (file.raw_key_phrases?.some((p) => p.toLowerCase().includes(query))) return true
        // Search in sender name
        if (file.sender?.name?.toLowerCase().includes(query)) return true
        return false
      })
    })
  }, [searchQuery, files])

  const totalFilteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files.length
    return filteredCategories.reduce((sum, cat) => sum + getFileCount(cat), 0)
  }, [filteredCategories, searchQuery, files])

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="py-2">
        <h1 className="text-2xl font-bold text-foreground">Files</h1>
        <p className="text-sm text-muted-foreground">
          Browse your documents by category
        </p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-card border-border"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category Cards */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No categories match your search</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredCategories.map((category) => {
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
      )}

      {/* Total Files Summary */}
      <Card className="mt-4">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Matching Documents" : "Total Documents"}
              </p>
              <p className="text-2xl font-bold text-foreground">{totalFilteredFiles}</p>
            </div>
            <div className="flex gap-1">
              {filteredCategories.map((category) => {
                const count = getFileCount(category)
                if (count === 0) return null
                return (
                  <div
                    key={category}
                    className={`h-8 rounded-full ${categoryColors[category]}`}
                    style={{ width: `${Math.max(8, (count / Math.max(totalFilteredFiles, 1)) * 80)}px` }}
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
