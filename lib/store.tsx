"use client"

import { createContext, useContext, useState, useCallback } from "react"

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

// Sample data with the new structure
const initialFiles: DocumentFile[] = [
  {
    id: "1",
    name: "Rundfunkbeitrag Notice 2026",
    category: "tv-radio-tax",
    type: "pdf",
    uploadDate: new Date("2026-03-13"),
    size: 245000,
    url: "#",
    deadline: new Date("2026-04-01"),
    summary: "The document is a formal notice from ARD ZDF Deutschlandradio Beitragsservice informing the recipient that, effective March 1, 2026, businesses and certain organizations are legally required to pay the Rundfunkbeitrag (broadcasting contribution). The monthly contribution rate is €18.36, but for this case, an annual payment of €220.32 is due. Payment can be made using the provided Girocode via banking app or SEPA transfer.",
    sender: {
      name: "ARD ZDF Deutschlandradio Beitragsservice",
      department: "Beitragsservice",
      address: "ARD ZDF Deutschlandradio Beitragsservice, 50656 Köln",
      contact_info: {
        phone: null,
        email: "Gewerbe@rundfunkbeitrag.de",
        web: "www.rundfunkbeitrag.de/service",
        reference_number: null
      }
    },
    recipient: {
      account_reference: "Beitragsnummer 9841800849"
    },
    urgency: {
      level: "medium",
      reasoning: "The document communicates a legally mandated payment obligation and specifies an amount due. While no explicit payment due date is provided, failure to pay could lead to financial and legal consequences making the action time-sensitive."
    },
    actions_required: [
      {
        action: "Pay the annual Rundfunkbeitrag for business (220.32 EUR) as stated.",
        priority: "high",
        deadline: null,
        completion_status: "pending",
        estimated_time: "10 minutes"
      },
      {
        action: "Use provided payment methods (Girocode via banking app or SEPA transfer) and include the Beitragsnummer/reference when paying.",
        priority: "normal",
        deadline: null,
        completion_status: "pending",
        estimated_time: "5 minutes"
      },
      {
        action: "Contact Beitragsservice for questions or clarification using provided email/web.",
        priority: "low",
        deadline: null,
        completion_status: "pending",
        estimated_time: "15 minutes"
      }
    ],
    financial_information: {
      amount_due: 220.32,
      currency: "EUR",
      payment_due_date: null
    },
    contacts: [
      {
        "department/purpose": "Beitragsservice - Gewerbe enquiries / payment questions",
        name: null,
        phone: null,
        email: "Gewerbe@rundfunkbeitrag.de",
        hours: null,
        reference_code: "Beitragsnummer 9841800849"
      }
    ],
    key_dates: [
      {
        date: "2026-03-01",
        description: "Legal requirement effective date: since this date businesses/persons/corporations and associations are required to pay the Rundfunkbeitrag.",
        significance: "effective_date"
      },
      {
        date: "2026-03-13",
        description: "Date of the notice (Datum auf dem Schreiben).",
        significance: "event"
      }
    ],
    categories: ["payment_required", "action_needed", "informational", "legal_obligation"],
    risks_and_warnings: [
      {
        type: "financial",
        description: "Non-payment of the legally mandated Rundfunkbeitrag may lead to enforcement actions or penalties (implied legal/financial consequence).",
        severity: "medium"
      },
      {
        type: "legal",
        description: "Since the obligation stems from law (Rundfunkfinanzierungsstaatsvertrag) and registration via commercial register triggered chargeability, there is a legal requirement to pay.",
        severity: "medium"
      }
    ],
    attachments_referenced: [],
    raw_key_phrases: [
      "Seit dem 01. März 2026 sind alle Einzelunternehmen, Personen- und Kapitalgesellschaften sowie Vereine gesetzlich verpflichtet, den Rundfunkbeitrag zu leisten.",
      "Sie beträgt derzeit monatlich 18,36 Euro und ist in Ihrem Falle durch eine jährliche Zahlung von 220,32 Euro abzuführen.",
      "Datum 13.03.2026",
      "Beitragsnummer 9841800849",
      "Bezahlen mit Girocode"
    ]
  },
  {
    id: "2",
    name: "Bank Statement - March 2026",
    category: "post-mail",
    type: "pdf",
    uploadDate: new Date("2026-03-31"),
    size: 128000,
    url: "#",
    summary: "This document is a sample bank statement for Relationship Checking account #12345678, addressed to James C. Morrison. It summarizes account activity including deposits, withdrawals, interest, and fees for a period from early March to late March, showing an ending balance of $586.71. The statement includes key events such as preauthorized payroll and Social Security credits, a deposit terminal transaction, an interest credit, and a service charge.",
    recipient: {
      name: "James C. Morrison",
      address: "1765 Sheridan Drive, Your City, USA 03087",
      account_reference: "12345678"
    },
    urgency: {
      level: "low",
      reasoning: "The document is informational with no immediate payment due or critical action required, only suggestions like e-Statement enrollment."
    },
    actions_required: [
      {
        action: "Continue with e-Statement enrollment as suggested on the statement.",
        priority: "normal",
        deadline: null,
        completion_status: "pending",
        estimated_time: "10 minutes"
      },
      {
        action: "Review account transactions for accuracy (deposits, withdrawals, fees).",
        priority: "normal",
        deadline: null,
        completion_status: "pending",
        estimated_time: "15-30 minutes"
      }
    ],
    financial_information: {
      currency: "USD",
      amount_due: null,
      payment_due_date: null
    },
    key_dates: [
      {
        description: "Beginning balance on March 1 ($69.96).",
        significance: "effective_date"
      },
      {
        description: "Preauthorized credit (payroll) on 03/03 (amount $763.01).",
        significance: "event"
      },
      {
        description: "Preauthorized credit (US Treasury / Social Security) on 03/16 (amount $763.01).",
        significance: "event"
      },
      {
        description: "Preauthorized credit / deposit terminal on 03/24 (amount $350.00).",
        significance: "event"
      },
      {
        description: "Interest credit on 03/30 (amount $0.26).",
        significance: "other"
      },
      {
        description: "Service charge on 03/30 (amount $12.00).",
        significance: "event"
      },
      {
        description: "Ending balance on March 31 ($586.71).",
        significance: "expiration"
      }
    ],
    risks_and_warnings: [
      {
        type: "financial",
        description: "Service charge reduces account balance (03/30 SERVICE CHARGE $12.00).",
        severity: "low"
      },
      {
        type: "financial",
        description: "Possible unauthorized or incorrect transactions should be verified by account owner.",
        severity: "medium"
      }
    ],
    categories: ["informational", "account_statement", "action_needed", "deposit", "withdrawal", "fee"],
    attachments_referenced: ["Check images (not shown in this sample statement; will be included if applicable)"],
    raw_key_phrases: [
      "You have successfully opened a sample statement in PDF format. Please continue with your e-Statement enrollment.",
      "Statement of Account 12345678",
      "Summary of Your Account",
      "Beginning balance on March 1 $69.96",
      "Ending balance on March 31 $586.71"
    ]
  },
  {
    id: "3",
    name: "Health Insurance Policy 2026",
    category: "insurance",
    type: "pdf",
    uploadDate: new Date("2026-01-15"),
    size: 345000,
    url: "#",
    deadline: new Date("2026-12-31"),
    summary: "Annual health insurance policy document for the year 2026, outlining coverage details, premiums, deductibles, and terms of the insurance contract. This policy provides comprehensive health coverage including hospitalization, outpatient care, and prescription medications.",
    sender: {
      name: "HealthFirst Insurance AG",
      department: "Policy Services",
      address: "HealthFirst Insurance AG, Bahnhofstrasse 42, 8001 Zürich",
      contact_info: {
        phone: "+41 44 123 4567",
        email: "service@healthfirst.ch",
        web: "www.healthfirst.ch",
        reference_number: "POL-2026-78432"
      }
    },
    recipient: {
      name: "Max Mustermann",
      address: "Musterstrasse 123, 10115 Berlin",
      account_reference: "Customer ID: HF-29384"
    },
    urgency: {
      level: "low",
      reasoning: "The policy is valid for the entire year. No immediate action required unless changes or claims need to be filed."
    },
    actions_required: [
      {
        action: "Review policy terms and coverage limits for the new year.",
        priority: "normal",
        deadline: null,
        completion_status: "completed",
        estimated_time: "30 minutes"
      },
      {
        action: "Ensure monthly premium payments are set up correctly.",
        priority: "high",
        deadline: "2026-01-31",
        completion_status: "completed",
        estimated_time: "10 minutes"
      }
    ],
    financial_information: {
      amount_due: 450.00,
      currency: "EUR",
      payment_due_date: "2026-01-31"
    },
    contacts: [
      {
        "department/purpose": "Customer Service - General inquiries",
        name: "Customer Support Team",
        phone: "+41 44 123 4567",
        email: "service@healthfirst.ch",
        hours: "Mon-Fri 8:00-18:00",
        reference_code: "POL-2026-78432"
      },
      {
        "department/purpose": "Claims Department",
        name: null,
        phone: "+41 44 123 4568",
        email: "claims@healthfirst.ch",
        hours: "Mon-Fri 9:00-17:00",
        reference_code: null
      }
    ],
    key_dates: [
      {
        date: "2026-01-01",
        description: "Policy effective date - coverage begins.",
        significance: "effective_date"
      },
      {
        date: "2026-12-31",
        description: "Policy expiration date - renewal required.",
        significance: "expiration"
      }
    ],
    categories: ["insurance", "health", "annual_policy"],
    risks_and_warnings: [
      {
        type: "health",
        description: "Ensure all pre-existing conditions are properly declared to avoid claim rejections.",
        severity: "medium"
      }
    ],
    raw_key_phrases: [
      "Policy Number: POL-2026-78432",
      "Coverage Period: January 1, 2026 - December 31, 2026",
      "Monthly Premium: €450.00",
      "Annual Deductible: €500.00"
    ]
  },
  {
    id: "4",
    name: "Car Insurance Certificate",
    category: "insurance",
    type: "pdf",
    uploadDate: new Date("2026-02-10"),
    size: 198000,
    url: "#",
    deadline: new Date("2026-06-30"),
    summary: "Vehicle insurance certificate for a 2024 Volkswagen Golf, providing comprehensive coverage including liability, collision, and theft protection. The policy is valid until June 30, 2026, and requires renewal before expiration.",
    sender: {
      name: "AutoSafe Versicherung",
      department: "Vehicle Insurance",
      address: "AutoSafe Versicherung, Hauptstrasse 88, 80331 München",
      contact_info: {
        phone: "+49 89 555 1234",
        email: "auto@autosafe.de",
        web: "www.autosafe.de",
        reference_number: "AUTO-2026-55678"
      }
    },
    recipient: {
      name: "Max Mustermann",
      account_reference: "Vehicle: B-XX 1234"
    },
    urgency: {
      level: "medium",
      reasoning: "Policy expires in a few months. Renewal process should be initiated to avoid coverage gap."
    },
    actions_required: [
      {
        action: "Review renewal options before policy expiration.",
        priority: "high",
        deadline: "2026-06-15",
        completion_status: "pending",
        estimated_time: "20 minutes"
      },
      {
        action: "Compare insurance rates from other providers.",
        priority: "normal",
        deadline: null,
        completion_status: "pending",
        estimated_time: "1 hour"
      }
    ],
    financial_information: {
      amount_due: 89.50,
      currency: "EUR",
      payment_due_date: "2026-04-01"
    },
    key_dates: [
      {
        date: "2026-01-01",
        description: "Current policy period started.",
        significance: "effective_date"
      },
      {
        date: "2026-06-30",
        description: "Policy expiration - renewal required.",
        significance: "expiration"
      }
    ],
    categories: ["insurance", "vehicle", "renewal_required"],
    risks_and_warnings: [
      {
        type: "legal",
        description: "Driving without valid insurance is illegal and can result in fines and license suspension.",
        severity: "high"
      }
    ],
    raw_key_phrases: [
      "Policy Number: AUTO-2026-55678",
      "Vehicle: 2024 Volkswagen Golf",
      "License Plate: B-XX 1234",
      "Coverage: Comprehensive"
    ]
  },
  {
    id: "5",
    name: "Physics Assignment - Week 8",
    category: "homework",
    type: "pdf",
    uploadDate: new Date("2026-03-18"),
    size: 52000,
    url: "#",
    deadline: new Date("2026-03-28"),
    summary: "Physics homework assignment covering topics in thermodynamics and heat transfer. The assignment includes problem sets on entropy, heat engines, and thermal conductivity. Due by end of week 8.",
    sender: {
      name: "Prof. Dr. Schmidt",
      department: "Physics Department",
      address: "Technical University, Physics Building Room 302"
    },
    urgency: {
      level: "high",
      reasoning: "Assignment deadline is approaching within the next week. Requires completion and submission."
    },
    actions_required: [
      {
        action: "Complete all problem sets (Problems 1-5).",
        priority: "high",
        deadline: "2026-03-28",
        completion_status: "pending",
        estimated_time: "3 hours"
      },
      {
        action: "Submit via university portal before deadline.",
        priority: "high",
        deadline: "2026-03-28",
        completion_status: "pending",
        estimated_time: "5 minutes"
      }
    ],
    key_dates: [
      {
        date: "2026-03-18",
        description: "Assignment distributed.",
        significance: "effective_date"
      },
      {
        date: "2026-03-28",
        description: "Submission deadline.",
        significance: "expiration"
      }
    ],
    categories: ["homework", "physics", "deadline"],
    risks_and_warnings: [
      {
        type: "other",
        description: "Late submissions will receive a 10% grade penalty per day.",
        severity: "medium"
      }
    ],
    raw_key_phrases: [
      "Thermodynamics Problem Set",
      "Due: March 28, 2026",
      "Total Points: 50"
    ]
  },
  {
    id: "6",
    name: "Utility Bill - March 2026",
    category: "post-mail",
    type: "pdf",
    uploadDate: new Date("2026-03-10"),
    size: 85000,
    url: "#",
    deadline: new Date("2026-03-31"),
    summary: "Monthly utility bill for March 2026 covering electricity, gas, and water services. The bill shows increased energy consumption compared to the previous month due to heating requirements.",
    sender: {
      name: "Stadtwerke Berlin",
      department: "Billing Department",
      address: "Stadtwerke Berlin, Energieweg 15, 10178 Berlin",
      contact_info: {
        phone: "+49 30 267 0",
        email: "billing@stadtwerke-berlin.de",
        web: "www.stadtwerke-berlin.de",
        reference_number: "BILL-2026-03-44521"
      }
    },
    recipient: {
      name: "Max Mustermann",
      address: "Musterstrasse 123, 10115 Berlin",
      account_reference: "Customer #: SW-887744"
    },
    urgency: {
      level: "medium",
      reasoning: "Payment due date is approaching. Failure to pay may result in late fees or service interruption."
    },
    actions_required: [
      {
        action: "Pay the utility bill amount of €156.78 before due date.",
        priority: "high",
        deadline: "2026-03-31",
        completion_status: "pending",
        estimated_time: "5 minutes"
      },
      {
        action: "Set up automatic payments to avoid future late fees.",
        priority: "normal",
        deadline: null,
        completion_status: "pending",
        estimated_time: "15 minutes"
      }
    ],
    financial_information: {
      amount_due: 156.78,
      currency: "EUR",
      payment_due_date: "2026-03-31"
    },
    contacts: [
      {
        "department/purpose": "Customer Service",
        name: null,
        phone: "+49 30 267 0",
        email: "billing@stadtwerke-berlin.de",
        hours: "Mon-Fri 8:00-20:00",
        reference_code: "SW-887744"
      }
    ],
    key_dates: [
      {
        date: "2026-03-01",
        description: "Billing period start.",
        significance: "effective_date"
      },
      {
        date: "2026-03-31",
        description: "Payment due date.",
        significance: "expiration"
      }
    ],
    categories: ["payment_required", "utility", "monthly_bill"],
    risks_and_warnings: [
      {
        type: "financial",
        description: "Late payment will incur a €15.00 late fee.",
        severity: "low"
      },
      {
        type: "other",
        description: "Continued non-payment may result in service disconnection.",
        severity: "high"
      }
    ],
    raw_key_phrases: [
      "Invoice Number: BILL-2026-03-44521",
      "Total Amount Due: €156.78",
      "Payment Due: March 31, 2026",
      "Electricity: 245 kWh",
      "Gas: 58 m³"
    ]
  }
]

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Rundfunkbeitrag Payment Due",
    date: new Date("2026-04-01"),
    category: "tv-radio-tax",
    description: "Annual broadcasting contribution payment of €220.32 required",
    isImportant: true,
    documentId: "1",
  },
  {
    id: "2",
    title: "Physics Assignment Due",
    date: new Date("2026-03-28"),
    category: "homework",
    description: "Thermodynamics problem set submission deadline",
    isImportant: true,
    documentId: "5",
  },
  {
    id: "3",
    title: "Utility Bill Payment",
    date: new Date("2026-03-31"),
    category: "post-mail",
    description: "March utility bill payment of €156.78",
    isImportant: true,
    documentId: "6",
  },
  {
    id: "4",
    title: "Car Insurance Payment",
    date: new Date("2026-04-01"),
    category: "insurance",
    description: "Quarterly car insurance premium due",
    isImportant: false,
    documentId: "4",
  },
  {
    id: "5",
    title: "Car Insurance Renewal",
    date: new Date("2026-06-15"),
    category: "insurance",
    description: "Review and renew car insurance policy",
    isImportant: true,
    documentId: "4",
  },
  {
    id: "6",
    title: "Health Insurance Renewal",
    date: new Date("2026-12-15"),
    category: "insurance",
    description: "Annual health insurance policy renewal",
    isImportant: false,
    documentId: "3",
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
