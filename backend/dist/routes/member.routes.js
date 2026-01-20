"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/member.routes.ts
const express_1 = require("express");
const Member_1 = __importDefault(require("../models/Member"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all members
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const members = await Member_1.default.find()
            .populate('branchId', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Member_1.default.countDocuments();
        res.json({
            members,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching members', error: error.message });
    }
});
// Create member
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const member = new Member_1.default(req.body);
        await member.save();
        res.status(201).json(member);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating member', error: error.message });
    }
});
// Update member
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const member = await Member_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating member', error: error.message });
    }
});
// Delete member
router.delete('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const member = await Member_1.default.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json({ message: 'Member deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting member', error: error.message });
    }
});
exports.default = router;
