// backend/src/routes/dashboard.routes.ts
import { Router, Request, Response } from 'express';
import Member from '../models/Member';
import Employee from '../models/Employee';
import Branch from '../models/Branch';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Dashboard stats
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const totalMembers = await Member.countDocuments({ status: 'active' });
    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    const activeBranches = await Branch.countDocuments({ status: 'active' });
    
    console.log('📊 Fetching dashboard stats:', { totalMembers, totalEmployees, activeBranches }); // Debug log
    
    const revenue = 840000;

    res.json({
      totalMembers,
      totalEmployees,
      activeBranches,
      revenue,
      growth: {
        members: 12.5,
        employees: 8.2,
        branches: 2,
        revenue: 15.3
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Weekly attendance data (dynamic)
router.get('/attendance-weekly', authMiddleware, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    const totalMembers = await Member.countDocuments({ status: 'active' });
    console.log('📊 Generating attendance data for', totalMembers, 'members'); // Debug log
    
    const weeklyData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      let attendanceRate;
      if (i < 5) {
        attendanceRate = 0.75 + Math.random() * 0.15;
      } else {
        attendanceRate = 0.40 + Math.random() * 0.20;
      }
      
      const present = Math.floor(totalMembers * attendanceRate);
      const absent = Math.floor(totalMembers * (0.15 + Math.random() * 0.10));
      
      weeklyData.push({
        day: days[i],
        present,
        absent,
        date: date.toISOString().split('T')[0]
      });
    }

    console.log('📊 Weekly attendance data:', weeklyData); // Debug log
    res.json(weeklyData);
  } catch (error: any) {
    console.error('Attendance error:', error);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});

// Membership growth data (last 6 months)
router.get('/membership-growth', authMiddleware, async (req: Request, res: Response) => {
  try {
    const growthData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      
      const count = await Member.countDocuments({
        joinDate: { $lt: nextMonth }
      });
      
      growthData.push({
        month: months[date.getMonth()],
        total: count,
        year: date.getFullYear()
      });
    }

    console.log('📊 Membership growth data:', growthData); // Debug log
    res.json(growthData);
  } catch (error: any) {
    console.error('Growth data error:', error);
    res.status(500).json({ message: 'Error fetching growth data', error: error.message });
  }
});

export default router;
