"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import {
  useStore,
  type FileCategory,
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

  const categoryKey = category as FileCategory
  const files = getFilesByCategory(categoryKey)

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
            {files.length} {files.length === 1 ? "document" : "documents"}
          </p>
        </div>
      </header>

      {/* Files List */}
      {files.length === 0 ? (
        <Empty
          title="No files yet"
          description="Upload your first document to get started"
          action={
            <Link href="/upload">
              <Button>Upload Document</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.type)
            const isOpen = openFileId === file.id

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
