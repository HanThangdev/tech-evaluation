import { Router } from "express";

import { transactions } from "../controllers/index.js";

const router = Router();

// Get all transactions with pagination and filters
router.get('/', transactions.index)

// Get transaction by ID
router.get('/:id', transactions.fetchById)

// Create new transaction
router.post('/', transactions.create)

// Update transaction
router.put('/:id', transactions.update)

// Delete transaction
router.delete('/:id', transactions.remove)

export default router;