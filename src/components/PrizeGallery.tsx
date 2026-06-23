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
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 overflow-hidden">
      <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        Prize Package
      </h2>

      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
        <Image
          src={images[activeIndex].image_url}
          alt="Prize"
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === activeIndex
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <Image
                src={image.image_url}
                alt={`Prize ${index + 1}`}
                width={56}
                height={56}
                className="w-full h-full object-contain bg-white p-0.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
