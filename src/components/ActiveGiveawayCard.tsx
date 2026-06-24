'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Giveaway } from '@/types/database'
import GiveawayEditForm from './GiveawayEditForm'
import { resetGiveawayEntries } from '@/app/actions'

interface ActiveGiveawayCardProps {
  giveaway: Giveaway
  participantCount: number
}

export default function ActiveGiveawayCard({ giveaway, participantCount }: ActiveGiveawayCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const router = useRouter()

  async function handleReset() {
    setIsResetting(true)
    const result = await resetGiveawayEntries(giveaway.id)
    if (result.success) {
      router.refresh()
    }
    setIsResetting(false)
    setConfirmReset(false)
  }

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2d5a3d] via-[#274c32] to-[#1a3322] rounded-2xl p-6 text-white shadow-xl shadow-green-900/20">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)`
          }} />
        </div>

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4 h-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-100/90">Active Giveaway</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                title="Edit giveaway"
              >
                <svg className="w-4 h-4 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="text-2xl font-bold tracking-tight mb-1">{giveaway.title}</div>

          <div className="flex items-center gap-2 text-green-200/80 text-sm mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(giveaway.start_date).toLocaleDateString()} - {new Date(giveaway.end_date).toLocaleDateString()}
          </div>

          <div className="pt-4 border-t border-green-400/30 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold tracking-tight">{participantCount}</div>
              <div className="text-green-200/80 text-sm">Total Participants</div>
            </div>

            {/* Reset Button */}
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {isResetting ? 'Resetting...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-green-100 text-xs font-medium transition-colors flex items-center gap-1.5"
                title="Reset all entries"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Entries
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <GiveawayEditForm
          giveaway={giveaway}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  )
}
