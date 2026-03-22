"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Camera, FileText, X, Check, Loader2, AlertCircle } from "lucide-react"
import { useStore, type FileCategory, categoryLabels } from "@/lib/store"

const PHOTO_WEBHOOK_URL = "https://akramguediri.app.n8n.cloud/webhook-test/photo"
const FILE_WEBHOOK_URL = "https://akramguediri.app.n8n.cloud/webhook-test/upload"

export default function UploadPage() {
  const router = useRouter()
  const { addFileFromAPI } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [category, setCategory] = useState<FileCategory>("post-mail")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    setError(null)
    setUploadStatus("Preparing upload...")
    
    try {
      const isImage = selectedFile.type.startsWith("image/")
      const webhookUrl = isImage ? PHOTO_WEBHOOK_URL : FILE_WEBHOOK_URL
      
      setUploadStatus(isImage ? "Uploading photo..." : "Uploading document...")
      
      // Create FormData and append the file
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("category", category)
      
      // Send to n8n webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`)
      }
      
      setUploadStatus("Processing response...")
      
      // Parse the response - expecting document metadata from n8n
      const responseData = await response.json()
      
      // Add the file to the store using the API response
      addFileFromAPI(responseData, category)
      
      setUploadStatus("Upload complete!")
      
      // Navigate to the list page after successful upload
      setTimeout(() => {
        router.push("/list")
      }, 500)
      
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload file")
      setUploadStatus("")
    } finally {
      setIsUploading(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    setUploadStatus("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="py-2">
        <h1 className="text-2xl font-bold text-foreground">Upload</h1>
        <p className="text-sm text-muted-foreground">
          Add a document or take a photo
        </p>
      </header>

      {/* Upload Options */}
      {!selectedFile ? (
        <div className="grid gap-4">
          {/* File Upload Card */}
          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="size-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Upload File</p>
                <p className="text-sm text-muted-foreground">
                  PDF, TXT, or any document
                </p>
              </div>
            </CardContent>
          </Card>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Camera Card */}
          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => cameraInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Camera className="size-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Take Photo</p>
                <p className="text-sm text-muted-foreground">
                  Capture a document with camera
                </p>
              </div>
            </CardContent>
          </Card>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        /* File Preview and Upload Form */
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Selected File
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelection}
                  className="size-8"
                  disabled={isUploading}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                  <FileText className="size-10 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as FileCategory)}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="flex items-center gap-3 py-4">
                <AlertCircle className="size-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Upload Status */}
          {uploadStatus && !error && (
            <Card className="border-primary/50">
              <CardContent className="flex items-center gap-3 py-4">
                <Loader2 className="size-5 text-primary animate-spin flex-shrink-0" />
                <p className="text-sm text-primary">{uploadStatus}</p>
              </CardContent>
            </Card>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="h-14 text-lg font-semibold rounded-xl"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="size-5 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      )}
    </main>
  )
}
