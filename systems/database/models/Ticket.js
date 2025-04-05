const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: String,
    channelId: String,
    guildId: String,
    status: { type: String, default: 'open' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);