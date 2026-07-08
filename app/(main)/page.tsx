'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Project, ApiResponse } from '@/types'

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const totalHourlyRate = projects.reduce((acc, p) => acc + p.hourlyRate, 0)

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">활성 프로젝트</p>
          <p className="text-4xl font-bold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">총 시급</p>
          <p className="text-4xl font-bold text-gray-900">₩{totalHourlyRate.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">이번 주 시간</p>
          <p className="text-4xl font-bold text-gray-900">-</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">프로젝트</h2>
          <Link
            href="/projects"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-sm"
          >
            + 새 프로젝트
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">프로젝트가 없습니다.</p>
            <Link href="/projects" className="text-blue-500 font-medium hover:underline mt-2 inline-block">
              첫 프로젝트 만들기
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">프로젝트명</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">시급</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">상태</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{project.name}</td>
                    <td className="px-4 py-3 text-right text-gray-600">₩{project.hourlyRate.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status === 'active' ? '활성' : '보관'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Link
          href="/log/new"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          텍스트로 시간 기록하기
        </Link>
        <Link
          href="/log"
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300"
        >
          폼으로 시간 기록하기
        </Link>
      </div>
    </div>
  )
}
