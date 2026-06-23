'use client'

import { useState } from 'react'
import { verifyAdminPassword } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await verifyAdminPassword(formData)

    if (!result.success) {
      setError(result.error || 'Invalid password')
      setIsLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
          placeholder="Enter admin password"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#1e3a5f] hover:bg-[#152a45] disabled:bg-[#2a4a73] text-white font-medium py-3 px-4 rounded-xl transition-colors"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
