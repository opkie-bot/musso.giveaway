import { getCurrentPatient, getActiveGiveaway, getPatientTotalPoints, getPatientEntries, logoutPatient, getActiveGiveawayImages } from '@/app/actions'
import { redirect } from 'next/navigation'
import ActionButton from '@/components/ActionButton'
import PrizeGallery from '@/components/PrizeGallery'
import Image from 'next/image'

// Helper to capitalize names properly
function capitalizeName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default async function DashboardPage() {
  const patient = await getCurrentPatient()
  if (!patient) {
    redirect('/')
  }

  const giveaway = await getActiveGiveaway()

  // If no active giveaway, show a message instead of redirecting
  if (!giveaway) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-slate-50">
        <div className="w-full max-w-md text-center">
          <Image
            src="/logo.webp"
            alt="Musso Family Dentistry"
            width={180}
            height={54}
            className="mx-auto mb-6"
          />
          <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 mb-6 shadow-sm">
            <svg className="w-12 h-12 text-amber-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-lg font-semibold text-amber-800">No Active Giveaway</h2>
            <p className="text-amber-700 text-sm mt-1">Check back soon for our next quarterly giveaway!</p>
          </div>
          <p className="text-slate-600 mb-4">Welcome, {capitalizeName(patient.full_name)}!</p>
          <form action={logoutPatient}>
            <button type="submit" className="text-slate-400 hover:text-rose-500 font-medium transition-colors duration-200">
              Logout
            </button>
          </form>
        </div>
      </main>
    )
  }

  const totalPoints = await getPatientTotalPoints(patient.id, giveaway.id)
  const entries = await getPatientEntries(patient.id, giveaway.id)
  const prizeImages = await getActiveGiveawayImages()

  const claimedActions = new Set(entries.map(e => e.action_type))

  return (
    <main className="flex-1 flex flex-col px-4 py-8 bg-slate-50/80">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1e3a5f]">Welcome back!</h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">{capitalizeName(patient.full_name)}</p>
          </div>
          <form action={logoutPatient}>
            <button
              type="submit"
              className="text-slate-400 hover:text-rose-500 text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Content Stack */}
        <div className="space-y-4">
          {/* Scoreboard Card - Premium Green Gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d5a3d] via-[#274c32] to-[#1a3322] p-6 text-white shadow-xl shadow-green-900/20">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)`
              }} />
            </div>

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-green-100/90">{giveaway.title}</span>
                </div>
                <div className="text-6xl font-bold tracking-tight mb-1">{totalPoints}</div>
                <div className="text-green-200/80 text-sm font-medium">Total Entries</div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-green-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ends {new Date(giveaway.end_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards - Unified Stack */}
          <div className="space-y-3">
            <ActionButton
              actionType="facebook"
              label="Follow on Facebook"
              points={1}
              url="https://www.facebook.com/mussofamilydentistry"
              isClaimed={claimedActions.has('facebook')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
            />

            <ActionButton
              actionType="instagram"
              label="Follow on Instagram"
              points={1}
              url="https://www.instagram.com/mussofamilydentistry"
              isClaimed={claimedActions.has('instagram')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              }
            />

            <ActionButton
              actionType="review"
              label="Leave a Google Review"
              points={5}
              url="https://g.page/mussofamilydentistry/review"
              isClaimed={claimedActions.has('review')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              }
            />
          </div>

          {/* Referral Banner - Premium Navy */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#243f5c] via-[#1e3a5f] to-[#172d4a] px-6 py-5 text-white shadow-lg shadow-blue-900/15">
            {/* Subtle shine effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32" style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
              }} />
            </div>

            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-white">Refer a Friend</p>
                <p className="text-sm text-blue-200/80 mt-0.5">
                  Ask our front desk to log your referral for <span className="font-bold text-white">+10 entries</span> each!
                </p>
              </div>
            </div>
          </div>

          {/* Activity History */}
          {entries.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your Activity
              </h2>
              <div className="divide-y divide-slate-100">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        {entry.action_type === 'facebook' && (
                          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        )}
                        {entry.action_type === 'instagram' && (
                          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                          </svg>
                        )}
                        {entry.action_type === 'review' && (
                          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                        )}
                        {entry.action_type === 'referral' && (
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-700 text-sm font-medium">
                          {entry.action_type === 'facebook' && 'Facebook'}
                          {entry.action_type === 'instagram' && 'Instagram'}
                          {entry.action_type === 'review' && 'Google Review'}
                          {entry.action_type === 'referral' && 'Referral'}
                        </span>
                        <span className="text-slate-400 text-xs ml-2">
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-bold text-sm">+{entry.points_awarded}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prize Gallery */}
          {prizeImages.length > 0 && (
            <PrizeGallery images={prizeImages} />
          )}
        </div>
      </div>
    </main>
  )
}
