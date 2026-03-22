"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  FileText,
  Image,
  Calendar,
  Clock,
  HardDrive,
  Tag,
  ExternalLink,
  Trash2,
} from "lucide-react"
import {
  useStore,
  type FileCategory,
  categoryLabels,
  categoryColors,
} from "@/lib/store"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function FileDetailPage({
  params,
}: {
  params: Promise<{ category: string; fileId: string }>
}) {
  const { category, fileId } = use(params)
  const router = useRouter()
  const { files, removeFile } = useStore()

  const file = files.find((f) => f.id === fileId)

  if (!file) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <p className="text-muted-foreground">File not found</p>
        <Link href={`/list/${category}`}>
          <Button variant="link">Go back</Button>
        </Link>
      </main>
    )
  }

  const Icon = file.type === "image" ? Image : FileText

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleDelete = () => {
    removeFile(file.id)
    router.push(`/list/${category}`)
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="flex items-center gap-3 py-2">
        <Link href={`/list/${category}`}>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">
            {file.name}
          </h1>
          <p className="text-sm text-muted-foreground">Document Details</p>
        </div>
      </header>

      {/* Preview Card */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div
            className={`size-20 rounded-2xl flex items-center justify-center ${
              categoryColors[file.category]
            }`}
          >
            <Icon className="size-10" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mt-4 text-center px-4">
            {file.name}
          </h2>
          <Badge variant="secondary" className={`mt-2 ${categoryColors[file.category]}`}>
            {categoryLabels[file.category]}
          </Badge>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailRow
            icon={<Tag className="size-4 text-muted-foreground" />}
            label="Category"
            value={categoryLabels[file.category]}
          />
          <Separator />
          <DetailRow
            icon={<FileText className="size-4 text-muted-foreground" />}
            label="Type"
            value={file.type.toUpperCase()}
          />
          <Separator />
          <DetailRow
            icon={<HardDrive className="size-4 text-muted-foreground" />}
            label="Size"
            value={formatFileSize(file.size)}
          />
          <Separator />
          <DetailRow
            icon={<Clock className="size-4 text-muted-foreground" />}
            label="Uploaded"
            value={format(file.uploadDate, "MMMM d, yyyy")}
          />
          {file.deadline && (
            <>
              <Separator />
              <DetailRow
                icon={<Calendar className="size-4 text-muted-foreground" />}
                label="Deadline"
                value={format(file.deadline, "MMMM d, yyyy")}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <Button
          className="flex-1 h-12 gap-2"
          onClick={() => {
            if (file.url && file.url !== "#") {
              window.open(file.url, "_blank")
            }
          }}
        >
          <ExternalLink className="size-4" />
          Open File
        </Button>
        <Button
          variant="destructive"
          className="h-12 gap-2"
          onClick={handleDelete}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </main>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}
