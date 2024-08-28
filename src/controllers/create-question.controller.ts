import { CurrentUser } from "@/auth/current-user-decorator"
import { UserPayload } from "@/auth/jwt.strategy"
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe"
import { PrismaService } from "@/prisma/prisma.service"
import { Controller, UseGuards, Post, Body } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { z } from "zod"

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidattionPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private prisma: PrismaService) { }

  @Post()
  async handle(
    @Body(bodyValidattionPipe)
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {

    const { title, content } = body
    const userId = user.sub
    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })

    return "ok"
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}