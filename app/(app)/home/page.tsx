"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CalendarDays, Clock } from "lucide-react"
import { useStore, categoryLabels, categoryColors } from "@/lib/store"
import { format, isSameDay } from "date-fns"

export default function HomePage() {
  const { getImportantEvents, getUpcomingEvents, events } = useStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  
  const importantEvents = getImportantEvents().slice(0, 3)
  const upcomingEvents = getUpcomingEvents().slice(0, 5)
  
  // Get dates that have events for calendar highlighting
  const eventDates = events.map((e) => e.date)

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">shakshoukAI</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
        </div>
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="size-5 text-primary" />
        </div>
      </header>

      {/* Important Notifications Bar */}
      {importantEvents.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <Bell className="size-4" />
              Important Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col gap-2">
              {importantEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(event.date, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={categoryColors[event.category]}
                  >
                    {categoryLabels[event.category]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-lg"
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersClassNames={{
              hasEvent: "bg-primary/20 font-semibold",
            }}
          />
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming events
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    isSameDay(event.date, selectedDate || new Date())
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center min-w-[48px] p-2 rounded-lg bg-muted">
                    <span className="text-xs text-muted-foreground">
                      {format(event.date, "MMM")}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {format(event.date, "d")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {event.description}
                      </p>
                    )}
                    <Badge
                      variant="secondary"
                      className={`mt-2 ${categoryColors[event.category]}`}
                    >
                      {categoryLabels[event.category]}
                    </Badge>
                  </div>
                  {event.isImportant && (
                    <div className="size-2 rounded-full bg-destructive shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
