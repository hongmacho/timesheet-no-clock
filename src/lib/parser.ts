/**
 * 한국어 자연어 시간 기록 파서
 * 예: "어제 오후 2시간 디자인 회의" → {project: "Design", hours: 2, date: "2025-01-14", notes: "회의"}
 */

export interface ParsedTimeEntry {
  project: string | null
  hours: number | null
  date: string | null
  notes: string | null
  confidence: 'high' | 'medium' | 'low'
  error?: string
}

function getRelativeDate(relativeTerm: string): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const patterns: Record<string, number> = {
    '어제|지난날|전날': -1,
    '오늘|금일': 0,
    '내일|명일': 1,
    '그저께': -2,
    '모레': 2,
  }

  for (const [pattern, offset] of Object.entries(patterns)) {
    if (new RegExp(pattern).test(relativeTerm)) {
      const result = new Date(today)
      result.setDate(result.getDate() + offset)
      return result
    }
  }

  // "지난주", "이번주" 같은 주 단위
  const weekPatterns: Record<string, number> = {
    '지난주|저번주|지난달': -7,
    '이번주|이 주': 0,
    '다음주': 7,
  }

  for (const [pattern, offset] of Object.entries(weekPatterns)) {
    if (new RegExp(pattern).test(relativeTerm)) {
      const result = new Date(today)
      result.setDate(result.getDate() + offset)
      return result
    }
  }

  // "지난주 월요일" 같은 패턴
  const dayOfWeekPattern = /(?:지난주|저번주|이번주|다음주)?\s*(월|화|수|목|금|토|일)요일/
  const match = relativeTerm.match(dayOfWeekPattern)
  if (match) {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const targetDay = dayNames.indexOf(match[1])
    const currentDay = today.getDay()
    let daysAhead = targetDay - currentDay

    if (daysAhead <= 0) {
      daysAhead += 7
    }

    const result = new Date(today)
    result.setDate(result.getDate() + daysAhead - 7)

    if (relativeTerm.includes('지난주') || relativeTerm.includes('저번주')) {
      result.setDate(result.getDate() - 7)
    }

    return result
  }

  return today
}

function parseDate(dateStr: string): string | null {
  if (!dateStr) return null

  const now = new Date()

  // YYYY-MM-DD 형식
  const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    return isoMatch[0]
  }

  // 상대 날짜 (한국어)
  const relativeDate = getRelativeDate(dateStr)
  return relativeDate.toISOString().split('T')[0]
}

function parseHours(hourStr: string): number | null {
  if (!hourStr) return null

  // 제거: 숫자만 추출
  const numMatch = hourStr.match(/(\d+(?:[.,]\d+)?)/g)
  if (!numMatch) return null

  let value = parseFloat(numMatch[0].replace(',', '.'))

  // 형식 확인: "시간", "h", "분" 등
  if (hourStr.includes('분')) {
    value = value / 60
  } else if (hourStr.includes(':')) {
    // "2:30" 형식
    const parts = hourStr.split(':')
    if (parts.length === 2) {
      const h = parseFloat(parts[0])
      const m = parseFloat(parts[1])
      value = h + m / 60
    }
  }

  // 유효성 검사
  if (value < 0.5 || value > 24) {
    return null
  }

  return Math.round(value * 100) / 100 // 소수점 2자리
}

