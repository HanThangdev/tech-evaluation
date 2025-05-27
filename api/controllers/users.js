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
 * GET /api/users
 * -------------
 * Get all users with optional filters and pagination
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { name: { contains: search } },
                { email: { contains: search } }
            ]
        } : {};

        const [users, total] = await Promise.all([
            prisma.User.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.User.count({ where })
        ]);

        return successResponse(res, STATUS_CODE.SUCCESS, {
            users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/:id
 * -----------------
 * Get user by ID
 */
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const user = await prisma.user.findUnique({ 
            where: { id }
        });

        if (!user) {
            return notFoundResponse(res, ERROR_MESSAGE.USER_NOT_FOUND);
        }

        return successResponse(res, STATUS_CODE.SUCCESS, user);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/users
 * --------------
 * Create new user
 */
export const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return validationErrorResponse(res, {
                message: ERROR_MESSAGE.MISSING_REQUIRED_FIELDS
            });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return validationErrorResponse(res, {
                email: ERROR_MESSAGE.EMAIL_ALREADY_EXISTS
            });
        }

        const user = await prisma.user.create({
            data: { 
                name, 
                email, 
                password: await bcrypt.hash(password, 10)
            }
        });

        return successResponse(res, STATUS_CODE.CREATED, user);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/users/:id
 * -----------------
 * Update user
 */
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return notFoundResponse(res, ERROR_MESSAGE.USER_NOT_FOUND);
        }

        const user = await prisma.user.update({
            where: { id },
            data: { name, email }
        });

        return successResponse(res, STATUS_CODE.SUCCESS, user);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/users/:id
 * --------------------
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return notFoundResponse(res, ERROR_MESSAGE.USER_NOT_FOUND);
        }

        if (!req.user.isAdmin) {
            return errorResponse(res, STATUS_CODE.FORBIDDEN, ERROR_MESSAGE.ADMIN_ONLY);
        }

        await prisma.user.delete({
            where: { id }
        });

        return successResponse(res, STATUS_CODE.SUCCESS, {
            message: SUCCESS_MESSAGE.USER_DELETED_SUCCESSFULLY
        });
    } catch (error) {
        next(error);
    }
};