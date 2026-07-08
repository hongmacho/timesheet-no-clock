import { NextRequest, NextResponse } from 'next/server'
import { getTimeEntries, createTimeEntry } from '@/services/timeEntryService'
import { parseTimeEntry } from '@/lib/parser'
import { getProjectsByName } from '@/services/projectService'
import type { ApiResponse, CreateTimeEntryInput } from '@/types'

const DEFAULT_USER_ID = 1

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    const entries = await getTimeEntries(DEFAULT_USER_ID, startDate || undefined, endDate || undefined)
    const response: ApiResponse<typeof entries> = {
      success: true,
      data: entries,
    }
    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : '시간 기록 조회 실패'
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateTimeEntryInput
    const entry = await createTimeEntry(DEFAULT_USER_ID, body)
    const response: ApiResponse<typeof entry> = {
      success: true,
      data: entry,
    }
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : '시간 기록 생성 실패'
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    }
    return NextResponse.json(response, { status: 400 })
  }
}
