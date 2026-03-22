"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

// FileCategory is now dynamic - can be any string
export type FileCategory = string

// Default categories that are always available
export const DEFAULT_CATEGORIES: FileCategory[] = [
  "insurance",
  "homework", 
  "tv-radio-tax",
  "post-mail"
]

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type APIResponse = any

interface StoreContextType {
  files: DocumentFile[]
  events: Event[]
  categories: FileCategory[]
  isLoading: boolean
  addFile: (file: Omit<DocumentFile, "id" | "uploadDate">) => DocumentFile
  addFileFromAPI: (apiResponse: APIResponse, manualCategory?: FileCategory | null) => DocumentFile
  removeFile: (id: string) => void
  addEvent: (event: Omit<Event, "id">) => Event
  removeEvent: (id: string) => void
  addCategory: (category: FileCategory) => void
  getFilesByCategory: (category: FileCategory) => DocumentFile[]
  getUpcomingEvents: () => Event[]
  getImportantEvents: () => Event[]
  getCategoryLabel: (category: FileCategory) => string
  getCategoryColor: (category: FileCategory) => string
}

const StoreContext = createContext<StoreContextType | null>(null)

// Helper to normalize category string (lowercase, replace spaces with dashes)
function normalizeCategory(category: string): FileCategory {
  return category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

// Helper to get display label from category slug
function categoryToLabel(category: FileCategory): string {
  return category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Color palette for dynamic categories
const CATEGORY_COLOR_PALETTE = [
  "bg-blue-500/20 text-blue-400",
  "bg-amber-500/20 text-amber-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-rose-500/20 text-rose-400",
  "bg-purple-500/20 text-purple-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-orange-500/20 text-orange-400",
  "bg-pink-500/20 text-pink-400",
  "bg-indigo-500/20 text-indigo-400",
  "bg-teal-500/20 text-teal-400",
]

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<FileCategory[]>([...DEFAULT_CATEGORIES])
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
        
        // Extract unique categories from files and merge with defaults
        const fileCategories = parsedFiles.map(f => f.category)
        const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...fileCategories])]
        
        setFiles(parsedFiles)
        setEvents(parsedEvents)
        setCategories(allCategories)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const addCategory = useCallback((category: FileCategory) => {
    setCategories(prev => {
      if (prev.includes(category)) return prev
      return [...prev, category]
    })
  }, [])

  const addFile = useCallback((file: Omit<DocumentFile, "id" | "uploadDate">) => {
    const newFile: DocumentFile = {
      ...file,
      id: Date.now().toString(),
      uploadDate: new Date(),
    }
    // Ensure category exists
    setCategories(prev => {
      if (prev.includes(newFile.category)) return prev
      return [...prev, newFile.category]
    })
    setFiles((prev) => [...prev, newFile])
    return newFile
  }, [])

  // Add file from API response (n8n webhook)
  // If manualCategory is provided, use it; otherwise parse from API response
  const addFileFromAPI = useCallback((apiResponse: APIResponse, manualCategory?: FileCategory | null) => {
    // Determine category: manual override > API category > default
    let finalCategory: FileCategory = "post-mail" // default fallback
    
    if (manualCategory) {
      // User selected a specific category
      finalCategory = manualCategory
    } else if (apiResponse.category) {
      // API returned a category - normalize it
      finalCategory = normalizeCategory(apiResponse.category)
    } else if (apiResponse.categories && Array.isArray(apiResponse.categories) && apiResponse.categories.length > 0) {
      // Use first category from categories array
      finalCategory = normalizeCategory(apiResponse.categories[0])
    }
    
    // Ensure this category exists in our list
    setCategories(prev => {
      if (prev.includes(finalCategory)) return prev
      return [...prev, finalCategory]
    })

    const newFile: DocumentFile = {
      id: Date.now().toString(),
      name: apiResponse.name || apiResponse.title || "Uploaded Document",
      category: finalCategory,
      type: apiResponse.type || "pdf",
      uploadDate: new Date(),
      size: apiResponse.size || 0,
      url: apiResponse.url || "#",
      deadline: apiResponse.deadline ? new Date(apiResponse.deadline) : undefined,
      notes: apiResponse.notes,
      summary: apiResponse.summary,
      sender: apiResponse.sender,
      recipient: apiResponse.recipient,
      urgency: apiResponse.urgency,
      actions_required: apiResponse.actions_required,
      financial_information: apiResponse.financial_information,
      contacts: apiResponse.contacts,
      key_dates: apiResponse.key_dates,
      categories: apiResponse.categories,
      risks_and_warnings: apiResponse.risks_and_warnings,
      attachments_referenced: apiResponse.attachments_referenced,
      raw_key_phrases: apiResponse.raw_key_phrases,
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

  const getCategoryLabel = useCallback((category: FileCategory) => {
    return categoryToLabel(category)
  }, [])

  const getCategoryColor = useCallback((category: FileCategory) => {
    const index = categories.indexOf(category)
    if (index === -1) return CATEGORY_COLOR_PALETTE[0]
    return CATEGORY_COLOR_PALETTE[index % CATEGORY_COLOR_PALETTE.length]
  }, [categories])

  return (
    <StoreContext.Provider
      value={{
        files,
        events,
        categories,
        isLoading,
        addFile,
        addFileFromAPI,
        removeFile,
        addEvent,
        removeEvent,
        addCategory,
        getFilesByCategory,
        getUpcomingEvents,
        getImportantEvents,
        getCategoryLabel,
        getCategoryColor,
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

// Legacy exports for backward compatibility
export const categoryLabels: Record<string, string> = {
  insurance: "Insurance",
  homework: "Homework",
  "tv-radio-tax": "TV/Radio Tax",
  "post-mail": "Post Mail",
}

export const categoryColors: Record<string, string> = {
  insurance: "bg-blue-500/20 text-blue-400",
  homework: "bg-amber-500/20 text-amber-400",
  "tv-radio-tax": "bg-emerald-500/20 text-emerald-400",
  "post-mail": "bg-rose-500/20 text-rose-400",
}
