import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '타임시트: 클릭 없는 시간 기록',
  description: '프리랜서를 위한 간단한 시간 기록 및 청구서 생성 도구',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
