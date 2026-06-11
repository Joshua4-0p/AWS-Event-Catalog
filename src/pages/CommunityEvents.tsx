import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { eventApi, type CommunityEvent } from "@/lib/api"
import { CalendarDays, Users } from "lucide-react"

const COMMUNITY_TYPES = [
  "AWS Student Builder Group",
  "AWS User Group",
  "AWS Community Builder",
  "AWS Cloud Club",
  "Other",
]

const emptyForm = {
  id: "",
  communityName: "",
  communityType: "",
  eventName: "",
  eventDate: "",
  imageUrl: "",
}

export default function CommunityEvents() {
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    setLoading(true)
    eventApi
      .getAll()
      .then(setEvents)
      .catch(() => setError("Failed to load events."))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const created = await eventApi.create(form)
      setEvents((prev) => [created, ...prev])
      setForm(emptyForm)
      setSuccess("Event uploaded successfully!")
    } catch {
      setError("Failed to upload event.")
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg">
          <CalendarDays className="size-5 text-[#FF9900]" />
          Submit Community Event
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="ID"
            value={form.id}
            onChange={(e) => field("id", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            required
          />
          <input
            type="text"
            placeholder="Community name (e.g. AWS UG Lagos)"
            value={form.communityName}
            onChange={(e) => field("communityName", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            required
          />
          <select
            value={form.communityType}
            onChange={(e) => field("communityType", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            required
          >
            <option value="" disabled>
              Select community type
            </option>
            {COMMUNITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Event name"
            value={form.eventName}
            onChange={(e) => field("eventName", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            required
          />
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => field("eventDate", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            required
          />
          <input
            type="url"
            placeholder="Event image URL"
            value={form.imageUrl}
            onChange={(e) => field("imageUrl", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
          <Button
            type="submit"
            disabled={submitting}
            size="sm"
            className="self-start bg-[#FF9900] text-white hover:bg-[#e68900]"
          >
            {submitting ? "Submitting..." : "Submit Event"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg">
          <Users className="size-5 text-[#FF9900]" />
          Community Events
        </h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events yet. Submit one above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <img
                  src={ev.imageUrl}
                  alt={ev.eventName}
                  className="h-40 w-full object-cover"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://placehold.co/400x160?text=No+Image")
                  }
                />
                <div className="p-4">
                  <p className="font-semibold">{ev.eventName}</p>
                  <p className="text-sm text-muted-foreground">{ev.communityName}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-[#FF9900]/10 px-2 py-0.5 text-xs font-medium text-[#FF9900]">
                      {ev.communityType}
                    </span>
                    <span className="text-xs text-muted-foreground">{ev.eventDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
