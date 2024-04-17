import axios from "axios"
import { Order, User } from "../models/index.js"
import { getPlaceInfoById } from "../utils/getPlaceInfoById.js"
import { placesAround } from "../utils/placesAround.js"
import { getPhotoURL } from "../utils/getPhotoURL.js"
import order1 from '../mocks/order1.json' assert {type: 'json'};
import order2 from '../mocks/order2.json' assert {type: 'json'};
import stripe from 'stripe';
import dotenv from 'dotenv'
import { transporter } from "../utils/transporter.js"
import { successTemplate } from "../utils/mailer/index.js"

dotenv.config()

const stripeAPI = new stripe('sk_test_51O01aSBqy0qWUc2GPJUUFZHpFmmVycr8wTLiXpfTKnW5lrnPhKW37VAWhocUE37avvXvQPq35Q2t6wfMMHuXgzF600xqWbddlQ');

export const newOrder = async (req, res) => {
    try {
        const { time, address } = req.body
        const order = new Order({
            status: {
                text: "Not Registered",
            },
            time,
            address,
            user_id: req.userId,
        })
        await order.save()

        res.status(200).json({
            data: order,
            message: "Order was created, choose foods."
        })
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const getPlacesAroundMe = async (req, res) => {
    try {
        const { radius = 2000, lat, lng, type = "restourants" } = req.body
        await placesAround({ radius, lat, lng, type, res })
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const getPlacesAroundMeByOrderID = async (req, res) => {
    try {
        const { radius = 2000, orderID, type = "restourants" } = req.body
        const { address } = await Order.findById(orderID)
        await placesAround({ radius, lat: address.lat, lng: address.lng, type, res })
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const getPlaceById = async (req, res) => {
    try {
        const { place_id } = req.body
        const { data } = await getPlaceInfoById(place_id)
        const promiseArray = []
        for (let i = 0; i < data.result.photos.length; i++) {
            let promise = axios({
                url: getPhotoURL(data.result.photos[i].photo_reference),
                method: 'GET',
                responseType: 'arraybuffer'
            })
            promiseArray.push(promise)
        }
        Promise.all(promiseArray).then(resp => {
            data.result.photos.forEach((_, index) => {
                data.result.photos[index] = "data:image/jpeg;base64," + Buffer.from(resp[index].data, 'binary').toString('base64')
            })
            res.status(200).json({
                data,
                message: "Information about restaurant is got successfully."
            })
        });
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const setOrder = async (req, res) => {
    try {
        const { id } = req.body
        const order = await Order.findById(id)
        const updatedOrder = await Order.findByIdAndUpdate(id, { $push: { orders: order.orders.length ? order1 : order2 } }, { new: true })
        res.status(200).send({
            data: updatedOrder,
            message: `
                Your order in your trolley.
                Check it!   
            `
        })
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const { id } = req.body
        const order = await Order.find({ user_id: id })
        res.status(200).send({
            data: order,
            message: 'Your order was getting successfully.'
        })
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        let { source, customerID, amount, card, cardId, orders, userId } = req.body
        orders = orders.filter(order => !order.paid)
        stripeAPI.paymentMethods.list(
            {
                customer: customerID,
                type: 'card'
            },
        ).then(async (resp) => {
            try {
                if (cardId) {
                    await stripeAPI.charges.create({
                        amount: Math.round(amount / 4),
                        currency: 'usd',
                        source: cardId,
                        customer: customerID,
                        description: JSON.stringify({
                            info: 'Testy Food payment',
                            lastFour: card.last4
                        }),
                    })
                } else {
                    var { id: cardID, card: cardSource } = await stripeAPI.customers.createSource(
                        customerID,
                        { source }
                    );
                    await stripeAPI.charges.create({
                        amount: Math.round(amount / 4),
                        currency: 'usd',
                        source,
                        customer: customerID,
                        description: JSON.stringify({
                            info: 'Testy Food payment',
                            lastFour: card.last4
                        }),
                    })
                    if (!resp.data.find(elm => elm.card.fingerprint === cardSource.fingerprint)) {
                        await stripeAPI.paymentMethods.attach(
                            cardID,
                            { customer: customerID }
                        );
                        await User.findByIdAndUpdate(userId, {
                            $push: { cards: { cardID } }
                        })
                    } else {
                        await stripeAPI.paymentMethods.detach(
                            cardID
                        );
                    }
                }
                const changedOrders = []
                for (let i = 0; i < orders.length; i++) {
                    changedOrders.push(await Order.findByIdAndUpdate(orders[i]._id, { ...orders[i], status: { ...orders[i].status, text: "registration" }, paid: true, payment_method: "card" }, { new: true }))
                }
                const user = await User.findById(userId)
                const mailOptions = {
                    from: process.env.MAIL_AUTHENTICATION_USER,
                    to: user.email,
                    subject: 'Testy House Payment',
                    html: successTemplate
                };

                await transporter.sendMail(mailOptions)
                await User.findByIdAndUpdate(req.userId, { $addToSet: { addresses: changedOrders[0].address } })

                res.status(200).send({
                    data: { cardID, card: cardSource, changedOrders },
                    message: 'Your payment was done successfully.'
                })
            } catch (err) {
                res.status(406).json({ message: "Something went wrong." })
            }
        });
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}