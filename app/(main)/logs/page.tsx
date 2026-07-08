'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { TimeEntryWithProject, ApiResponse, Project } from '@/types'

export default function LogsPage() {
  const [entries, setEntries] = useState<TimeEntryWithProject[]>([])
  const [filteredEntries, setFilteredEntries] = useState<TimeEntryWithProject[]>([])
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [searchText, setSearchText] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [entries, searchText, filterProject, filterStartDate, filterEndDate])

  async function fetchData() {
    try {
      const [entriesRes, projectsRes] = await Promise.all([
        fetch('/api/time-entries'),
        fetch('/api/projects'),
      ])
      const entriesData = (await entriesRes.json()) as ApiResponse<TimeEntryWithProject[]>
      const projectsData = (await projectsRes.json()) as ApiResponse<Project[]>

      if (entriesData.success && entriesData.data) {
        setEntries(entriesData.data)
      }
      if (projectsData.success && projectsData.data) {
        setProjects(projectsData.data)
      }
    } catch (error) {
      console.error('데이터 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  function applyFilters() {
    let filtered = [...entries]

    // 텍스트 검색
    if (searchText.trim()) {
      const query = searchText.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.project.name.toLowerCase().includes(query) ||
          (entry.notes?.toLowerCase().includes(query) ?? false) ||
          entry.date.includes(query)
      )
    }

    // 프로젝트 필터
    if (filterProject) {
      filtered = filtered.filter((entry) => entry.projectId === parseInt(filterProject))
    }

    // 날짜 범위 필터
    if (filterStartDate) {
      filtered = filtered.filter((entry) => entry.date >= filterStartDate)
    }
    if (filterEndDate) {
      filtered = filtered.filter((entry) => entry.date <= filterEndDate)
    }

    setFilteredEntries(filtered)
  }

  const totalHours = filteredEntries.reduce((acc, entry) => acc + entry.hours, 0)
  const totalAmount = filteredEntries.reduce((acc, entry) => acc + entry.hours * entry.project.hourlyRate, 0)

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

      {/* 검색/필터 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">검색 및 필터</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기록 검색</label>
            <input
              type="text"
              placeholder="프로젝트명, 메모, 날짜..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">모든 프로젝트</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <button
          onClick={() => {
            setSearchText('')
            setFilterProject('')
            setFilterStartDate('')
            setFilterEndDate('')
          }}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 text-sm"
        >
          필터 초기화
        </button>
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
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">검색 결과가 없습니다.</p>
          <button
            onClick={() => {
              setSearchText('')
              setFilterProject('')
              setFilterStartDate('')
              setFilterEndDate('')
            }}
            className="text-blue-500 font-medium hover:underline mt-2"
          >
            필터 초기화
          </button>
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
              {filteredEntries.map((entry) => (
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
