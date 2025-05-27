import { body, param, query } from 'express-validator';
import { validationResult } from 'express-validator';

// Middleware to check for validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for creating/updating user
export const userValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    validate
  ];
};

// Validation rules for user ID parameter
export const userIdValidationRules = () => {
  return [
    param('id')
      .notEmpty()
      .withMessage('User ID is required'),
    validate
  ];
};

// Validation rules for pagination and filters
export const userQueryValidationRules = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    validate
  ];
}; 