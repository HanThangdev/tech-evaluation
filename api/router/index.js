import { Router } from "express";
import transactions from './transactions.js';
import users from './users.js';
import KYC_API from './KYC.js'

const router = Router();

router.use('/transactions', transactions);
router.use('/users', users);
router.use('/kyc', KYC_API)

export default router;