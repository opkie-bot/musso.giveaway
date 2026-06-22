export type ActionType = 'facebook' | 'instagram' | 'review' | 'referral'

export interface Patient {
  id: string
  full_name: string
  dob: string
  created_at: string
}

export interface Giveaway {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface Entry {
  id: string
  patient_id: string
  giveaway_id: string
  action_type: ActionType
  points_awarded: number
  created_at: string
}
