import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

const edtiAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
});

type EdtiAnswerBodySchema = z.infer<typeof edtiAnswerBodySchema>;

@Controller("/answers/:id")
export class EdtiAnswerController {
  constructor(private edtiAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(edtiAnswerBodySchema))
    body: EdtiAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") answerId: string
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.edtiAnswer.execute({
      content,
      answerId,
      authorId: userId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
