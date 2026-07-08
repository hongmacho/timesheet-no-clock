import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/services/projectService'
import type { ApiResponse, UpdateProjectInput } from '@/types'

const DEFAULT_USER_ID = 1

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = parseInt(id)
    const project = await getProjectById(DEFAULT_USER_ID, projectId)
    if (!project) {
      const response: ApiResponse<null> = {
        success: false,
        error: '프로젝트를 찾을 수 없습니다',
      }
      return NextResponse.json(response, { status: 404 })
    }
    const response: ApiResponse<typeof project> = {
      success: true,
      data: project,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = parseInt(id)
    const body = (await request.json()) as UpdateProjectInput
    const project = await updateProject(DEFAULT_USER_ID, projectId, body)
    if (!project) {
      const response: ApiResponse<null> = {
        success: false,
        error: '프로젝트를 찾을 수 없습니다',
      }
      return NextResponse.json(response, { status: 404 })
    }
    const response: ApiResponse<typeof project> = {
      success: true,
      data: project,
    }
    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : '프로젝트 수정 실패'
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    }
    return NextResponse.json(response, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = parseInt(id)
    const deleted = await deleteProject(DEFAULT_USER_ID, projectId)
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: '프로젝트를 찾을 수 없습니다',
      }
      return NextResponse.json(response, { status: 404 })
    }
    const response: ApiResponse<null> = {
      success: true,
    }
    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : '프로젝트 삭제 실패'
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    }
    return NextResponse.json(response, { status: 400 })
  }
}
