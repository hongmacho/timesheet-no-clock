'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Project, ApiResponse } from '@/types'

interface ParseResult {
  project: string | null
  hours: number | null
  date: string | null
  notes: string | null
  confidence: 'high' | 'medium' | 'low'
}

export default function TextInputPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [parsed, setParsed] = useState<ParseResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        const data = (await res.json()) as ApiResponse<Project[]>
        if (data.success && data.data) {
          setProjects(data.data)
        }
      } catch (error) {
        console.error('프로젝트 조회 실패:', error)
      }
    }
    fetchProjects()
  }, [])

  async function handleParse() {
    if (!input.trim()) return

    setLoading(true)
    try {
      // 클라이언트에서 파싱 시뮬레이션
      const projectNames = projects.map((p) => p.name)

      // 간단한 정규식 기반 파싱
      const datePattern = /(어제|오늘|내일|지난주)/i
      const dateMatch = input.match(datePattern)
      let dateStr: string | null = null
      if (dateMatch) {
        const today = new Date()
        if (dateMatch[1] === '어제') {
          today.setDate(today.getDate() - 1)
        } else if (dateMatch[1] === '오늘') {
          // 오늘
        } else if (dateMatch[1] === '내일') {
          today.setDate(today.getDate() + 1)
        }
        dateStr = today.toISOString().split('T')[0]
      }

      const hourPattern = /(\d+(?:[.,]\d+)?)\s*(?:시간|h|hour)/i
      const hourMatch = input.match(hourPattern)
      let hours: number | null = null
      if (hourMatch) {
        hours = parseFloat(hourMatch[1].replace(',', '.'))
      }

      let project: string | null = null
      for (const p of projectNames) {
        if (input.toLowerCase().includes(p.toLowerCase())) {
          project = p
          break
        }
      }

      setParsed({
        project,
        hours,
        date: dateStr || new Date().toISOString().split('T')[0],
        notes: input.replace(/(어제|오늘|내일|지난주|시간|h|hour|\d+)/gi, '').trim() || null,
        confidence: project && hours ? 'high' : 'medium',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!parsed || !parsed.hours) {
      alert('시간을 입력해주세요')
      return
    }

    const projectId = selectedProjectId || projects.find((p) => p.name === parsed.project)?.id
    if (!projectId) {
      alert('프로젝트를 선택해주세요')
      return
    }

    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          date: parsed.date,
          hours: parsed.hours,
          notes: parsed.notes,
          source: 'parsed',
        }),
      })

      const data = (await res.json()) as ApiResponse<unknown>
      if (data.success) {
        alert('저장되었습니다')
        router.push('/logs')
      } else {
        alert('저장 실패: ' + data.error)
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장 실패')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">텍스트로 시간 기록하기</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">시간 기록 (자유형)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 어제 오후 2시간 디자인 회의&#10;또는: 3시간 Backend&#10;또는: 150분 Design"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-medium text-lg"
          />
          <p className="text-xs text-gray-500 mt-2">
            자유로운 형식으로 입력하세요. 자동으로 프로젝트, 시간, 날짜를 인식합니다.
          </p>
        </div>

        <button
          onClick={handleParse}
          disabled={!input.trim() || loading}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? '분석 중...' : '미리보기'}
        </button>

        {parsed && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="font-bold text-gray-900 mb-4">
              {parsed.confidence === 'high'
                ? '✓ 분석 완료'
                : parsed.confidence === 'medium'
                  ? '⚠ 일부 필드 확인 필요'
                  : '✗ 분석 실패'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트</label>
                <select
                  value={selectedProjectId || parsed.project || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택해주세요</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₩{p.hourlyRate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                  <input
                    type="date"
                    value={parsed.date || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                  <input
                    type="number"
                    value={parsed.hours || ''}
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
                <input
                  type="text"
                  value={parsed.notes || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!parsed || !selectedProjectId}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            저장
          </button>
          <button
            onClick={() => {
              setInput('')
              setParsed(null)
            }}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
