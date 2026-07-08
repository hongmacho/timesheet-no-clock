import { parseTimeEntry, getParsingError } from './parser'

describe('parseTimeEntry', () => {
  const projects = ['Design', 'Backend', 'Frontend', 'Testing', '회의']

  describe('기본 한국어 형식', () => {
    test('어제 오후 2시간 디자인 회의', () => {
      const result = parseTimeEntry('어제 오후 2시간 디자인 회의', projects)
      expect(result.project).toBe('Design')
      expect(result.hours).toBe(2)
      expect(result.confidence).toBe('high')
    })

    test('오늘 3시간 Backend', () => {
      const result = parseTimeEntry('오늘 3시간 Backend', projects)
      expect(result.project).toBe('Backend')
      expect(result.hours).toBe(3)
      expect(result.confidence).toBe('high')
    })

    test('내일 1시간 회의', () => {
      const result = parseTimeEntry('내일 1시간 회의', projects)
      expect(result.project).toBe('회의')
      expect(result.hours).toBe(1)
    })
  })

  describe('다양한 시간 형식', () => {
    test('2h Design', () => {
      const result = parseTimeEntry('2h Design', projects)
      expect(result.hours).toBe(2)
    })

    test('150분 Backend', () => {
      const result = parseTimeEntry('150분 Backend', projects)
      expect(result.hours).toBe(2.5)
    })

    test('2:30 Frontend', () => {
      const result = parseTimeEntry('2:30 Frontend', projects)
      expect(result.hours).toBe(2.5)
    })

    test('4시간 Design', () => {
      const result = parseTimeEntry('4시간 Design', projects)
      expect(result.hours).toBe(4)
    })

    test('0.5시간 Testing', () => {
      const result = parseTimeEntry('0.5시간 Testing', projects)
      expect(result.hours).toBe(0.5)
    })
  })

  describe('날짜 형식', () => {
    test('2025-01-15 2h Design', () => {
      const result = parseTimeEntry('2025-01-15 2h Design', projects)
      expect(result.date).toBe('2025-01-15')
      expect(result.hours).toBe(2)
    })

    test('지난주 월요일 3h Backend', () => {
      const result = parseTimeEntry('지난주 월요일 3h Backend', projects)
      expect(result.project).toBe('Backend')
      expect(result.hours).toBe(3)
    })
  })

  describe('프로젝트 매칭', () => {
    test('정확한 프로젝트명 매칭', () => {
      const result = parseTimeEntry('2h Design', projects)
      expect(result.project).toBe('Design')
    })

    test('대소문자 무시 매칭', () => {
      const result = parseTimeEntry('2h design', projects)
      expect(result.project).toBe('Design')
    })

    test('부분 매칭', () => {
      const result = parseTimeEntry('3시간 백엔드', projects)
      expect(result.project).toBe('Backend')
    })
  })

  describe('메모 추출', () => {
    test('메모 포함', () => {
      const result = parseTimeEntry('어제 2시간 Design 회의', projects)
      expect(result.notes).toContain('회의')
    })

    test('메모 없음', () => {
      const result = parseTimeEntry('2h Design', projects)
      expect(result.notes).toBeNull()
    })
  })

  describe('에러 처리', () => {
    test('빈 입력', () => {
      const result = parseTimeEntry('', projects)
      expect(result.error).toBeDefined()
      expect(result.confidence).toBe('low')
    })

    test('유효하지 않은 시간 (24h 초과)', () => {
      const result = parseTimeEntry('25시간 Design', projects)
      expect(result.hours).toBeNull()
    })

    test('유효하지 않은 시간 (0.5h 미만)', () => {
      const result = parseTimeEntry('0.25시간 Design', projects)
      expect(result.hours).toBeNull()
    })

    test('프로젝트 없음', () => {
      const result = parseTimeEntry('2h', projects)
      expect(result.project).toBeNull()
    })
  })

  describe('신뢰도 평가', () => {
    test('높은 신뢰도 (모든 필드 포함)', () => {
      const result = parseTimeEntry('어제 2시간 Design', projects)
      expect(result.confidence).toBe('high')
    })

    test('중간 신뢰도 (일부 필드)', () => {
      const result = parseTimeEntry('2h', projects)
      expect(result.confidence).toBe('low')
    })
  })

  describe('복잡한 입력', () => {
    test('긴 문장 파싱', () => {
      const result = parseTimeEntry('어제 오후 2시간 30분 Design 팀 회의', projects)
      expect(result.hours).toBe(2.5)
      expect(result.project).toBe('Design')
    })

    test('여러 프로젝트 언급 (첫 번째만)', () => {
      const result = parseTimeEntry('2h Design 다음은 Backend', projects)
      expect(result.project).toBe('Design')
    })
  })

  describe('프로젝트 없이', () => {
    test('프로젝트 후보가 비어있음', () => {
      const result = parseTimeEntry('어제 2시간 디자인', [])
      expect(result.project).toBeNull()
    })
  })
})

describe('getParsingError', () => {
  const projects = ['Design', 'Backend']

  test('신뢰도 낮으면 오류 메시지', () => {
    const result = parseTimeEntry('hello world', projects)
    const error = getParsingError(result)
    expect(error).toBeDefined()
  })

  test('신뢰도 높으면 오류 없음', () => {
    const result = parseTimeEntry('2h Design', projects)
    const error = getParsingError(result)
    expect(error).toBeNull()
  })
})
