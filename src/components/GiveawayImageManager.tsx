'use client'

import { useState } from 'react'
import { addGiveawayImage, removeGiveawayImage } from '@/app/actions'
import { useRouter } from 'next/navigation'
import type { GiveawayImage, Giveaway } from '@/types/database'
import Image from 'next/image'

interface GiveawayImageManagerProps {
  giveaway: Giveaway
  images: GiveawayImage[]
}

const PRESET_IMAGES = [
  { url: '/prizes/prize-1.png', label: 'Folding Chairs' },
  { url: '/prizes/prize-2.png', label: 'Cooler Cart' },
  { url: '/prizes/prize-3.png', label: 'Cooler with Drinks' },
  { url: '/prizes/prize-4.png', label: 'Outdoor Cooler' },
]

export default function GiveawayImageManager({ giveaway, images }: GiveawayImageManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleAddImage(imageUrl: string) {
    setIsLoading(true)
    setError(null)

    const result = await addGiveawayImage(giveaway.id, imageUrl)

    if (!result.success) {
      setError(result.error || 'Failed to add image')
    } else {
      setCustomUrl('')
      router.refresh()
    }

    setIsLoading(false)
  }

  async function handleRemoveImage(imageId: string) {
    setIsLoading(true)
    setError(null)

    const result = await removeGiveawayImage(imageId)

    if (!result.success) {
      setError(result.error || 'Failed to remove image')
    } else {
      router.refresh()
    }

    setIsLoading(false)
  }

  const addedUrls = new Set(images.map(img => img.image_url))

  return (
    <div className="space-y-4">
      {/* Current Images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Prize Images</h4>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={image.image_url}
                    alt="Prize"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  disabled={isLoading}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Images */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Add Prize Images</h4>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_IMAGES.filter(preset => !addedUrls.has(preset.url)).map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => handleAddImage(preset.url)}
              disabled={isLoading}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#274c32] transition-colors disabled:opacity-50"
            >
              <Image
                src={preset.url}
                alt={preset.label}
                width={200}
                height={200}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                  + {preset.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom URL */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Or Add Custom Image URL</h4>
        <div className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none text-sm text-gray-900"
          />
          <button
            type="button"
            onClick={() => handleAddImage(customUrl)}
            disabled={isLoading || !customUrl}
            className="px-3 py-2 bg-[#274c32] text-white rounded-lg text-sm font-medium hover:bg-[#1a3322] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
