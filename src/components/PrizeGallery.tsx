'use client'

import { useState } from 'react'
import type { GiveawayImage } from '@/types/database'
import Image from 'next/image'

interface PrizeGalleryProps {
  images: GiveawayImage[]
}

export default function PrizeGallery({ images }: PrizeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-3 overflow-hidden">
      <h2 className="text-sm font-semibold text-[#1e3a5f] mb-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Prize Package
      </h2>

      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-2">
        <Image
          src={images[activeIndex].image_url}
          alt="Prize"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? 'border-[#274c32] ring-2 ring-[#274c32]/20'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.image_url}
                alt={`Prize ${index + 1}`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