function extractProject(text: string, candidates: string[]): string | null {
  if (!text || candidates.length === 0) return null

  // 정확한 매칭 우선
  for (const candidate of candidates) {
    const escapedCandidate = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escapedCandidate}\\b`, 'i')
    if (regex.test(text)) {
      return candidate
    }
  }

  // 부분 매칭
  for (const candidate of candidates) {
    if (text.toLowerCase().includes(candidate.toLowerCase())) {
      return candidate
    }
  }

  return null
}

function extractNotes(text: string, removedParts: string[]): string | null {
  let notes = text
  removedParts.forEach((part) => {
    notes = notes.replace(part, '').trim()
  })

  notes = notes.replace(/\s+/g, ' ').trim()
  if (notes.length > 200) {
    notes = notes.substring(0, 200)
  }

  return notes || null
}

/**
 * 메인 파싱 함수
 * @param input 사용자 입력 텍스트
 * @param projectCandidates 기존 프로젝트 이름 목록
 */
export function parseTimeEntry(
  input: string,
  projectCandidates: string[] = []
): ParsedTimeEntry {
  if (!input || input.trim().length === 0) {
    return {
      project: null,
      hours: null,
      date: null,
      notes: null,
      confidence: 'low',
      error: '입력값이 비어있습니다.',
    }
  }

  const text = input.trim()
  const removedParts: string[] = []

  // 1. 날짜 파싱
  const datePatterns = [
    /(?:^|[\s])(\d{4}-\d{2}-\d{2})(?:[\s]|$)/,
    /(어제|오늘|내일|그저께|모레|지난주|이번주|다음주|지난주\s*월요일|지난주\s*화요일|지난주\s*수요일|지난주\s*목요일|지난주\s*금요일|지난주\s*토요일|지난주\s*일요일|이번주\s*월요일|이번주\s*화요일|이번주\s*수요일|이번주\s*목요일|이번주\s*금요일|이번주\s*토요일|이번주\s*일요일)/,
  ]

  let dateStr: string | null = null
  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      dateStr = match[1]
      removedParts.push(match[0])
      break
    }
  }

  const date = dateStr ? parseDate(dateStr) : new Date().toISOString().split('T')[0]

  // 2. 시간 파싱
  const hourPatterns = [
    /(\d+(?:[.,]\d+)?)\s*(?:시간|hour|h|hr)s?/i,
    /(\d+)\s*:?\s*(\d+)?\s*분/,
    /(\d+):(\d{2})/,
  ]

  let hoursStr: string | null = null
  for (const pattern of hourPatterns) {
    const match = text.match(pattern)
    if (match) {
      hoursStr = match[0]
      removedParts.push(match[0])
      break
    }
  }

  const hours = hoursStr ? parseHours(hoursStr) : null

  // 3. 프로젝트 파싱
  const remainingText = removedParts.reduce((acc, part) => acc.replace(part, ''), text)
  const project = extractProject(remainingText, projectCandidates)

  // 4. 메모 추출
  const notes = extractNotes(remainingText, removedParts)

  // 5. 신뢰도 계산
  let confidence: 'high' | 'medium' | 'low' = 'medium'
  let score = 0
  if (project) score++
  if (hours) score++
  if (dateStr) score++

  confidence = score === 3 ? 'high' : score >= 1 ? 'medium' : 'low'

  return {
    project,
    hours,
    date,
    notes,
    confidence,
  }
}

/**
 * 파싱 결과의 오류 메시지 생성
 */
export function getParsingError(parsed: ParsedTimeEntry): string | null {
  if (parsed.error) return parsed.error

  const issues: string[] = []

  if (!parsed.project && parsed.confidence === 'low') {
    issues.push('프로젝트를 인식할 수 없습니다.')
  }

  if (!parsed.hours && parsed.confidence === 'low') {
    issues.push('시간을 인식할 수 없습니다. (예: 2h, 2시간, 150분)')
  }

  if (issues.length === 0) return null
  return issues.join(' ')
}

/**
 * 자동 수정 제안 생성
 */
export function getAutoFixSuggestion(
  parsed: ParsedTimeEntry,
  projectCandidates: string[]
): Partial<ParsedTimeEntry> | null {
  if (parsed.confidence === 'high') {
    return null // 이미 고신뢰도, 수정 불필요
  }

  const suggestion: Partial<ParsedTimeEntry> = {}

  // 프로젝트 모호한 경우, 첫 번째 후보 제안
  if (!parsed.project && projectCandidates.length > 0) {
    suggestion.project = projectCandidates[0]
  }

  // 시간이 없지만, 기본값 제안 (e.g., 1시간)
  if (!parsed.hours) {
    suggestion.hours = 1
  }

  return Object.keys(suggestion).length > 0 ? suggestion : null
}
