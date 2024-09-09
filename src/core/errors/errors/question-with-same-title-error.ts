import { UseCaseError } from '@/core/errors/use-case-error'

export class QuestionWithSameTitleError extends Error implements UseCaseError {
  constructor() {
    super('Question with same title')
  }
}
