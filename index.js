import 'dotenv/config.js'
import express from 'express'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js'
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js'
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js'
import { CreateUserUseCase } from './src/use-cases/create-user.js'
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js'
import { UpdateUserUseCase } from './src/use-cases/update-user.js'
import { PostgresUpdateUserRepository } from './src/repositories/postgres/update-user.js'
import { PostgresDeleteUserRepository } from './src/repositories/postgres/delete-user.js'
import { DeleteUserUseCase } from './src/use-cases/delete-user.js'

const app = express()

app.use(express.json())

app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(request)

    response.status(statusCode).json(body)
})

app.post('/api/users', async (request, response) => {
    const createUserRepository = new PostgresCreateUserRepository()

    const createUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const createUserUseCase = new CreateUserUseCase(
        createUserByEmailRepository,
        createUserRepository,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

app.patch('/api/users/:userId', async (request, response) => {
    const updateUserRepository = new PostgresUpdateUserRepository()

    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).json(body)
})

app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).json(body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listtening on port ${process.env.PORT}`),
)
