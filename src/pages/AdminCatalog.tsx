import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { catalogApi, type CatalogImage } from "@/lib/api"
import { Upload, ImageIcon } from "lucide-react"

export default function AdminCatalog() {
  const [images, setImages] = useState<CatalogImage[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({ name: "", image_url: "" })

  useEffect(() => {
    setLoading(true)
    catalogApi
      .getAll()
      .then(setImages)
      .catch(() => setError("Failed to load catalog images."))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.image_url.trim()) return
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const created = await catalogApi.create(form)
      setImages((prev) => [created, ...prev])
      setForm({ name: "", image_url: "" })
      setSuccess("Image uploaded successfully!")
    } catch {
      setError("Failed to upload image.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg">
          <Upload className="size-5 text-[#FF9900]" />
          Upload AWS Service Image
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Service name (e.g. Amazon S3)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
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
            {submitting ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg">
          <ImageIcon className="size-5 text-[#FF9900]" />
          AWS Service Catalog
        </h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : images.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images yet. Upload one above.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center"
              >
                <img
                  src={img.image_url}
                  alt={img.name}
                  className="size-16 object-contain"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://placehold.co/64x64?text=?")
                  }
                />
                <span className="text-xs font-medium leading-tight">{img.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
