import type { ObjectId } from "mongodb"

export interface ExamRecord {
  _id?: ObjectId
  userId: string
  examId: string
  score: number
  answers: Array<{
    questionId: string
    selectedOption: string
    isCorrect: boolean
  }>
  completedAt: Date
  timeSpent: number // in seconds
  createdAt: Date
  updatedAt: Date
}

export const ExamRecordSchema = {
  // This is a MongoDB schema validation object
  // You can expand this based on your needs
  bsonType: "object",
  required: ["userId", "examId", "score", "answers", "completedAt", "timeSpent"],
  properties: {
    userId: {
      bsonType: "string",
      description: "User ID is required",
    },
    examId: {
      bsonType: "string",
      description: "Exam ID is required",
    },
    score: {
      bsonType: "number",
      description: "Score must be a number",
    },
    answers: {
      bsonType: "array",
      description: "Answers must be an array",
    },
    completedAt: {
      bsonType: "date",
      description: "Completion date is required",
    },
    timeSpent: {
      bsonType: "number",
      description: "Time spent must be a number in seconds",
    },
  },
}

export default ExamRecord
