"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/branch.routes.ts
const express_1 = require("express");
const Branch_1 = __importDefault(require("../models/Branch"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const branches = await Branch_1.default.find();
        res.json(branches);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching branches', error: error.message });
    }
});
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const branch = new Branch_1.default(req.body);
        await branch.save();
        res.status(201).json(branch);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating branch', error: error.message });
    }
});
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const branch = await Branch_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json(branch);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating branch', error: error.message });
    }
});
router.delete('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const branch = await Branch_1.default.findByIdAndDelete(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json({ message: 'Branch deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting branch', error: error.message });
    }
});
exports.default = router;
