'use client'

import { useState } from 'react'
import { toggleGiveawayActive, deactivateGiveaway } from '@/app/actions'
import { useRouter } from 'next/navigation'
import type { Giveaway } from '@/types/database'

interface GiveawayListProps {
  giveaways: Giveaway[]
}

export default function GiveawayList({ giveaways }: GiveawayListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  async function handleToggle(giveawayId: string, isCurrentlyActive: boolean) {
    setLoadingId(giveawayId)

    if (isCurrentlyActive) {
      await deactivateGiveaway(giveawayId)
    } else {
      await toggleGiveawayActive(giveawayId)
    }

    router.refresh()
    setLoadingId(null)
  }

  if (giveaways.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No giveaways created yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {giveaways.map((giveaway) => (
        <div
          key={giveaway.id}
          className={`p-4 rounded-xl border-2 ${
            giveaway.is_active
              ? 'border-teal-200 bg-teal-50'
              : 'border-gray-100 bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 truncate">{giveaway.title}</h3>
                {giveaway.is_active && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(giveaway.start_date).toLocaleDateString()} - {new Date(giveaway.end_date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleToggle(giveaway.id, giveaway.is_active)}
              disabled={loadingId === giveaway.id}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                giveaway.is_active
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              } disabled:opacity-50`}
            >
              {loadingId === giveaway.id
                ? '...'
                : giveaway.is_active
                ? 'Deactivate'
                : 'Activate'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
