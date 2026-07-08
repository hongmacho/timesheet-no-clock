/**
 * 사용자
 */
export interface User {
  id: number
  name: string
  email: string
  phone?: string
  companyName?: string
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  name: string
  email: string
  phone?: string
  companyName?: string
  currency?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  phone?: string
  companyName?: string
  currency?: string
}

/**
 * 프로젝트
 */
export interface Project {
  id: number
  userId: number
  name: string
  hourlyRate: number
  description?: string
  tags?: string
  status: 'active' | 'archived'
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectInput {
  name: string
  hourlyRate: number
  description?: string
  tags?: string
  status?: 'active' | 'archived'
}

export interface UpdateProjectInput {
  name?: string
  hourlyRate?: number
  description?: string
  tags?: string
  status?: 'active' | 'archived'
}

/**
 * 시간 기록
 */
export interface TimeEntry {
  id: number
  userId: number
  projectId: number
  date: string
  hours: number
  notes?: string
  source: 'manual' | 'parsed'
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateTimeEntryInput {
  projectId: number
  date: string
  hours: number
  notes?: string
  source?: 'manual' | 'parsed'
}

export interface UpdateTimeEntryInput {
  projectId?: number
  date?: string
  hours?: number
  notes?: string
}

export interface TimeEntryWithProject extends TimeEntry {
  project: Project
}

/**
 * 청구서
 */
export interface Invoice {
  id: number
  userId: number
  projectId: number
  invoiceNumber: string
  startDate: string
  endDate: string
  totalHours?: number
  totalAmount?: number
  status: 'draft' | 'sent' | 'paid'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateInvoiceInput {
  projectId: number
  startDate: string
  endDate: string
  status?: 'draft' | 'sent' | 'paid'
  notes?: string
}

export interface UpdateInvoiceInput {
  status?: 'draft' | 'sent' | 'paid'
  notes?: string
}

export interface InvoiceItem {
  id: number
  invoiceId: number
  date: string
  description?: string
  hours: number
  hourlyRate: number
  amount?: number
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[]
  project: Project
}

/**
 * API 응답
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

/**
 * 통계
 */
export interface TimeStats {
  totalHours: number
  averageHours?: number
  byProject: {
    projectId: number
    projectName: string
    hours: number
    rate: number
    amount: number
  }[]
  byDate: {
    date: string
    hours: number
  }[]
}

/**
 * 검색/필터 옵션
 */
export interface TimeEntryFilters {
  startDate?: string
  endDate?: string
  projectId?: number
  projectName?: string
  tags?: string[]
  notes?: string
  limit?: number
  offset?: number
}
