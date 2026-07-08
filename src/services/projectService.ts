import 'server-only'

import { getDatabase } from '@/db'
import { projects, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types'

export async function getProjects(userId: number): Promise<Project[]> {
  const db = getDatabase()
  return db.query.projects.findMany({
    where: eq(projects.userId, userId),
  }) as Promise<Project[]>
}

export async function getProjectById(userId: number, projectId: number): Promise<Project | null> {
  const db = getDatabase()
  const result = await db.query.projects.findFirst({
    where: and(eq(projects.userId, userId), eq(projects.id, projectId)),
  })
  return (result as Project) || null
}

export async function createProject(
  userId: number,
  input: CreateProjectInput
): Promise<Project> {
  const db = getDatabase()
  const result = db
    .insert(projects)
    .values({
      userId,
      name: input.name,
      hourlyRate: input.hourlyRate,
      description: input.description,
      tags: input.tags,
      status: input.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  const inserted = result.all()[0]
  return inserted as Project
}

export async function updateProject(
  userId: number,
  projectId: number,
  input: UpdateProjectInput
): Promise<Project | null> {
  const db = getDatabase()

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (input.name !== undefined) updateData.name = input.name
  if (input.hourlyRate !== undefined) updateData.hourlyRate = input.hourlyRate
  if (input.description !== undefined) updateData.description = input.description
  if (input.tags !== undefined) updateData.tags = input.tags
  if (input.status !== undefined) updateData.status = input.status

  const result = db
    .update(projects)
    .set(updateData)
    .where(and(eq(projects.userId, userId), eq(projects.id, projectId)))
    .returning()

  const updated = result.all()[0]
  return (updated as Project) || null
}

export async function deleteProject(userId: number, projectId: number): Promise<boolean> {
  const db = getDatabase()
  const result = db
    .delete(projects)
    .where(and(eq(projects.userId, userId), eq(projects.id, projectId)))
    .run()

  return result.changes > 0
}

export async function getActiveProjects(userId: number): Promise<Project[]> {
  const db = getDatabase()
  return db.query.projects.findMany({
    where: and(eq(projects.userId, userId), eq(projects.status, 'active')),
  }) as Promise<Project[]>
}

export async function getProjectsByName(userId: number): Promise<string[]> {
  const db = getDatabase()
  const results = await db.query.projects.findMany({
    where: eq(projects.userId, userId),
  })
  return (results as Project[]).map((p) => p.name)
}
