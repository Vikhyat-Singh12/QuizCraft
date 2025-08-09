import express from 'express';
import { submitTest } from '../controllers/test.controller.js';

const router = express.Router();

router.post('/submit', submitTest);


export default router;
