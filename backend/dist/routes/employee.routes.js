"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/employee.routes.ts
const express_1 = require("express");
const Employee_1 = __importDefault(require("../models/Employee"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const employees = await Employee_1.default.find().populate('branchId', 'name');
        res.json(employees);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
});
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const employee = new Employee_1.default(req.body);
        await employee.save();
        res.status(201).json(employee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
});
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const employee = await Employee_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});
router.delete('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const employee = await Employee_1.default.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
});
exports.default = router;
