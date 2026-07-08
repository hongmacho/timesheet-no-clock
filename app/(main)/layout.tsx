import Link from 'next/link'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ⏱️ 타임시트
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              대시보드
            </Link>
            <Link href="/projects" className="text-gray-600 hover:text-gray-900">
              프로젝트
            </Link>
            <Link href="/logs" className="text-gray-600 hover:text-gray-900">
              기록
            </Link>
            <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
              통계
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
        <p>타임시트: 클릭 없는 시간 기록 • © 2025</p>
      </footer>
    </div>
  )
}
