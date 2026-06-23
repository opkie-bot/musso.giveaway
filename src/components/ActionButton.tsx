'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { claimAction } from '@/app/actions'
import type { ActionType } from '@/types/database'

interface ActionButtonProps {
  actionType: ActionType
  label: string
  points: number
  url: string
  isClaimed: boolean
  icon: React.ReactNode
}

export default function ActionButton({ actionType, label, points, url, isClaimed, icon }: ActionButtonProps) {
  const [claimed, setClaimed] = useState(isClaimed)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    // Always open the external link
    window.open(url, '_blank', 'noopener,noreferrer')

    // If already claimed, don't try to claim again
    if (claimed) return

    setIsLoading(true)
    const result = await claimAction(actionType)

    if (result.success && !result.alreadyClaimed) {
      setClaimed(true)
      // Refresh the page data to update the total points
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
        claimed
          ? 'border-[#274c32]/30 bg-[#274c32]/10'
          : 'border-gray-100 hover:border-[#274c32]/30 hover:bg-[#274c32]/5'
      }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        claimed ? 'bg-[#274c32]/20 text-[#274c32]' : 'bg-gray-100 text-gray-600'
      }`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className={`font-medium ${claimed ? 'text-[#274c32]' : 'text-gray-900'}`}>
          {label}
        </div>
        <div className={`text-sm ${claimed ? 'text-[#274c32]' : 'text-gray-500'}`}>
          {claimed ? 'Completed' : `+${points} ${points === 1 ? 'entry' : 'entries'}`}
        </div>
      </div>
      <div className="flex-shrink-0">
        {claimed ? (
          <svg className="w-6 h-6 text-[#274c32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </div>
    </button>
  )
}
