import { NextRequest, NextResponse } from 'next/server'
import { getProjects, createProject } from '@/services/projectService'
import type { ApiResponse, CreateProjectInput } from '@/types'

const DEFAULT_USER_ID = 1

export async function GET() {
  try {
    const projects = await getProjects(DEFAULT_USER_ID)
    const response: ApiResponse<typeof projects> = {
      success: true,
      data: projects,
    }
    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : '프로젝트 조회 실패'
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProjectInput
    const project = await createProject(DEFAULT_USER_ID, body)
    const response: ApiResponse<typeof project> = {
      success: true,
      data: project,
    }
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : '프로젝트 생성 실패'
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    }
    return NextResponse.json(response, { status: 400 })
  }
}
