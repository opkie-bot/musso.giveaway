import { getActiveGiveaway, getCurrentPatient } from './actions'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import Image from 'next/image'

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
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo.webp"
            alt="Musso Family Dentistry"
            width={200}
            height={60}
            className="mx-auto mb-4"
            priority
          />
          <p className="text-[#274c32] font-medium mt-2">Quarterly Giveaway</p>
        </div>

        {/* Giveaway Info Card */}
        {giveaway ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 text-[#274c32] mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Active Giveaway</span>
            </div>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-2">{giveaway.title}</h2>
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
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-1">Enter to Win or Check Entries</h3>
          <p className="text-slate-500 text-sm mb-4">
            New here? Enter your info to create an account and start earning entries!
          </p>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-6">
          Enter your details as they appear in our records
        </p>

        {/* Admin Link */}
        <div className="text-center mt-8">
          <a
            href="/admin"
            className="text-slate-400 hover:text-slate-600 text-xs transition-colors"
          >
            Staff Login
          </a>
        </div>
      </div>
    </main>
  )
}
