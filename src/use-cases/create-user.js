import crypto from 'crypto'
import bcrypt from 'bcrypt'

import {
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // Gerar um ID único para o usuário
        const userId = crypto.randomUUID()

        // criptografar a senha do usuário
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        // inserir o usuário no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // chamar o repositório
        const postgresCreateUserRepository = new PostgresCreateUserRepository()
        const createdUser = await postgresCreateUserRepository.execute(user)
        return createdUser
    }
}
