export type AppState = {
  currentPage: "landing" | "dashboard" | "study" | "tree"
}

export type Tree = {
  id: number
  name: string
  hash?: string
  userId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type Flashcard = {
  id: number
  treeId: number
  front: string
  back: string
  interval: number
  easeFactor: number
  nextReview: Date
  name?: string
  content?: string
  nodeId?: number
  userId?: string
}

