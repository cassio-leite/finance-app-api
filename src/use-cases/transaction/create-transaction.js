import crypto from 'crypto'
import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(createTransactionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = crypto.randomUUID()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
