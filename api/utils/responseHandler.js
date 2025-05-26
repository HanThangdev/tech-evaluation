/**
 * Response Handler Utility
 * ----------------------
 * A utility file to standardize API responses across the application
 */

import { SUCCESS_MESSAGE } from "../constant/message.js";
import STATUS_CODE from "../constant/status.js";

/**
 * Success Response Handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object|Array} data - Response data
 * @param {string} message - Optional success message
 */
export const successResponse = (res, statusCode = STATUS_CODE.SUCCESS, data = null, message = SUCCESS_MESSAGE.SUCCESS) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Error Response Handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Optional validation errors
 */
export const errorResponse = (res, statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR, message = ERROR_MESSAGE.INTERNAL_SERVER_ERROR, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

/**
 * Not Found Response Handler
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
export const notFoundResponse = (res, message = ERROR_MESSAGE.NOT_FOUND) => {
    return errorResponse(res, STATUS_CODE.NOT_FOUND, message);
};

/**
 * Validation Error Response Handler
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors
 */
export const validationErrorResponse = (res, errors) => {
    return errorResponse(res, STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.VALIDATION_FAILED, errors);
};

/**
 * Unauthorized Response Handler
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
export const unauthorizedResponse = (res, message = ERROR_MESSAGE.UNAUTHORIZED) => {
    return errorResponse(res, STATUS_CODE.UNAUTHORIZED, message);
};

/**
 * Forbidden Response Handler
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
export const forbiddenResponse = (res, message = ERROR_MESSAGE.FORBIDDEN) => {
    return errorResponse(res, STATUS_CODE.FORBIDDEN, message);
}; 