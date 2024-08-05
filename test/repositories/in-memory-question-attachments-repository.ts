import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-respository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = [];

  async createMany(attachments: QuestionAttachment[]) {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = questionAttachments;
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId
    );

    this.items = questionAttachments;
  }
}
