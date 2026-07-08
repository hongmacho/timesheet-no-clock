import 'server-only'

import { getDatabase } from '@/db'
import { timeEntries, projects } from '@/db/schema'
import { eq, and, between, desc } from 'drizzle-orm'
import type { TimeEntry, CreateTimeEntryInput, UpdateTimeEntryInput, TimeEntryWithProject } from '@/types'

export async function getTimeEntries(
  userId: number,
  startDate?: string,
  endDate?: string
): Promise<TimeEntryWithProject[]> {
  const db = getDatabase()

  let query = db.query.timeEntries.findMany({
    where: and(eq(timeEntries.userId, userId), eq(timeEntries.deleted, false)),
    orderBy: desc(timeEntries.date),
    with: {
      project: true,
    },
  })

  if (startDate && endDate) {
    const filtered = db.query.timeEntries.findMany({
      where: and(
        eq(timeEntries.userId, userId),
        eq(timeEntries.deleted, false),
        between(timeEntries.date, startDate, endDate)
      ),
      orderBy: desc(timeEntries.date),
      with: {
        project: true,
      },
    })
    return filtered as Promise<TimeEntryWithProject[]>
  }

  return query as Promise<TimeEntryWithProject[]>
}

export async function createTimeEntry(
  userId: number,
  input: CreateTimeEntryInput
): Promise<TimeEntry> {
  const db = getDatabase()
  const result = db
    .insert(timeEntries)
    .values({
      userId,
      projectId: input.projectId,
      date: input.date,
      hours: input.hours,
      notes: input.notes,
      source: input.source || 'manual',
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  const inserted = result.all()[0]
  return inserted as TimeEntry
}

export async function updateTimeEntry(
  userId: number,
  entryId: number,
  input: UpdateTimeEntryInput
): Promise<TimeEntry | null> {
  const db = getDatabase()

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (input.projectId !== undefined) updateData.projectId = input.projectId
  if (input.date !== undefined) updateData.date = input.date
  if (input.hours !== undefined) updateData.hours = input.hours
  if (input.notes !== undefined) updateData.notes = input.notes

  const result = db
    .update(timeEntries)
    .set(updateData)
    .where(and(eq(timeEntries.userId, userId), eq(timeEntries.id, entryId)))
    .returning()

  const updated = result.all()[0]
  return (updated as TimeEntry) || null
}

export async function deleteTimeEntry(userId: number, entryId: number): Promise<boolean> {
  const db = getDatabase()
  const result = db
    .update(timeEntries)
    .set({ deleted: true, updatedAt: new Date() })
    .where(and(eq(timeEntries.userId, userId), eq(timeEntries.id, entryId)))
    .run()

  return result.changes > 0
}

export async function getTotalHoursForWeek(userId: number, date: string): Promise<number> {
  const db = getDatabase()
  const d = new Date(date)
  const dayOfWeek = d.getDay()
  const startOfWeek = new Date(d)
  startOfWeek.setDate(d.getDate() - dayOfWeek)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const start = startOfWeek.toISOString().split('T')[0]
  const end = endOfWeek.toISOString().split('T')[0]

  const entries = await getTimeEntries(userId, start, end)
  return entries.reduce((acc, entry) => acc + entry.hours, 0)
}

export async function getTotalHoursByProject(
  userId: number,
  startDate: string,
  endDate: string
): Promise<Array<{ projectId: number; projectName: string; hours: number; rate: number }>> {
  const db = getDatabase()
  const entries = await getTimeEntries(userId, startDate, endDate)

  const byProject = new Map<number, { name: string; hours: number; rate: number }>()

  for (const entry of entries) {
    const key = entry.projectId
    if (!byProject.has(key)) {
      byProject.set(key, {
        name: entry.project.name,
        hours: 0,
        rate: entry.project.hourlyRate,
      })
    }
    const current = byProject.get(key)!
    current.hours += entry.hours
  }

  return Array.from(byProject.entries()).map(([projectId, data]) => ({
    projectId,
    projectName: data.name,
    hours: data.hours,
    rate: data.rate,
  }))
}
