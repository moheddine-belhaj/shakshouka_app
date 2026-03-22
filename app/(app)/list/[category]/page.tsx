"use client"

import { use, useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Empty } from "@/components/ui/empty"
import {
  ArrowLeft,
  FileText,
  Image,
  ChevronDown,
  ExternalLink,
  Info,
  Trash2,
  Search,
  X,
} from "lucide-react"
import {
  useStore,
  type FileCategory,
  type DocumentFile,
  categoryLabels,
  categoryColors,
} from "@/lib/store"
import { format } from "date-fns"

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = use(params)
  const { getFilesByCategory, removeFile } = useStore()
  const [openFileId, setOpenFileId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const categoryKey = category as FileCategory
  const allFiles = getFilesByCategory(categoryKey)

  // Filter files based on search query
  const files = useMemo(() => {
    if (!searchQuery.trim()) return allFiles

    const query = searchQuery.toLowerCase()
    
    return allFiles.filter((file) => {
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
      
      // Search in recipient name
      if (file.recipient?.name?.toLowerCase().includes(query)) return true
      
      // Search by date (format: "Mar 2026", "March", "2026", etc.)
      const uploadDateStr = format(file.uploadDate, "MMMM yyyy").toLowerCase()
      if (uploadDateStr.includes(query)) return true
      
      // Search by deadline date
      if (file.deadline) {
        const deadlineStr = format(file.deadline, "MMMM yyyy").toLowerCase()
        if (deadlineStr.includes(query)) return true
      }
      
      // Search in actions required
      if (file.actions_required?.some((a) => a.action.toLowerCase().includes(query))) return true
      
      // Search in financial information (amount)
      if (file.financial_information?.amount_due) {
        const amountStr = file.financial_information.amount_due.toString()
        if (amountStr.includes(query)) return true
      }
      
      // Search in key dates descriptions
      if (file.key_dates?.some((d) => d.description.toLowerCase().includes(query))) return true
      
      // Search in risks and warnings
      if (file.risks_and_warnings?.some((r) => r.description.toLowerCase().includes(query))) return true
      
      // Search in contacts
      if (file.contacts?.some((c) => 
        c["department/purpose"]?.toLowerCase().includes(query) ||
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query)
      )) return true
      
      return false
    })
  }, [searchQuery, allFiles])

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image
      default:
        return FileText
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getMatchHighlight = (file: DocumentFile): string | null => {
    if (!searchQuery.trim()) return null
    
    const query = searchQuery.toLowerCase()
    
    // Return what matched for context
    if (file.summary?.toLowerCase().includes(query)) {
      return "Matched in summary"
    }
    if (file.raw_key_phrases?.some((p) => p.toLowerCase().includes(query))) {
      return "Matched in keywords"
    }
    if (file.sender?.name?.toLowerCase().includes(query)) {
      return `From: ${file.sender.name}`
    }
    if (file.categories?.some((c) => c.toLowerCase().includes(query))) {
      const matchedCat = file.categories.find((c) => c.toLowerCase().includes(query))
      return `Tag: ${matchedCat}`
    }
    return null
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="flex items-center gap-3 py-2">
        <Link href="/list">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {categoryLabels[categoryKey] || category}
          </h1>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? `${files.length} of ${allFiles.length}` : allFiles.length}{" "}
            {allFiles.length === 1 ? "document" : "documents"}
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by keyword, date, sender..."
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

      {/* Files List */}
      {allFiles.length === 0 ? (
        <Empty
          title="No files yet"
          description="Upload your first document to get started"
          action={
            <Link href="/upload">
              <Button>Upload Document</Button>
            </Link>
          }
        />
      ) : files.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No files match your search</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.type)
            const isOpen = openFileId === file.id
            const matchHighlight = getMatchHighlight(file)

            return (
              <Collapsible
                key={file.id}
                open={isOpen}
                onOpenChange={(open) => setOpenFileId(open ? file.id : null)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardContent className="flex items-center gap-3 py-3 cursor-pointer">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${categoryColors[categoryKey]}`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(file.uploadDate, "MMM d, yyyy")} ·{" "}
                          {formatFileSize(file.size)}
                        </p>
                        {matchHighlight && (
                          <p className="text-xs text-primary mt-0.5 truncate">
                            {matchHighlight}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={`size-5 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-4 flex gap-2">
                      <Link href={`/list/${category}/${file.id}`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          <Info className="size-4" />
                          Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => {
                          if (file.url && file.url !== "#") {
                            window.open(file.url, "_blank")
                          }
                        }}
                      >
                        <ExternalLink className="size-4" />
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive shrink-0"
                        onClick={() => {
                          removeFile(file.id)
                          setOpenFileId(null)
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          })}
        </div>
      )}
    </main>
  )
}
