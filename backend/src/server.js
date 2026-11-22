import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import tasks from './routes/tasks.js';
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (_req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable' }));
app.use('/api/tasks', tasks);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});
const user = 'root';
const pass = encodeURIComponent(process.env.MONGO_ROOT_PASSWORD || '');
const host = process.env.MONGO_HOST || 'mongo';
if (!pass) { console.error('Missing MongoDB password'); process.exit(1); }
const uri = `mongodb://${user}:${pass}@${host}:27017/taskboard?authSource=admin`;
const start = async () => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  app.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('API listening'));
};
start().catch(e => { console.error('Startup error', e.message); process.exit(1); });
