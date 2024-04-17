import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    status: {
        text: {
            type: String,
            required: true,
        },
        registration: {
            type: Number,
            default: 0,
            required: true,
        },
        cooking: {
            type: Number,
            default: 0,
            required: true,
        },
        delivery: {
            type: Number,
            default: 0,
            required: true,
        }
    },
    time: {
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        }
    },
    address: {
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
        }
    },
    payment_method: {
        type: String,
        required: true,
        default: "Cash"
    },
    paid: {
        type: Boolean,
        required: true,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orders: [
        {
            name: {
                type: String,
                default: ""
            },
            order: [{
                name: {
                    type: String,
                },
                count: {
                    type: Number,
                },
                image: {
                    type: String,
                },
                price: {
                    type: Number
                }
            }]
        },
    ]
}, { timestamps: true })

export default mongoose.model("Order", orderSchema)