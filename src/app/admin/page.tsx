import { isAdminAuthenticated, getAllGiveaways, getActiveGiveaway, getParticipantSummary, logoutAdmin, getGiveawayImages } from '@/app/actions'
import AdminLoginForm from '@/components/AdminLoginForm'
import GiveawayForm from '@/components/GiveawayForm'
import GiveawayList from '@/components/GiveawayList'
import EntryForm from '@/components/EntryForm'
import ParticipantList from '@/components/ParticipantList'
import GiveawayImageManager from '@/components/GiveawayImageManager'
import ActiveGiveawayCard from '@/components/ActiveGiveawayCard'
import Image from 'next/image'

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/logo.webp"
              alt="Musso Family Dentistry"
              width={180}
              height={54}
              className="mx-auto mb-4"
            />
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e3a5f] rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Staff Login</h1>
            <p className="text-gray-600 mt-1">Enter your admin password</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <AdminLoginForm />
          </div>
        </div>
      </main>
    )
  }

  const giveaways = await getAllGiveaways()
  const activeGiveaway = await getActiveGiveaway()
  const participants = await getParticipantSummary()
  const activeGiveawayImages = activeGiveaway ? await getGiveawayImages(activeGiveaway.id) : []

  return (
    <main className="flex-1 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Manage giveaways and log patient entries</p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Active Giveaway Status */}
            {activeGiveaway ? (
              <ActiveGiveawayCard
                giveaway={activeGiveaway}
                participantCount={participants.length}
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-yellow-800">No Active Giveaway</h3>
                <p className="text-yellow-700 text-sm mt-1">Create and activate a giveaway to get started</p>
              </div>
            )}

            {/* Log Entry */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">Log Patient Entry</h2>
              <p className="text-gray-600 text-sm mb-4">
                Award entries to patients for referrals, social follows, or reviews.
              </p>
              <EntryForm hasActiveGiveaway={!!activeGiveaway} />
            </div>

            {/* Leaderboard */}
            {activeGiveaway && participants.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">Leaderboard</h2>
                <ParticipantList participants={participants} />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Prize Images */}
            {activeGiveaway && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">Prize Images</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Add images to showcase what patients can win. These will display on the patient dashboard.
                </p>
                <GiveawayImageManager giveaway={activeGiveaway} images={activeGiveawayImages} />
              </div>
            )}

            {/* Create Giveaway */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">Create New Giveaway</h2>
              <GiveawayForm />
            </div>

            {/* Giveaway List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">All Giveaways</h2>
              <GiveawayList giveaways={giveaways} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
