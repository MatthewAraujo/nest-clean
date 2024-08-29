import { Controller, UseGuards, Get, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionController {
  constructor(private fetchRecentQuestion: FetchRecentQuestionsUseCase) { }

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const questions = await this.fetchRecentQuestion.execute({
      page,
    })
    return {
      questions,
    }
  }
}
