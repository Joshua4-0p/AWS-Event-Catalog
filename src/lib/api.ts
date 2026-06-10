const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const API_KEY = import.meta.env.VITE_API_KEY as string

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
}

export type CatalogImage = {
  id: string
  name: string
  image_url: string
}

export type CommunityEvent = {
  id: string
  communityName: string
  communityType: string
  eventName: string
  eventDate: string
  imageUrl: string
}

// AWS_Catalog_Image endpoints
export const catalogApi = {
  getAll: (): Promise<CatalogImage[]> =>
    fetch(`${BASE_URL}/catalog-images`, { headers }).then((r) => r.json()),

  create: (data: Omit<CatalogImage, "id">): Promise<CatalogImage> =>
    fetch(`${BASE_URL}/catalog-images`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }).then((r) => r.json()),
}

// AWS_Event_Catalog endpoints
export const eventApi = {
  getAll: (): Promise<CommunityEvent[]> =>
    fetch(`${BASE_URL}/events`, { headers }).then((r) => r.json()),

  create: (data: Omit<CommunityEvent, "id">): Promise<CommunityEvent> =>
    fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }).then((r) => r.json()),
}
