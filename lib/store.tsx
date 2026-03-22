"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

export type FileCategory = "insurance" | "homework" | "tv-radio-tax" | "post-mail"

export interface ContactInfo {
  phone: string | null
  email: string | null
  web: string | null
  reference_number: string | null
}

export interface Sender {
  name: string
  department?: string
  address?: string
  contact_info?: ContactInfo
}

export interface Recipient {
  name?: string
  address?: string
  account_reference?: string
}

export interface Urgency {
  level: "low" | "medium" | "high"
  reasoning: string
}

export interface ActionRequired {
  action: string
  priority: "low" | "normal" | "high"
  deadline: string | null
  completion_status: "pending" | "completed"
  estimated_time: string
}

export interface FinancialInformation {
  amount_due: number | null
  currency: string
  payment_due_date: string | null
}

export interface Contact {
  "department/purpose": string
  name: string | null
  phone: string | null
  email: string | null
  hours: string | null
  reference_code: string | null
}

export interface KeyDate {
  date?: string
  description: string
  significance: "effective_date" | "event" | "expiration" | "other"
}

export interface RiskWarning {
  type: "financial" | "legal" | "health" | "other"
  description: string
  severity: "low" | "medium" | "high"
}

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
  // New fields from the structured data
  summary?: string
  sender?: Sender
  recipient?: Recipient
  urgency?: Urgency
  actions_required?: ActionRequired[]
  financial_information?: FinancialInformation
  contacts?: Contact[]
  key_dates?: KeyDate[]
  categories?: string[]
  risks_and_warnings?: RiskWarning[]
  attachments_referenced?: string[]
  raw_key_phrases?: string[]
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

// Raw types from JSON (dates as strings)
interface RawDocumentFile extends Omit<DocumentFile, "uploadDate" | "deadline"> {
  uploadDate: string
  deadline?: string
}

interface RawEvent extends Omit<Event, "date"> {
  date: string
}

interface StoreContextType {
  files: DocumentFile[]
  events: Event[]
  isLoading: boolean
  addFile: (file: Omit<DocumentFile, "id" | "uploadDate">) => DocumentFile
  removeFile: (id: string) => void
  addEvent: (event: Omit<Event, "id">) => Event
  removeEvent: (id: string) => void
  getFilesByCategory: (category: FileCategory) => DocumentFile[]
  getUpcomingEvents: () => Event[]
  getImportantEvents: () => Event[]
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data from JSON file on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/data.json")
        const data = await response.json()
        
        // Convert date strings to Date objects for files
        const parsedFiles: DocumentFile[] = data.files.map((file: RawDocumentFile) => ({
          ...file,
          uploadDate: new Date(file.uploadDate),
          deadline: file.deadline ? new Date(file.deadline) : undefined,
        }))
        
        // Convert date strings to Date objects for events
        const parsedEvents: Event[] = data.events.map((event: RawEvent) => ({
          ...event,
          date: new Date(event.date),
        }))
        
        setFiles(parsedFiles)
        setEvents(parsedEvents)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

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
        isLoading,
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
