import { z } from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z
        .string({
            error: 'User ID is required.',
        })
        .uuid({
            message: 'User ID must be a valid UUID.',
        }),
    name: z
        .string({
            error: 'Name is required.',
        })
        .trim()
        .min(1, {
            message: 'The name is required.',
        }),
    date: z
        .string({
            error: 'Date is required.',
        })
        .datetime({
            message: 'Date must be a valid date.',
        }),
    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
        error: () => ({
            message: 'Type must be EARNING, EXPENSE, or INVESTMENT.',
        }),
    }),
    amount: z
        .number({
            error: 'Amount must be a number.',
        })
        .min(1, {
            message: 'The amount must be greater than 0.',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})
