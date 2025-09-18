const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Yeh Organizer ki ID hogi
    required: true,
  },
}, { timestamps: true });

EventSchema.index({ name: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Event', EventSchema);

