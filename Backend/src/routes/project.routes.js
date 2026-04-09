import { Router } from 'express';

import {
  createProjectController,
  getAllProjectsController,
  getProjectController,
  reviewProjectController,
  updateProjectController,
  executeProjectCodeController,
  aiChatController
} from '../controllers/project.controllers.js';

import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Protected routes
router.post('/create', verifyToken, createProjectController);
router.get('/get-all', verifyToken, getAllProjectsController);
router.get('/:id', verifyToken, getProjectController);
router.put('/:id', verifyToken, updateProjectController);
router.post('/:id/execute', verifyToken, executeProjectCodeController);
router.post('/:id/review', verifyToken, reviewProjectController);

// ✅ PUBLIC (NO TOKEN)
router.post("/ai-chat", aiChatController);

export default router;