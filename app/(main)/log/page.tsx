'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Project, ApiResponse } from '@/types'

export default function FormInputPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [formData, setFormData] = useState({
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    hours: 1,
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        const data = (await res.json()) as ApiResponse<Project[]>
        if (data.success && data.data && data.data.length > 0) {
          setProjects(data.data)
          const projectData = data.data
          setFormData((prev) => ({ ...prev, projectId: projectData[0].id.toString() }))
        }
      } catch (error) {
        console.error('프로젝트 조회 실패:', error)
      }
    }
    fetchProjects()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.projectId || !formData.hours) {
      alert('필수 필드를 입력해주세요')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: parseInt(formData.projectId),
          date: formData.date,
          hours: parseFloat(formData.hours.toString()),
          notes: formData.notes || undefined,
          source: 'manual',
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
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">시간 기록</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-8">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">프로젝트 *</label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">선택해주세요</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₩{p.hourlyRate.toLocaleString()}/h)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">날짜 *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">시간 *</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="12"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">메모 (선택)</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="회의, 개발, 검토 등"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !formData.projectId}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
