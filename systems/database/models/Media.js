const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    platform: { type: String, enum: ['youtube', 'twitch'], required: true },
    channelId: { type: String, required: true },
    lastChecked: { type: Date, default: Date.now },
    notificationChannel: { type: String },
    mentionRole: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);