// backend/src/routes/branch.routes.ts
import { Router, Request, Response } from 'express';
import Branch from '../models/Branch';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching branches', error: error.message });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.status(201).json(branch);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating branch', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json(branch);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating branch', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json({ message: 'Branch deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting branch', error: error.message });
  }
});

export default router;
