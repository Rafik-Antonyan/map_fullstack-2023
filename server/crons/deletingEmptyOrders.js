import OrderModel from '../models/OrderModel.js'

export const deletingEmptyOrders = async () => {
    const now = new Date();
    const tenMinutesAgo = new Date(now - 10 * 60 * 1000); // minus 10 min
    await OrderModel.deleteMany({
        orders: { $size: 0 },
        createdAt: {
            $lt: tenMinutesAgo,
        },
    })
} 