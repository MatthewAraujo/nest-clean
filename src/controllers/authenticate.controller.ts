import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { compare } from 'bcryptjs'


const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

type authenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService, private prisma: PrismaService) { }

  @Post()
  // @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: authenticateBodySchema) {

    const { email, password } = authenticateBodySchema.parse(body)


    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not mnatch.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not mnatch.')
    }



    const accessToken = this.jwt.sign({ sub: user.id })


    return {
      acces_token: accessToken
    }
  }
}