"use client"

import { createContext, useContext, useState, useCallback } from "react"

export type FileCategory = "insurance" | "homework" | "tv-radio-tax" | "post-mail"

export interface DocumentFile {
  id: string
  name: string
  category: FileCategory
  type: "pdf" | "txt" | "image"
  uploadDate: Date
  size: number
  url: string
  deadline?: Date
  notes?: string
}

export interface Event {
  id: string
  title: string
  date: Date
  category: FileCategory
  description?: string
  isImportant: boolean
  documentId?: string
}

interface StoreContextType {
  files: DocumentFile[]
  events: Event[]
  addFile: (file: Omit<DocumentFile, "id" | "uploadDate">) => DocumentFile
  removeFile: (id: string) => void
  addEvent: (event: Omit<Event, "id">) => Event
  removeEvent: (id: string) => void
  getFilesByCategory: (category: FileCategory) => DocumentFile[]
  getUpcomingEvents: () => Event[]
  getImportantEvents: () => Event[]
}

const StoreContext = createContext<StoreContextType | null>(null)

// Sample data
const initialFiles: DocumentFile[] = [
  {
    id: "1",
    name: "Health Insurance Policy 2026",
    category: "insurance",
    type: "pdf",
    uploadDate: new Date("2026-01-15"),
    size: 245000,
    url: "#",
    deadline: new Date("2026-12-31"),
  },
  {
    id: "2",
    name: "Car Insurance Certificate",
    category: "insurance",
    type: "pdf",
    uploadDate: new Date("2026-02-10"),
    size: 128000,
    url: "#",
    deadline: new Date("2026-06-30"),
  },
  {
    id: "3",
    name: "Math Assignment Week 5",
    category: "homework",
    type: "pdf",
    uploadDate: new Date("2026-03-18"),
    size: 52000,
    url: "#",
    deadline: new Date("2026-03-25"),
  },
  {
    id: "4",
    name: "TV License Payment",
    category: "tv-radio-tax",
    type: "image",
    uploadDate: new Date("2026-03-01"),
    size: 340000,
    url: "#",
    deadline: new Date("2026-04-01"),
  },
  {
    id: "5",
    name: "Utility Bill March",
    category: "post-mail",
    type: "pdf",
    uploadDate: new Date("2026-03-10"),
    size: 85000,
    url: "#",
    deadline: new Date("2026-03-31"),
  },
]

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Insurance Renewal Due",
    date: new Date("2026-03-28"),
    category: "insurance",
    description: "Health insurance policy needs renewal",
    isImportant: true,
    documentId: "1",
  },
  {
    id: "2",
    title: "Homework Submission",
    date: new Date("2026-03-25"),
    category: "homework",
    description: "Math assignment week 5 due",
    isImportant: true,
    documentId: "3",
  },
  {
    id: "3",
    title: "TV License Payment",
    date: new Date("2026-04-01"),
    category: "tv-radio-tax",
    description: "Annual TV license payment due",
    isImportant: true,
    documentId: "4",
  },
  {
    id: "4",
    title: "Utility Bill Due",
    date: new Date("2026-03-31"),
    category: "post-mail",
    description: "March utility bill payment",
    isImportant: false,
    documentId: "5",
  },
  {
    id: "5",
    title: "Car Insurance Review",
    date: new Date("2026-06-15"),
    category: "insurance",
    description: "Review car insurance options",
    isImportant: false,
    documentId: "2",
  },
]

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<DocumentFile[]>(initialFiles)
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const addFile = useCallback((file: Omit<DocumentFile, "id" | "uploadDate">) => {
    const newFile: DocumentFile = {
      ...file,
      id: Date.now().toString(),
      uploadDate: new Date(),
    }
    setFiles((prev) => [...prev, newFile])
    return newFile
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const addEvent = useCallback((event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }, [])

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const getFilesByCategory = useCallback(
    (category: FileCategory) => files.filter((f) => f.category === category),
    [files]
  )

  const getUpcomingEvents = useCallback(() => {
    const now = new Date()
    return events
      .filter((e) => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [events])

  const getImportantEvents = useCallback(() => {
    const now = new Date()
    return events
      .filter((e) => e.isImportant && e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [events])

  return (
    <StoreContext.Provider
      value={{
        files,
        events,
        addFile,
        removeFile,
        addEvent,
        removeEvent,
        getFilesByCategory,
        getUpcomingEvents,
        getImportantEvents,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}

export const categoryLabels: Record<FileCategory, string> = {
  insurance: "Insurance",
  homework: "Homework",
  "tv-radio-tax": "TV/Radio Tax",
  "post-mail": "Post Mail",
}

export const categoryColors: Record<FileCategory, string> = {
  insurance: "bg-blue-500/20 text-blue-400",
  homework: "bg-amber-500/20 text-amber-400",
  "tv-radio-tax": "bg-emerald-500/20 text-emerald-400",
  "post-mail": "bg-rose-500/20 text-rose-400",
}
