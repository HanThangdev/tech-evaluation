import { PrismaClient } from '@prisma/client';
import { 
    successResponse, 
    errorResponse, 
    notFoundResponse, 
    validationErrorResponse 
} from '../utils/responseHandler.js';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../constant/message.js';
import { TRANSACTION_TYPE } from '../constant/transaction.js';
import STATUS_CODE from '../constant/status.js';

const prisma = new PrismaClient();

/**
 * GET /api/transactions
 * ---------------------
 * Retrieve a list of all transactions.
 *
 * Optional Query Parameters:
 * - type: Filter transactions by type. Valid values are "Stake", "Borrow", or "Lend".
 *
 * Success Response:
 * - 200 OK: Returns an array of transactions (filtered if query param is used).
 *
 * Error Response:
 * - 400 Bad Request: Returned if an invalid type value is provided.
 */
export const index = async (req, res, next) => {
    try {
        const { type, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        if (type && !Object.values(TRANSACTION_TYPE).includes(type)) {
            return validationErrorResponse(res, { type: ERROR_MESSAGE.INVALID_TRANSACTION_TYPE });
        }

        const where = !type || type === 'all' ? {} : { type };

        const [transactions, total] = await Promise.all([
            prisma.transactions.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: parseInt(limit)
            }),
            prisma.transactions.count({ where })
        ]);

        const totalPages = Math.ceil(total / parseInt(limit));

        return successResponse(res, STATUS_CODE.SUCCESS, {
            data: transactions,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit), 
                totalPages
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/transactions/:id
 * -------------------------
 * Retrieve a specific transaction by its ID.
 *
 * URL Parameters:
 * - id: The unique identifier of the transaction to retrieve.
 *
 * Success Response:
 * - 200 OK: Returns the transaction object.
 *
 * Error Response:
 * - 404 Not Found: Returned if no transaction exists with the given ID.
 */
export const fetchById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const transaction = await prisma.transactions.findUnique({
            where: { id }
        });

        if (!transaction) {
            return notFoundResponse(res, ERROR_MESSAGE.TRANSACTION_NOT_FOUND);
        }

        return successResponse(res, STATUS_CODE.SUCCESS, transaction, SUCCESS_MESSAGE.SUCCESS);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/transactions
 * ----------------------
 * Create a new transaction.
 *
 * Request Body:
 * - transactionType (string): Must be one of "Stake", "Borrow", or "Lend".
 * - token (string): Must be a non-empty string.
 * - amount (number): Must be a positive number.
 *
 * Success Response:
 * - 201 Created: Returns the newly created transaction object.
 *
 * Error Response:
 * - 400 Bad Request: Returned if validation fails (e.g., invalid type, empty token, or non-positive amount).
 */
export const create = async (req, res, next) => {
    try {
        const { type, token, amount, status, description, userId } = req.body;
        
        // Combine all validations into one check
        const validationErrors = {};
        if (!type) validationErrors.type = ERROR_MESSAGE.MISSING_REQUIRED_FIELDS;
        if (!token) validationErrors.token = ERROR_MESSAGE.MISSING_REQUIRED_FIELDS;
        if (!amount) validationErrors.amount = ERROR_MESSAGE.MISSING_REQUIRED_FIELDS;
        if (amount <= 0) validationErrors.amount = ERROR_MESSAGE.INVALID_TRANSACTION_AMOUNT;
        if (type && !Object.values(TRANSACTION_TYPE).includes(type)) {
            validationErrors.type = ERROR_MESSAGE.INVALID_TRANSACTION_TYPE;
        }

        if (Object.keys(validationErrors).length > 0) {
            return validationErrorResponse(res, validationErrors);
        }

        // Direct create without transaction
        const transaction = await prisma.transactions.create({
            data: {
                type,
                token,
                amount,
                status: status || 'Pending', // Set default status
                description,
                userId
            }
        });

        return successResponse(res, STATUS_CODE.CREATED, transaction, SUCCESS_MESSAGE.TRANSACTION_CREATED_SUCCESSFULLY);
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/transactions/:id
 * -------------------------
 * Update an existing transaction.
 *
 * URL Parameters:
 * - id: The unique identifier of the transaction to update.
 *
 * Request Body:
 * - transactionType (string, optional): Must be one of "Stake", "Borrow", or "Lend".
 * - token (string, optional): Must be a non-empty string.
 * - amount (number, optional): Must be a positive number.
 *
 * Success Response:
 * - 200 OK: Returns the updated transaction object.
 *
 * Error Response:
 * - 404 Not Found: Returned if no transaction exists with the given ID.
 * - 400 Bad Request: Returned if validation fails.
 */
export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { transactionType, token, amount } = req.body;

        const existingTransaction = await prisma.transactions.findUnique({
            where: { id }
        });

        if (!existingTransaction) {
            return notFoundResponse(res, ERROR_MESSAGE.TRANSACTION_NOT_FOUND);
        }

        if (transactionType && !Object.values(TRANSACTION_TYPE).includes(transactionType)) {
            return validationErrorResponse(res, { 
                transactionType: ERROR_MESSAGE.INVALID_TRANSACTION_TYPE 
            });
        }

        if (amount !== undefined && amount <= 0) {
            return validationErrorResponse(res, { 
                amount: ERROR_MESSAGE.INVALID_TRANSACTION_AMOUNT 
            });
        }

        const updatedTransaction = await prisma.transactions.update({
            where: { id },
            data: {
                type: transactionType,
                ...req.body
            }
        });

        return successResponse(res, STATUS_CODE.SUCCESS, updatedTransaction, SUCCESS_MESSAGE.TRANSACTION_UPDATED_SUCCESSFULLY);
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/transactions/:id
 * ----------------------------
 * Delete a transaction.
 *
 * URL Parameters:
 * - id: The unique identifier of the transaction to delete.
 *
 * Success Response:
 * - 200 OK: Returns the deleted transaction object.
 *
 * Error Response:
 * - 404 Not Found: Returned if no transaction exists with the given ID.
 */
export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingTransaction = await prisma.transactions.findUnique({
            where: { id }
        });

        if (!existingTransaction) {
            return notFoundResponse(res, ERROR_MESSAGE.TRANSACTION_NOT_FOUND);
        }

        const deletedTransaction = await prisma.transactions.delete({
            where: { id }
        });

        return successResponse(res, STATUS_CODE.SUCCESS, deletedTransaction, SUCCESS_MESSAGE.TRANSACTION_DELETED_SUCCESSFULLY);
    } catch (error) {
        next(error);
    }
}
