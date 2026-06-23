import type { Patient, Entry, ActionType } from '@/types/database'

interface ParticipantListProps {
  participants: Array<{
    patient: Patient
    totalPoints: number
    entries: Entry[]
  }>
}

const ACTION_LABELS: Record<ActionType, string> = {
  facebook: 'FB',
  instagram: 'IG',
  review: 'Review',
  referral: 'Referral',
}

const ACTION_COLORS: Record<ActionType, string> = {
  facebook: 'bg-blue-100 text-blue-700',
  instagram: 'bg-pink-100 text-pink-700',
  review: 'bg-yellow-100 text-yellow-700',
  referral: 'bg-green-100 text-green-700',
}

function getActionCounts(entries: Entry[]): Record<ActionType, number> {
  const counts: Record<ActionType, number> = {
    facebook: 0,
    instagram: 0,
    review: 0,
    referral: 0,
  }
  for (const entry of entries) {
    counts[entry.action_type]++
  }
  return counts
}

export default function ParticipantList({ participants }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No entries yet
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto">
      {participants.map((participant, index) => {
        const actionCounts = getActionCounts(participant.entries)
        const activeActions = (Object.entries(actionCounts) as [ActionType, number][])
          .filter(([, count]) => count > 0)

        return (
          <div
            key={participant.patient.id}
            className={`p-4 rounded-xl border-2 ${
              index === 0
                ? 'bg-yellow-50 border-yellow-200'
                : index === 1
                ? 'bg-gray-50 border-gray-200'
                : index === 2
                ? 'bg-orange-50 border-orange-200'
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                index === 0
                  ? 'bg-yellow-200 text-yellow-800'
                  : index === 1
                  ? 'bg-gray-300 text-gray-700'
                  : index === 2
                  ? 'bg-orange-200 text-orange-800'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {index + 1}
              </div>

              {/* Patient Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-gray-900 truncate">
                    {participant.patient.full_name}
                  </div>
                  <div className="flex-shrink-0 text-[#274c32] font-bold text-lg">
                    {participant.totalPoints} <span className="text-sm font-normal">entries</span>
                  </div>
                </div>

                {/* Action Breakdown */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeActions.map(([action, count]) => (
                    <span
                      key={action}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[action]}`}
                    >
                      {ACTION_LABELS[action]}{count > 1 ? ` x${count}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
