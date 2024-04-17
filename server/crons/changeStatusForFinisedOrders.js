import { Order } from '../models/index.js'
import io from '../index.js'

export const changeStatusForFinisedOrders = async () => {
    const someMinutesLater = new Date(new Date().getTime() + 15 * 60 * 1000);
    try {
        let orders = await Order.find({ "time.start": { $lte: someMinutesLater }, "time.end": { $gte: someMinutesLater }, "status.text": { $ne: "done" }, paid: true })
        orders = orders.map((order) => {
            const keys = Object.keys(order.status)
            const index = keys.findIndex(key => key === order.status.text)
            return Order.findByIdAndUpdate(order._id, {
                $inc: { [`status.${order.status.text}`]: order.status[order.status.text] !== 100 ? 10 : 0 },
                $set: {
                    "status.text": order.status[order.status.text] !== 100 ? keys[index] : index !== keys.length - 1 ? keys[index + 1] : "done",
                }
            }, { new: true })
        })
        Promise.all(orders).then(orders => io.emit('updatingStatus', { orders }))
    } catch (err) {
        console.log(err, 'err')
    }
}
