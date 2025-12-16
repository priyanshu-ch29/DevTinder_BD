const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['interested', 'ignored', 'accepted', 'rejected'] }
}, {
    timestamps: true
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre('save', function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        return next(new Error("Cannot send connection request to oneself"))
    }
    next()
})

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema)

module.exports = ConnectionRequest