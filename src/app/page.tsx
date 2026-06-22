import { getActiveGiveaway, getCurrentPatient } from './actions'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default async function HomePage() {
  // Check if patient is already logged in
  const patient = await getCurrentPatient()
  if (patient) {
    redirect('/dashboard')
  }

  const giveaway = await getActiveGiveaway()

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Musso Family Dentistry</h1>
          <p className="text-gray-600 mt-1">Quarterly Giveaway</p>
        </div>

        {/* Giveaway Info Card */}
        {giveaway ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 text-teal-600 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Active Giveaway</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{giveaway.title}</h2>
            {giveaway.description && (
              <p className="text-gray-600 text-sm mb-3">{giveaway.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                Ends {new Date(giveaway.end_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6 text-center">
            <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-lg font-semibold text-yellow-800">No Active Giveaway</h2>
            <p className="text-yellow-700 text-sm mt-1">Check back soon for our next quarterly giveaway!</p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Check Your Entries</h3>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Enter your details as they appear in our records
        </p>
      </div>
    </main>
  )
}
