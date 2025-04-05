const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    prefix: { type: String, default: '/' },
    levelUpChannel: { type: String },
    welcomeChannel: { type: String },
    welcomeMessage: { type: String },
    goodbyeChannel: { type: String },
    goodbyeMessage: { type: String },
    modLogChannel: { type: String },
    muteRole: { type: String },
    autoRole: { type: String },
    experience: { type: Boolean, default: true },
    economy: { type: Boolean, default: true },
    customCommands: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Guild', guildSchema);