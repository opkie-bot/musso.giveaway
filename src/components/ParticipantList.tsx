import type { Patient, Entry } from '@/types/database'

interface ParticipantListProps {
  participants: Array<{
    patient: Patient
    totalPoints: number
    entries: Entry[]
  }>
}

export default function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {participants.map((participant, index) => (
        <div
          key={participant.patient.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            index === 0
              ? 'bg-yellow-100 text-yellow-700'
              : index === 1
              ? 'bg-gray-200 text-gray-600'
              : index === 2
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {participant.patient.full_name}
            </div>
            <div className="text-xs text-gray-500">
              {participant.entries.length} action{participant.entries.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="flex-shrink-0 text-[#274c32] font-bold">
            {participant.totalPoints} pts
          </div>
        </div>
      ))}
    </div>
  )
}
