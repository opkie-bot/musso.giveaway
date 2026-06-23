import { getCurrentPatient, getActiveGiveaway, getPatientTotalPoints, getPatientEntries, logoutPatient, getActiveGiveawayImages } from '@/app/actions'
import { redirect } from 'next/navigation'
import ActionButton from '@/components/ActionButton'
import Image from 'next/image'

export default async function DashboardPage() {
  const patient = await getCurrentPatient()
  if (!patient) {
    redirect('/')
  }

  const giveaway = await getActiveGiveaway()

  // If no active giveaway, show a message instead of redirecting
  if (!giveaway) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <Image
            src="/logo.webp"
            alt="Musso Family Dentistry"
            width={180}
            height={54}
            className="mx-auto mb-6"
          />
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
            <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-lg font-semibold text-yellow-800">No Active Giveaway</h2>
            <p className="text-yellow-700 text-sm mt-1">Check back soon for our next quarterly giveaway!</p>
          </div>
          <p className="text-gray-600 mb-4">Welcome, {patient.full_name}!</p>
          <form action={logoutPatient}>
            <button type="submit" className="text-[#274c32] hover:text-[#1a3322] font-medium">
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
    <main className="flex-1 flex flex-col px-4 py-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#1e3a5f]">Welcome back!</h1>
            <p className="text-gray-600 text-sm">{patient.full_name}</p>
          </div>
          <form action={logoutPatient}>
            <button
              type="submit"
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Points Card - Full Width */}
          <div className="col-span-2 bg-gradient-to-br from-[#274c32] to-[#1a3322] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span className="text-sm font-medium">{giveaway.title}</span>
                </div>
                <div className="text-5xl font-bold mb-1">{totalPoints}</div>
                <div className="text-green-100">Total Entries</div>
              </div>
              <div className="text-right text-sm text-green-100">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ends<br />
                {new Date(giveaway.end_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Prize Images - Bento Grid */}
          {prizeImages.length > 0 && (
            <>
              {prizeImages.length >= 1 && (
                <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-square">
                  <Image
                    src={prizeImages[0].image_url}
                    alt="Prize"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    PRIZE
                  </div>
                </div>
              )}
              {prizeImages.length >= 2 && (
                <div className="col-span-1 relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-square">
                  <Image
                    src={prizeImages[1].image_url}
                    alt="Prize"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                </div>
              )}
              {prizeImages.length >= 3 && (
                <div className="col-span-1 relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-square">
                  <Image
                    src={prizeImages[2].image_url}
                    alt="Prize"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                </div>
              )}
              {prizeImages.length >= 4 && (
                <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 h-40">
                  <Image
                    src={prizeImages[3].image_url}
                    alt="Prize"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}
            </>
          )}

          {/* Social Actions - 2 Column Grid */}
          <div className="col-span-1 bg-white rounded-2xl shadow-lg p-4">
            <ActionButton
              actionType="facebook"
              label="Facebook"
              points={1}
              url="https://www.facebook.com/mussofamilydentistry"
              isClaimed={claimedActions.has('facebook')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
            />
          </div>

          <div className="col-span-1 bg-white rounded-2xl shadow-lg p-4">
            <ActionButton
              actionType="instagram"
              label="Instagram"
              points={1}
              url="https://www.instagram.com/mussofamilydentistry"
              isClaimed={claimedActions.has('instagram')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              }
            />
          </div>

          {/* Google Review - Full Width */}
          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-4">
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

          {/* Referral Note - Full Width */}
          <div className="col-span-2 bg-[#1e3a5f] rounded-2xl p-4 text-center text-white">
            <p className="text-sm">
              <span className="font-semibold">Refer a friend!</span> Ask our front desk to log your referral for <strong>+10 entries</strong> each!
            </p>
          </div>

          {/* Entry History - Full Width */}
          {entries.length > 0 && (
            <div className="col-span-2 bg-white rounded-2xl shadow-lg p-4">
              <h2 className="text-sm font-semibold text-[#1e3a5f] mb-3">Your Activity</h2>
              <div className="space-y-2">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm font-medium">
                        {entry.action_type === 'facebook' && 'Facebook'}
                        {entry.action_type === 'instagram' && 'Instagram'}
                        {entry.action_type === 'review' && 'Google Review'}
                        {entry.action_type === 'referral' && 'Referral'}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className="text-[#274c32] font-semibold text-sm">+{entry.points_awarded}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
