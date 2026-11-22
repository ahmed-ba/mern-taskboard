import { Router } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
const router = Router();
const validId = id => mongoose.isValidObjectId(id);

router.get('/', async (_req, res, next) => {
  try { res.json(await Task.find().sort({ createdAt: -1 }).lean()); }
  catch (err) { next(err); }
});
router.post('/', async (req, res, next) => {
  try {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
    if (!title || title.length > 200 || description.length > 1000)
      return res.status(400).json({ error: 'Invalid task title or description' });
    res.status(201).json(await Task.create({ title, description }));
  } catch (err) { next(err); }
});
router.patch('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (typeof req.body?.completed === 'boolean') update.completed = req.body.completed;
    if (typeof req.body?.title === 'string') {
      const title = req.body.title.trim();
      if (!title || title.length > 200) return res.status(400).json({ error: 'Invalid title' });
      update.title = title;
    }
    if (!Object.keys(update).length) return res.status(400).json({ error: 'No valid fields' });
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(204).end();
  } catch (err) { next(err); }
});
export default router;
