import { Router } from "express";
import { transactions } from "../controllers/index.js";
import { 
  transactionValidationRules, 
  transactionIdValidationRules, 
  transactionQueryValidationRules 
} from '../middleware/transactionValidator.js';

const router = Router();

// Get all transactions with pagination and filters
router.get('/', transactionQueryValidationRules(), transactions.index)

// Get transaction by ID
router.get('/:id', transactionIdValidationRules(), transactions.fetchById)

// Create new transaction
router.post('/', transactionValidationRules(), transactions.create)

// Update transaction
router.put('/:id', [...transactionIdValidationRules(), ...transactionValidationRules()], transactions.update)

// Delete transaction
router.delete('/:id', transactionIdValidationRules(), transactions.remove)

export default router;