// backend/src/routes/employee.routes.ts
import { Router, Request, Response } from 'express';
import Employee from '../models/Employee';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().populate('branchId', 'name');
    res.json(employees);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

export default router;
