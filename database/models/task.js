const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)