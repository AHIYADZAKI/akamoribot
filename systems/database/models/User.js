const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    lastDaily: { type: Date },
    lastWork: { type: Date },
    experience: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    inventory: { type: Array, default: [] },
    warnings: { type: Array, default: [] },
    muteEnds: { type: Date },
    voiceTime: { type: Number, default: 0 },
    lastVoiceUpdate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);