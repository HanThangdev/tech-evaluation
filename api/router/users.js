import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.js';
import { userValidationRules, userIdValidationRules, userQueryValidationRules } from '../middleware/userValidator.js';

const router = Router();

// Get all users with pagination and filters
router.get('/', userQueryValidationRules(), getAllUsers);

// Get user by ID 
router.get('/:id', userIdValidationRules(), getUserById);

// Create new user
router.post('/', userValidationRules(), createUser);

// Update user
router.put('/:id', [...userIdValidationRules(), ...userValidationRules()], updateUser);

// Delete user
router.delete('/:id', userIdValidationRules(), deleteUser);

export default router;