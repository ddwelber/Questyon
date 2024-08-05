import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { PrismaAttachmentsMapper } from "../mappers/prisma-attachments-mapper";

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentsMapper.toPrisma(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }
}
