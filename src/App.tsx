import { useState } from "react"
import AdminCatalog from "@/pages/AdminCatalog"
import CommunityEvents from "@/pages/CommunityEvents"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "catalog", label: "AWS Service Catalog" },
  { id: "events", label: "Community Events" },
] as const

type Tab = (typeof TABS)[number]["id"]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("catalog")

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#FF9900]">
            <span className="text-xs font-bold text-white">AWS</span>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">AWS Event Catalog</h1>
            <p className="text-xs text-muted-foreground">Community Hub</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-[#FF9900] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === "catalog" ? <AdminCatalog /> : <CommunityEvents />}
      </main>
    </div>
  )
}
