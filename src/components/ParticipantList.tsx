'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletePatient, resetPatientEntries } from '@/app/actions'
import type { Patient, Entry, ActionType } from '@/types/database'

interface ParticipantListProps {
  participants: Array<{
    patient: Patient
    totalPoints: number
    entries: Entry[]
  }>
  giveawayId: string
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

export default function ParticipantList({ participants, giveawayId }: ParticipantListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [resettingId, setResettingId] = useState<string | null>(null)
  const [confirmingResetId, setConfirmingResetId] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(patientId: string) {
    setDeletingId(patientId)
    const result = await deletePatient(patientId)
    if (result.success) {
      router.refresh()
    }
    setDeletingId(null)
    setConfirmingDeleteId(null)
  }

  async function handleReset(patientId: string) {
    setResettingId(patientId)
    const result = await resetPatientEntries(patientId, giveawayId)
    if (result.success) {
      router.refresh()
    }
    setResettingId(null)
    setConfirmingResetId(null)
  }

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
        const isConfirmingDelete = confirmingDeleteId === participant.patient.id
        const isDeleting = deletingId === participant.patient.id
        const isConfirmingReset = confirmingResetId === participant.patient.id
        const isResetting = resettingId === participant.patient.id

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
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 text-[#274c32] font-bold text-lg">
                      {participant.totalPoints} <span className="text-sm font-normal">entries</span>
                    </div>
                    {/* Action Buttons */}
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(participant.patient.id)}
                          disabled={isDeleting}
                          className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                          title="Confirm delete"
                        >
                          {isDeleting ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(null)}
                          className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : isConfirmingReset ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReset(participant.patient.id)}
                          disabled={isResetting}
                          className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50"
                          title="Confirm reset"
                        >
                          {isResetting ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmingResetId(null)}
                          className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {/* Reset Button */}
                        <button
                          onClick={() => setConfirmingResetId(participant.patient.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                          title="Reset entries"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => setConfirmingDeleteId(participant.patient.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete patient"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
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
