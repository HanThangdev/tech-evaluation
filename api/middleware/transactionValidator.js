import { body, param, query } from 'express-validator';
import { validationResult } from 'express-validator';
import { TRANSACTION_TYPE } from '../constant/transaction.js';
// Middleware to check for validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for creating/updating transaction
export const transactionValidationRules = () => {
  return [
    body('amount')
      .notEmpty()
      .withMessage('Amount is required'),
    body('type')
      .notEmpty()
      .withMessage('Transaction type is required')
      .isIn(Object.values(TRANSACTION_TYPE))
      .withMessage('Transaction type must be one of the following: ' + Object.values(TRANSACTION_TYPE).join(', ')),
    body('description')
      .optional()
      .isString()
      .isLength({ min: 3, max: 500 })
      .withMessage('Description must be between 3 and 500 characters'),
    body('userId')
      .notEmpty()
      .withMessage('User ID is required'),
    validate
  ];
};

// Validation rules for transaction ID parameter
export const transactionIdValidationRules = () => {
  return [
    param('id')
      .notEmpty(),
    validate
  ];
};

// Validation rules for pagination and filters
export const transactionQueryValidationRules = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('type')
      .optional()
      .isIn(Object.values(TRANSACTION_TYPE))
      .withMessage('Invalid transaction type'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date'),
    validate
  ];
}; 