import { PrismaClient } from '@prisma/client';
import { 
    successResponse, 
    errorResponse, 
    notFoundResponse, 
    validationErrorResponse 
} from '../utils/responseHandler.js';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../constant/message.js';
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
export const index = async (req, res) => {
    try {
        const { type } = req.query;
        
        if (type && !Object.values(TRANSACTION_TYPE).includes(type)) {
            return validationErrorResponse(res, { type: ERROR_MESSAGE.INVALID_TRANSACTION_TYPE });
        }

        const where = type ? { type } : {};

        const transactions = await prisma.transactions.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return successResponse(res, STATUS_CODE.SUCCESS, transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return errorResponse(res);
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
export const fetchById = async (req, res) => {
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
        console.error('Error fetching transaction:', error);
        return errorResponse(res);
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
export const create = async (req, res) => {
    try {
        const { transactionType, token, amount } = req.body;

        if (!transactionType || !token || !amount) {
            return validationErrorResponse(res, { 
                fields: ERROR_MESSAGE.MISSING_REQUIRED_FIELDS 
            });
        }

        if (!Object.values(TRANSACTION_TYPE).includes(transactionType)) {
            return validationErrorResponse(res, { 
                transactionType: ERROR_MESSAGE.INVALID_TRANSACTION_TYPE 
            });
        }

        if (amount <= 0) {
            return validationErrorResponse(res, { 
                amount: ERROR_MESSAGE.INVALID_TRANSACTION_AMOUNT 
            });
        }

        const transaction = await prisma.transactions.create({
            data: {
                type: transactionType,
                token,
                amount
            }
        });

        return successResponse(res, STATUS_CODE.CREATED, transaction, SUCCESS_MESSAGE.TRANSACTION_CREATED_SUCCESSFULLY);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return errorResponse(res);
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
export const update = async (req, res) => {
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
                token,
                amount
            }
        });

        return successResponse(res, STATUS_CODE.SUCCESS, updatedTransaction, SUCCESS_MESSAGE.TRANSACTION_UPDATED_SUCCESSFULLY);
    } catch (error) {
        console.error('Error updating transaction:', error);
        return errorResponse(res);
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
export const remove = async (req, res) => {
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
        console.error('Error deleting transaction:', error);
        return errorResponse(res);
    }
}


export const filter = async (req, res) => {
    try {
        const { type } = req.query;

        if (!Object.values(TRANSACTION_TYPE).includes(transactionType) || !transactionType) {
            return validationErrorResponse(res, { transactionType: ERROR_MESSAGE.INVALID_TRANSACTION_TYPE });
        }

        const transactions = await prisma.transactions.findMany({
            where: { type: transactionType }
        });

        if (!transactions) {
            return notFoundResponse(res, ERROR_MESSAGE.TRANSACTION_NOT_FOUND);
        }

        return successResponse(res, STATUS_CODE.SUCCESS, transactions);
    } catch (error) {
        console.error('Error filtering transactions:', error);
        return errorResponse(res);
    }
}