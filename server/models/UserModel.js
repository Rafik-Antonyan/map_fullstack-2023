import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    customerID: {
        type: String,
    },
    cards: [{
        cardID: {
            type: String,
        },
    }],
    addresses: [{
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }],
    verified: {
        type: Boolean,
        default: false,
        required: true
    }
}, { timestamps: true })
userSchema.path('cards').default([]);
userSchema.path('addresses').default([]);
export default mongoose.model("User", userSchema)