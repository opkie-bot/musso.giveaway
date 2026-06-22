'use client'

import { useState } from 'react'
import { logReferral } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface ReferralFormProps {
  hasActiveGiveaway: boolean
}

export default function ReferralForm({ hasActiveGiveaway }: ReferralFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await logReferral(formData)

    if (!result.success) {
      setError(result.error || 'Failed to log referral')
    } else {
      setSuccess(true)
      router.refresh()
      // Reset form
      const form = document.getElementById('referral-form') as HTMLFormElement
      form?.reset()
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    }
    setIsLoading(false)
  }

  if (!hasActiveGiveaway) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Activate a giveaway to log referrals
      </div>
    )
  }

  return (
    <form id="referral-form" action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="referral-fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Patient Full Name
        </label>
        <input
          type="text"
          id="referral-fullName"
          name="fullName"
          required
          autoComplete="off"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-gray-900"
          placeholder="John Smith"
        />
      </div>

      <div>
        <label htmlFor="referral-dob" className="block text-sm font-medium text-gray-700 mb-1">
          Patient Date of Birth
        </label>
        <input
          type="date"
          id="referral-dob"
          name="dob"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-gray-900"
        />
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
          Referral logged! +10 entries awarded.
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
      >
        {isLoading ? 'Logging...' : 'Log Referral (+10 entries)'}
      </button>
    </form>
  )
}
