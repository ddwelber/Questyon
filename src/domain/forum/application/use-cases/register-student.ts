import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { StudentsRepository } from "../repositories/students-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { StudentAlreadyExistsError } from "./error/student-already-exists-error";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(
      email
    );

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const password_hash = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: password_hash,
    });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}
