const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    roleId: { type: String },
    stock: { type: Number, default: -1 },
    category: { type: String, default: 'other' }
}, { timestamps: true });

module.exports = mongoose.model('ShopItem', shopItemSchema);