const mongoose = require('mongoose');

const PassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  email: { type: String, required: true },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  qrString: { type: String, required: true, unique: true },
  isCheckedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date, default: null },
});

module.exports = mongoose.model('Pass', PassSchema);

