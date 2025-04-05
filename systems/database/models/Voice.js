const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Voice', voiceSchema);