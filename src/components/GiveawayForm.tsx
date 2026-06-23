'use client'

import { useState } from 'react'
import { createGiveaway } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function GiveawayForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await createGiveaway(formData)

    if (!result.success) {
      setError(result.error || 'Failed to create giveaway')
    } else {
      setSuccess(true)
      router.refresh()
      // Reset form
      const form = document.getElementById('giveaway-form') as HTMLFormElement
      form?.reset()
    }
    setIsLoading(false)
  }

  return (
    <form id="giveaway-form" action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900"
          placeholder="Q1 2024 Giveaway"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 resize-none"
          placeholder="Win a free teeth whitening treatment!"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">
          Giveaway created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#1e3a5f] hover:bg-[#152a45] disabled:bg-[#2a4a73] text-white font-medium py-3 px-4 rounded-xl transition-colors"
      >
        {isLoading ? 'Creating...' : 'Create Giveaway'}
      </button>
    </form>
  )
}
