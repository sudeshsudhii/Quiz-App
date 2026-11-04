export type QuizWithQuestions = {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  questions: QuestionWithOptions[]
}

export type QuestionWithOptions = {
  id: string
  type: string
  text: string
  imageUrl: string | null
  timeLimit: number
  points: number
  order: number
  bloomLevel: string | null
  explanation: string | null
  options: QuestionOption[]
}

export type QuestionOption = {
  id: string
  text: string
  imageUrl: string | null
  isCorrect: boolean
  order: number
}

export type SessionParticipant = {
  id: string
  name: string
  emoji: string | null
  score: number
  isActive: boolean
}

export type ConfidenceGridData = {
  sureCorrect: number
  sureWrong: number
  unsureCorrect: number
  unsureWrong: number
}

export type SessionStats = {
  totalSessions: number
  totalParticipants: number
  avgScore: number
  completionRate: number
}
