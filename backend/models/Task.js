const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, añade un título a la tarea'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Por favor, añade una descripción'],
  },
  assignedTo: {
    type: String,
    required: [true, 'Por favor, añade un responsable para la tarea'],
  },
  status: {
    type: String,
    enum: ['pendiente', 'completada'],
    default: 'pendiente',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);