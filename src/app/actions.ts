'use server'

import { supabase } from '@/lib/supabase'
import type { ActionType, Patient, Giveaway, Entry, GiveawayImage } from '@/types/database'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const POINTS_MAP: Record<ActionType, number> = {
  facebook: 1,
  instagram: 1,
  review: 5,
  referral: 10,
}

// Get active giveaway
export async function getActiveGiveaway(): Promise<Giveaway | null> {
  const { data, error } = await supabase
    .from('giveaways')
    .select('*')
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as Giveaway
}

// Login or create patient
export async function loginPatient(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const fullName = formData.get('fullName')?.toString().trim()
  const dob = formData.get('dob')?.toString()

  if (!fullName || !dob) {
    return { success: false, error: 'Please enter your full name and date of birth.' }
  }

  // Check if patient exists
  let { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('full_name', fullName)
    .eq('dob', dob)
    .single()

  // If not, create new patient
  if (!patient) {
    const { data: newPatient, error } = await supabase
      .from('patients')
      .insert({ full_name: fullName, dob })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return { success: false, error: `Failed to create patient record: ${error.message}` }
    }
    patient = newPatient
  }

  // Store patient ID in cookie for session
  const cookieStore = await cookies()
  cookieStore.set('patient_id', patient.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect('/dashboard')
}

// Get current patient from session
export async function getCurrentPatient(): Promise<Patient | null> {
  const cookieStore = await cookies()
  const patientId = cookieStore.get('patient_id')?.value

  if (!patientId) return null

  const { data } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single()

  return data as Patient | null
}

// Get patient entries for active giveaway
export async function getPatientEntries(patientId: string, giveawayId: string): Promise<Entry[]> {
  const { data } = await supabase
    .from('entries')
    .select('*')
    .eq('patient_id', patientId)
    .eq('giveaway_id', giveawayId)

  return (data as Entry[]) || []
}

// Get total points for patient in giveaway
export async function getPatientTotalPoints(patientId: string, giveawayId: string): Promise<number> {
  const entries = await getPatientEntries(patientId, giveawayId)
  return entries.reduce((sum, entry) => sum + entry.points_awarded, 0)
}

// Check if patient has already claimed action
export async function hasClaimedAction(
  patientId: string,
  giveawayId: string,
  actionType: ActionType
): Promise<boolean> {
  const { data } = await supabase
    .from('entries')
    .select('id')
    .eq('patient_id', patientId)
    .eq('giveaway_id', giveawayId)
    .eq('action_type', actionType)
    .single()

  return !!data
}

// Claim action points
export async function claimAction(actionType: ActionType): Promise<{ success: boolean; error?: string; alreadyClaimed?: boolean }> {
  const patient = await getCurrentPatient()
  if (!patient) {
    return { success: false, error: 'Not logged in.' }
  }

  const giveaway = await getActiveGiveaway()
  if (!giveaway) {
    return { success: false, error: 'No active giveaway.' }
  }

  // Check if already claimed (for non-referral actions)
  if (actionType !== 'referral') {
    const claimed = await hasClaimedAction(patient.id, giveaway.id, actionType)
    if (claimed) {
      return { success: true, alreadyClaimed: true }
    }
  }

  const points = POINTS_MAP[actionType]

  const { error } = await supabase
    .from('entries')
    .insert({
      patient_id: patient.id,
      giveaway_id: giveaway.id,
      action_type: actionType,
      points_awarded: points,
    })

  if (error) {
    return { success: false, error: 'Failed to record entry.' }
  }

  return { success: true }
}

// Logout patient
export async function logoutPatient() {
  const cookieStore = await cookies()
  cookieStore.delete('patient_id')
  redirect('/')
}

// Admin: Verify admin password
export async function verifyAdminPassword(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const password = formData.get('password')?.toString()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return { success: false, error: 'Admin password not configured.' }
  }

  if (password !== adminPassword) {
    return { success: false, error: 'Invalid password.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  })

  return { success: true }
}

// Admin: Check if admin is authenticated
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

// Admin: Logout
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin')
}

// Admin: Get all giveaways
export async function getAllGiveaways(): Promise<Giveaway[]> {
  const { data } = await supabase
    .from('giveaways')
    .select('*')
    .order('created_at', { ascending: false })

  return (data as Giveaway[]) || []
}

// Admin: Create giveaway
export async function createGiveaway(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const title = formData.get('title')?.toString().trim()
  const description = formData.get('description')?.toString().trim() || null
  const startDate = formData.get('startDate')?.toString()
  const endDate = formData.get('endDate')?.toString()

  if (!title || !startDate || !endDate) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const { error } = await supabase
    .from('giveaways')
    .insert({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      is_active: false,
    })

  if (error) {
    return { success: false, error: 'Failed to create giveaway.' }
  }

  return { success: true }
}

// Admin: Update giveaway
export async function updateGiveaway(
  giveawayId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const title = formData.get('title')?.toString().trim()
  const description = formData.get('description')?.toString().trim() || null
  const startDate = formData.get('startDate')?.toString()
  const endDate = formData.get('endDate')?.toString()

  if (!title || !startDate || !endDate) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const { error } = await supabase
    .from('giveaways')
    .update({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
    })
    .eq('id', giveawayId)

  if (error) {
    return { success: false, error: 'Failed to update giveaway.' }
  }

  return { success: true }
}

// Admin: Toggle giveaway active status
export async function toggleGiveawayActive(giveawayId: string): Promise<{ success: boolean; error?: string }> {
  // First, set all giveaways to inactive
  await supabase
    .from('giveaways')
    .update({ is_active: false })
    .neq('id', '')

  // Then set the selected one to active
  const { error } = await supabase
    .from('giveaways')
    .update({ is_active: true })
    .eq('id', giveawayId)

  if (error) {
    return { success: false, error: 'Failed to activate giveaway.' }
  }

  return { success: true }
}

// Admin: Deactivate giveaway
export async function deactivateGiveaway(giveawayId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('giveaways')
    .update({ is_active: false })
    .eq('id', giveawayId)

  if (error) {
    return { success: false, error: 'Failed to deactivate giveaway.' }
  }

  return { success: true }
}

// Admin: Log any entry type for patient
export async function logEntry(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const fullName = formData.get('fullName')?.toString().trim()
  const dob = formData.get('dob')?.toString()
  const actionType = formData.get('actionType')?.toString() as ActionType

  if (!fullName || !dob || !actionType) {
    return { success: false, error: 'Please fill in all fields.' }
  }

  const giveaway = await getActiveGiveaway()
  if (!giveaway) {
    return { success: false, error: 'No active giveaway.' }
  }

  // Find or create patient
  let { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('full_name', fullName)
    .eq('dob', dob)
    .single()

  if (!patient) {
    const { data: newPatient, error } = await supabase
      .from('patients')
      .insert({ full_name: fullName, dob })
      .select()
      .single()

    if (error) {
      return { success: false, error: 'Failed to create patient record.' }
    }
    patient = newPatient
  }

  // For non-referral actions, check if already claimed
  if (actionType !== 'referral') {
    const alreadyClaimed = await hasClaimedAction(patient.id, giveaway.id, actionType)
    if (alreadyClaimed) {
      return { success: false, error: `Patient has already claimed ${actionType} for this giveaway.` }
    }
  }

  // Log the entry
  const { error } = await supabase
    .from('entries')
    .insert({
      patient_id: patient.id,
      giveaway_id: giveaway.id,
      action_type: actionType,
      points_awarded: POINTS_MAP[actionType],
    })

  if (error) {
    return { success: false, error: 'Failed to log entry.' }
  }

  return { success: true }
}

// Admin: Log referral for patient (legacy, kept for compatibility)
export async function logReferral(formData: FormData): Promise<{ success: boolean; error?: string }> {
  formData.set('actionType', 'referral')
  return logEntry(formData)
}

// Admin: Get all entries for active giveaway with patient info
export async function getActiveGiveawayEntries(): Promise<Array<Entry & { patient: Patient }>> {
  const giveaway = await getActiveGiveaway()
  if (!giveaway) return []

  const { data } = await supabase
    .from('entries')
    .select(`
      *,
      patient:patients(*)
    `)
    .eq('giveaway_id', giveaway.id)
    .order('created_at', { ascending: false })

  return (data as Array<Entry & { patient: Patient }>) || []
}

// Admin: Get participant summary for active giveaway
export async function getParticipantSummary(): Promise<Array<{ patient: Patient; totalPoints: number; entries: Entry[] }>> {
  const giveaway = await getActiveGiveaway()
  if (!giveaway) return []

  const { data: entries } = await supabase
    .from('entries')
    .select(`
      *,
      patient:patients(*)
    `)
    .eq('giveaway_id', giveaway.id)

  if (!entries) return []

  // Group by patient
  const patientMap = new Map<string, { patient: Patient; totalPoints: number; entries: Entry[] }>()

  for (const entry of entries as Array<Entry & { patient: Patient }>) {
    const existing = patientMap.get(entry.patient_id)
    if (existing) {
      existing.totalPoints += entry.points_awarded
      existing.entries.push(entry)
    } else {
      patientMap.set(entry.patient_id, {
        patient: entry.patient,
        totalPoints: entry.points_awarded,
        entries: [entry],
      })
    }
  }

  return Array.from(patientMap.values()).sort((a, b) => b.totalPoints - a.totalPoints)
}

// Admin: Search patients by name
export async function searchPatients(query: string): Promise<Patient[]> {
  if (!query || query.length < 2) return []

  const { data } = await supabase
    .from('patients')
    .select('*')
    .ilike('full_name', `%${query}%`)
    .order('full_name')
    .limit(10)

  return (data as Patient[]) || []
}

// Admin: Get all patients
export async function getAllPatients(): Promise<Patient[]> {
  const { data } = await supabase
    .from('patients')
    .select('*')
    .order('full_name')

  return (data as Patient[]) || []
}

// Admin: Log entry for existing patient by ID
export async function logEntryForPatient(
  patientId: string,
  actionType: ActionType
): Promise<{ success: boolean; error?: string }> {
  const giveaway = await getActiveGiveaway()
  if (!giveaway) {
    return { success: false, error: 'No active giveaway.' }
  }

  // For non-referral actions, check if already claimed
  if (actionType !== 'referral') {
    const alreadyClaimed = await hasClaimedAction(patientId, giveaway.id, actionType)
    if (alreadyClaimed) {
      return { success: false, error: `Patient has already claimed ${actionType} for this giveaway.` }
    }
  }

  const { error } = await supabase
    .from('entries')
    .insert({
      patient_id: patientId,
      giveaway_id: giveaway.id,
      action_type: actionType,
      points_awarded: POINTS_MAP[actionType],
    })

  if (error) {
    return { success: false, error: 'Failed to log entry.' }
  }

  return { success: true }
}

// Get images for a giveaway
export async function getGiveawayImages(giveawayId: string): Promise<GiveawayImage[]> {
  const { data } = await supabase
    .from('giveaway_images')
    .select('*')
    .eq('giveaway_id', giveawayId)
    .order('display_order')

  return (data as GiveawayImage[]) || []
}

// Get images for active giveaway
export async function getActiveGiveawayImages(): Promise<GiveawayImage[]> {
  const giveaway = await getActiveGiveaway()
  if (!giveaway) return []

  return getGiveawayImages(giveaway.id)
}

// Admin: Add image to giveaway
export async function addGiveawayImage(
  giveawayId: string,
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  // Get current max display order
  const { data: existingImages } = await supabase
    .from('giveaway_images')
    .select('display_order')
    .eq('giveaway_id', giveawayId)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = existingImages && existingImages.length > 0
    ? (existingImages[0] as { display_order: number }).display_order + 1
    : 0

  const { error } = await supabase
    .from('giveaway_images')
    .insert({
      giveaway_id: giveawayId,
      image_url: imageUrl,
      display_order: nextOrder,
    })

  if (error) {
    return { success: false, error: 'Failed to add image.' }
  }

  return { success: true }
}

// Admin: Remove image from giveaway
export async function removeGiveawayImage(imageId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('giveaway_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    return { success: false, error: 'Failed to remove image.' }
  }

  return { success: true }
}
