const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Doctor
  description: { type: String },
  icon: { type: String, default: 'Building2' }, // Lucide icon name
  bg: { type: String, default: 'bg-blue-500' }, // Tailwind bg class
  staffCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', departmentSchema);
