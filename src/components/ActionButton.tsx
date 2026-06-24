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
  featured?: boolean
}

export default function ActionButton({ actionType, label, points, url, isClaimed, icon, featured = false }: ActionButtonProps) {
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

  // Featured unclaimed styling
  const getFeaturedUnclaimedStyles = () => {
    if (!featured || claimed) return ''
    return 'ring-2 ring-amber-400/50 border-amber-200 bg-gradient-to-br from-amber-50/80 to-orange-50/50'
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`relative group w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
        claimed
          ? 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60 shadow-sm'
          : `bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300/80 ${getFeaturedUnclaimedStyles()}`
      }`}
    >
      {/* Featured badge */}
      {featured && !claimed && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          HIGH VALUE
        </div>
      )}

      <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
        claimed
          ? 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600'
          : featured
            ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 group-hover:from-amber-200 group-hover:to-orange-200'
            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-600'
      }`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className={`font-semibold tracking-tight transition-colors duration-200 ${
          claimed
            ? 'text-emerald-700'
            : featured
              ? 'text-amber-800 group-hover:text-amber-900'
              : 'text-slate-800 group-hover:text-slate-900'
        }`}>
          {label}
        </div>
        <div className={`text-sm font-medium ${
          claimed
            ? 'text-emerald-600'
            : featured
              ? 'text-amber-600'
              : 'text-slate-500'
        }`}>
          {claimed ? (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Earned
            </span>
          ) : (
            <span className={featured ? 'font-bold' : ''}>+{points} {points === 1 ? 'entry' : 'entries'}</span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        {claimed ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            featured
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm'
              : 'bg-slate-100 group-hover:bg-[#274c32] group-hover:text-white'
          }`}>
            <svg className={`w-4 h-4 transition-colors duration-200 ${
              featured ? 'text-white' : 'text-slate-400 group-hover:text-white'
            }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}
