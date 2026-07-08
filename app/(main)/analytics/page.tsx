'use client'

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">통계</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">이번 주 시간</p>
          <p className="text-4xl font-bold text-gray-900">-</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">이번 달 시간</p>
          <p className="text-4xl font-bold text-gray-900">-</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">예상 청구액</p>
          <p className="text-4xl font-bold text-gray-900">-</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">프로젝트별 누계</h2>
        <p className="text-gray-500">데이터가 없습니다. 시간을 기록해주세요.</p>
      </div>
    </div>
  )
}
