'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { TimeEntryWithProject, ApiResponse } from '@/types'

export default function LogsPage() {
  const [entries, setEntries] = useState<TimeEntryWithProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    try {
      const res = await fetch('/api/time-entries')
      const data = (await res.json()) as ApiResponse<TimeEntryWithProject[]>
      if (data.success && data.data) {
        setEntries(data.data)
      }
    } catch (error) {
      console.error('시간 기록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalHours = entries.reduce((acc, entry) => acc + entry.hours, 0)
  const totalAmount = entries.reduce((acc, entry) => acc + entry.hours * entry.project.hourlyRate, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">시간 기록</h1>
        <Link
          href="/log"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-sm"
        >
          + 새 기록
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">총 시간</p>
          <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">예상 청구액</p>
          <p className="text-3xl font-bold text-gray-900">₩{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">기록 수</p>
          <p className="text-3xl font-bold text-gray-900">{entries.length}개</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">기록이 없습니다.</p>
          <Link href="/log" className="text-blue-500 font-medium hover:underline mt-2 inline-block">
            첫 기록 만들기
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">날짜</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">프로젝트</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">시간</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">청구액</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">메모</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{entry.date}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{entry.project.name}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{entry.hours.toFixed(1)}h</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    ₩{(entry.hours * entry.project.hourlyRate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{entry.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
