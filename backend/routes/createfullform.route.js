import express from 'express';
import upload from '../config/upload.js';
import {createFullForm, getFullForm, testForm,deleteForm} from '../controllers/createfullform.controller.js';

const router = express.Router();

router.post('/create', upload.any(), createFullForm);
router.get('/preview/:id', getFullForm);
router.get('/test/:id', testForm);
router.delete('/delete/:id', deleteForm);

export default router;
