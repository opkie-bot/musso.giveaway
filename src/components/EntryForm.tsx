'use client'

import { useState, useEffect, useRef } from 'react'
import { searchPatients, logEntryForPatient, logEntry } from '@/app/actions'
import { useRouter } from 'next/navigation'
import type { Patient } from '@/types/database'

interface EntryFormProps {
  hasActiveGiveaway: boolean
}

const ACTION_OPTIONS = [
  { value: 'referral', label: 'Patient Referral', points: 10 },
  { value: 'facebook', label: 'Facebook Follow', points: 1 },
  { value: 'instagram', label: 'Instagram Follow', points: 1 },
  { value: 'review', label: 'Google Review', points: 5 },
]

export default function EntryForm({ hasActiveGiveaway }: EntryFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState('referral')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isNewPatient, setIsNewPatient] = useState(false)
  const [newPatientDob, setNewPatientDob] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Search patients as user types
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2 && !selectedPatient) {
        setIsSearching(true)
        const results = await searchPatients(searchQuery)
        setSearchResults(results)
        setShowDropdown(true)
        setIsSearching(false)
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, selectedPatient])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectPatient(patient: Patient) {
    setSelectedPatient(patient)
    setSearchQuery(patient.full_name)
    setShowDropdown(false)
    setIsNewPatient(false)
  }

  function clearSelection() {
    setSelectedPatient(null)
    setSearchQuery('')
    setIsNewPatient(false)
    setNewPatientDob('')
  }

  function handleNewPatient() {
    setIsNewPatient(true)
    setSelectedPatient(null)
    setShowDropdown(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    let result

    if (selectedPatient) {
      // Log entry for existing patient
      result = await logEntryForPatient(selectedPatient.id, selectedAction as 'facebook' | 'instagram' | 'review' | 'referral')
    } else if (isNewPatient && searchQuery && newPatientDob) {
      // Create new patient and log entry
      const formData = new FormData()
      formData.set('fullName', searchQuery)
      formData.set('dob', newPatientDob)
      formData.set('actionType', selectedAction)
      result = await logEntry(formData)
    } else {
      setError('Please select a patient or create a new one')
      setIsLoading(false)
      return
    }

    if (!result.success) {
      setError(result.error || 'Failed to log entry')
    } else {
      setSuccess(true)
      router.refresh()
      // Reset form
      clearSelection()
      setSelectedAction('referral')
      setTimeout(() => setSuccess(false), 3000)
    }
    setIsLoading(false)
  }

  if (!hasActiveGiveaway) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Activate a giveaway to log entries
      </div>
    )
  }

  const selectedOption = ACTION_OPTIONS.find(a => a.value === selectedAction)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Search */}
      <div ref={searchRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Patient
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (selectedPatient) {
                setSelectedPatient(null)
              }
              setIsNewPatient(false)
            }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 pr-10"
            placeholder="Start typing patient name..."
          />
          {selectedPatient && (
            <button
              type="button"
              onClick={clearSelection}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              <>
                {searchResults.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => selectPatient(patient)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{patient.full_name}</div>
                      <div className="text-sm text-gray-500">
                        DOB: {new Date(patient.dob).toLocaleDateString()}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleNewPatient}
                  className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-2 text-[#274c32] font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add &quot;{searchQuery}&quot; as new patient
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNewPatient}
                className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-2 text-[#274c32] font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add &quot;{searchQuery}&quot; as new patient
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected Patient Display */}
      {selectedPatient && (
        <div className="bg-[#274c32]/10 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="font-medium text-[#274c32]">{selectedPatient.full_name}</div>
            <div className="text-sm text-[#274c32]/70">
              DOB: {new Date(selectedPatient.dob).toLocaleDateString()}
            </div>
          </div>
          <svg className="w-5 h-5 text-[#274c32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* New Patient DOB */}
      {isNewPatient && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Patient Date of Birth
          </label>
          <input
            type="date"
            value={newPatientDob}
            onChange={(e) => setNewPatientDob(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900"
          />
        </div>
      )}

      {/* Entry Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Entry Type
        </label>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#274c32] focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-900 bg-white"
        >
          {ACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} (+{option.points} {option.points === 1 ? 'entry' : 'entries'})
            </option>
          ))}
        </select>
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
          Entry logged! +{selectedOption?.points} {selectedOption?.points === 1 ? 'entry' : 'entries'} awarded.
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || (!selectedPatient && !isNewPatient)}
        className="w-full bg-[#274c32] hover:bg-[#1a3322] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
      >
        {isLoading ? 'Logging...' : `Log Entry (+${selectedOption?.points} ${selectedOption?.points === 1 ? 'entry' : 'entries'})`}
      </button>
    </form>
  )
}
