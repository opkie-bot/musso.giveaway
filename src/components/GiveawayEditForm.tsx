'use client'

import { useState } from 'react'
import { updateGiveaway } from '@/app/actions'
import { useRouter } from 'next/navigation'
import type { Giveaway } from '@/types/database'

interface GiveawayEditFormProps {
  giveaway: Giveaway
  onClose: () => void
}

export default function GiveawayEditForm({ giveaway, onClose }: GiveawayEditFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await updateGiveaway(giveaway.id, formData)

    if (!result.success) {
      setError(result.error || 'Failed to update giveaway')
      setIsLoading(false)
    } else {
      router.refresh()
      onClose()
    }
  }

  // Format dates for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Edit Giveaway</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              required
              defaultValue={giveaway.title}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows={2}
              defaultValue={giveaway.description || ''}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-slate-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-startDate" className="block text-sm font-medium text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                id="edit-startDate"
                name="startDate"
                required
                defaultValue={formatDateForInput(giveaway.start_date)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="edit-endDate" className="block text-sm font-medium text-slate-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                id="edit-endDate"
                name="endDate"
                required
                defaultValue={formatDateForInput(giveaway.end_date)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#274c32] hover:bg-[#1a3322] disabled:bg-[#4a7a5a] text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
