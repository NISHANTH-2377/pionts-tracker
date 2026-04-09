const mongoose = require('mongoose');

const pointsLogSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    teamName: String,
    pointsAdded: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    addedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('PointsLog', pointsLogSchema);
