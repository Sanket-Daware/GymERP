// backend/src/routes/member.routes.ts
import { Router, Request, Response } from 'express';
import Member from '../models/Member';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get all members
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const members = await Member.find()
      .populate('branchId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Member.countDocuments();

    res.json({
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
});

// Create member
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating member', error: error.message });
  }
});

// Update member
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating member', error: error.message });
  }
});

// Delete member
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting member', error: error.message });
  }
});

export default router;
