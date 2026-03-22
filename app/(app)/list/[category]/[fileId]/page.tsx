"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  AlertTriangle,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  DollarSign,
  CheckCircle2,
  Circle,
  ChevronDown,
  AlertCircle,
  Info,
} from "lucide-react"
import {
  useStore,
  type FileCategory,
  categoryLabels,
  categoryColors,
} from "@/lib/store"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

const urgencyColors = {
  low: "bg-emerald-500/20 text-emerald-400",
  medium: "bg-amber-500/20 text-amber-400",
  high: "bg-red-500/20 text-red-400",
}

const priorityColors = {
  low: "text-muted-foreground",
  normal: "text-foreground",
  high: "text-amber-400",
}

const severityColors = {
  low: "border-emerald-500/30 bg-emerald-500/10",
  medium: "border-amber-500/30 bg-amber-500/10",
  high: "border-red-500/30 bg-red-500/10",
}

export default function FileDetailPage({
  params,
}: {
  params: Promise<{ category: string; fileId: string }>
}) {
  const { category, fileId } = use(params)
  const router = useRouter()
  const { files, removeFile } = useStore()
  const [expandedSections, setExpandedSections] = useState<string[]>(["summary", "actions"])

  const file = files.find((f) => f.id === fileId)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

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
    <main className="flex flex-col gap-4 p-4 pb-24">
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

      {/* Preview Card with Urgency */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div
            className={`size-16 rounded-2xl flex items-center justify-center ${
              categoryColors[file.category]
            }`}
          >
            <Icon className="size-8" />
          </div>
          <h2 className="text-base font-semibold text-foreground mt-3 text-center px-4 text-balance">
            {file.name}
          </h2>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <Badge variant="secondary" className={categoryColors[file.category]}>
              {categoryLabels[file.category]}
            </Badge>
            {file.urgency && (
              <Badge variant="secondary" className={urgencyColors[file.urgency.level]}>
                {file.urgency.level.charAt(0).toUpperCase() + file.urgency.level.slice(1)} Priority
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      {file.summary && (
        <Collapsible open={expandedSections.includes("summary")} onOpenChange={() => toggleSection("summary")}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Info className="size-4 text-primary" />
                    Summary
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${expandedSections.includes("summary") ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {file.summary}
                </p>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Financial Information */}
      {file.financial_information && file.financial_information.amount_due && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <DollarSign className="size-4" />
              Payment Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">
                {file.financial_information.currency === "EUR" ? "€" : "$"}
                {file.financial_information.amount_due.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                {file.financial_information.currency}
              </span>
            </div>
            {file.financial_information.payment_due_date && (
              <p className="text-sm text-muted-foreground mt-1">
                Due: {format(new Date(file.financial_information.payment_due_date), "MMMM d, yyyy")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions Required */}
      {file.actions_required && file.actions_required.length > 0 && (
        <Collapsible open={expandedSections.includes("actions")} onOpenChange={() => toggleSection("actions")}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    Actions Required ({file.actions_required.length})
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${expandedSections.includes("actions") ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {file.actions_required.map((action, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    {action.completion_status === "completed" ? (
                      <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${priorityColors[action.priority]} ${action.completion_status === "completed" ? "line-through opacity-60" : ""}`}>
                        {action.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {action.priority} priority
                        </Badge>
                        {action.estimated_time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {action.estimated_time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Risks & Warnings */}
      {file.risks_and_warnings && file.risks_and_warnings.length > 0 && (
        <Collapsible open={expandedSections.includes("risks")} onOpenChange={() => toggleSection("risks")}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-400" />
                    Risks & Warnings ({file.risks_and_warnings.length})
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${expandedSections.includes("risks") ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-2">
                {file.risks_and_warnings.map((risk, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${severityColors[risk.severity]}`}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">{risk.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">{risk.type}</Badge>
                          <Badge variant="outline" className="text-xs capitalize">{risk.severity} severity</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Key Dates */}
      {file.key_dates && file.key_dates.length > 0 && (
        <Collapsible open={expandedSections.includes("dates")} onOpenChange={() => toggleSection("dates")}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    Key Dates ({file.key_dates.length})
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${expandedSections.includes("dates") ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {file.key_dates.map((keyDate, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{keyDate.description}</p>
                      {keyDate.date && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(keyDate.date), "MMMM d, yyyy")}
                        </p>
                      )}
                      <Badge variant="outline" className="text-xs mt-1 capitalize">
                        {keyDate.significance.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Sender Information */}
      {file.sender && (
        <Collapsible open={expandedSections.includes("sender")} onOpenChange={() => toggleSection("sender")}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building className="size-4 text-primary" />
                    Sender
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${expandedSections.includes("sender") ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <p className="font-medium text-foreground">{file.sender.name}</p>
                  {file.sender.department && (
                    <p className="text-sm text-muted-foreground">{file.sender.department}</p>
                  )}
                  {file.sender.address && (
                    <p className="text-sm text-muted-foreground mt-1">{file.sender.address}</p>
                  )}
                </div>
                {file.sender.contact_info && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    {file.sender.contact_info.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="size-4 text-muted-foreground" />
                        <a href={`mailto:${file.sender.contact_info.email}`} className="text-primary hover:underline">
                          {file.sender.contact_info.email}
                        </a>
                      </div>
                    )}
                    {file.sender.contact_info.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="size-4 text-muted-foreground" />
                        <a href={`tel:${file.sender.contact_info.phone}`} className="text-primary hover:underline">
                          {file.sender.contact_info.phone}
                        </a>
                      </div>
                    )}
                    {file.sender.contact_info.web && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="size-4 text-muted-foreground" />
                        <a href={`https://${file.sender.contact_info.web}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {file.sender.contact_info.web}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Recipient Information */}
      {file.recipient && (file.recipient.name || file.recipient.account_reference) && (
        <Collapsible open={expandedSections.includes("recipient")} onOpenChange={() => toggleSection("recipient")}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    Recipient
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${expandedSections.includes("recipient") ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                {file.recipient.name && (
                  <p className="font-medium text-foreground">{file.recipient.name}</p>
                )}
                {file.recipient.address && (
                  <p className="text-sm text-muted-foreground">{file.recipient.address}</p>
                )}
                {file.recipient.account_reference && (
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {file.recipient.account_reference}
                  </p>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Contacts */}
      {file.contacts && file.contacts.length > 0 && (
        <Collapsible open={expandedSections.includes("contacts")} onOpenChange={() => toggleSection("contacts")}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone className="size-4 text-primary" />
                    Contacts ({file.contacts.length})
                  </span>
                  <ChevronDown className={`size-4 transition-transform ${expandedSections.includes("contacts") ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {file.contacts.map((contact, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <p className="text-sm font-medium text-foreground">{contact["department/purpose"]}</p>
                    {contact.name && (
                      <p className="text-sm text-muted-foreground">{contact.name}</p>
                    )}
                    <div className="space-y-1">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="size-3 text-muted-foreground" />
                          <a href={`mailto:${contact.email}`} className="text-primary hover:underline text-xs">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-3 text-muted-foreground" />
                          <a href={`tel:${contact.phone}`} className="text-primary hover:underline text-xs">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {contact.hours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="size-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{contact.hours}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* File Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            File Information
          </CardTitle>
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

      {/* Categories Tags */}
      {file.categories && file.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {file.categories.map((cat, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {cat.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-2">
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
