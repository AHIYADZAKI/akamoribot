const mongoose = require('mongoose');

const muteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String },
    endsAt: { type: Date, required: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });

muteSchema.index({ endsAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Mute', muteSchema);