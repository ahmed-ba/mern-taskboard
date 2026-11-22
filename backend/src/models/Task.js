import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: '', maxlength: 1000 },
  completed: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Task', schema);
