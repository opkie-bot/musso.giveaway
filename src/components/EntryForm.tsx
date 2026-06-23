'use client'

import { useState } from 'react'
import { logEntry } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface EntryFormProps {
  hasActiveGiveaway: boolean
}

const ACTION_OPTIONS = [
  { value: 'referral', label: 'Patient Referral', points: 10 },
  { value: 'facebook', label: 'Facebook Follow', points: 1 },
  { value: 'instagram', label: 'Instagram Follow', points: 1 },
  { value: 'review', label: 'Google Review', points: 5 },
]

export default function EntryForm({ hasActiveGiveaway }: EntryFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState('referral')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await logEntry(formData)

    if (!result.success) {
      setError(result.error || 'Failed to log entry')
    } else {
      setSuccess(true)
      router.refresh()
      // Reset form
      const form = document.getElementById('entry-form') as HTMLFormElement
      form?.reset()
      setSelectedAction('referral')
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    }
    setIsLoading(false)
  }

  if (!hasActiveGiveaway) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Activate a giveaway to log entries
      </div>
    )
  }

  const selectedOption = ACTION_OPTIONS.find(a => a.value === selectedAction)

  return (
    <form id="entry-form" action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="entry-fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Patient Full Name
        </label>
        <input
          type="text"
          id="entry-fullName"
          name="fullName"
          required
          autoComplete="off"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900"
          placeholder="John Smith"
        />
      </div>

      <div>
        <label htmlFor="entry-dob" className="block text-sm font-medium text-gray-700 mb-1">
          Patient Date of Birth
        </label>
        <input
          type="date"
          id="entry-dob"
          name="dob"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="entry-actionType" className="block text-sm font-medium text-gray-700 mb-1">
          Entry Type
        </label>
        <select
          id="entry-actionType"
          name="actionType"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 bg-white"
        >
          {ACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} (+{option.points} {option.points === 1 ? 'entry' : 'entries'})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Entry logged! +{selectedOption?.points} {selectedOption?.points === 1 ? 'entry' : 'entries'} awarded.
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#274c32] hover:bg-[#1a3322] disabled:bg-[#3d6b4a] text-white font-medium py-3 px-4 rounded-xl transition-colors"
      >
        {isLoading ? 'Logging...' : `Log Entry (+${selectedOption?.points} ${selectedOption?.points === 1 ? 'entry' : 'entries'})`}
      </button>
    </form>
  )
}
