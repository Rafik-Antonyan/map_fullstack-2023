import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import stripe from 'stripe';
import { User } from "../models/index.js";
import { transporter } from '../utils/transporter.js';
import { htmlContent } from '../utils/mailer/index.js';
const stripeAPI = new stripe('sk_test_51O01aSBqy0qWUc2GPJUUFZHpFmmVycr8wTLiXpfTKnW5lrnPhKW37VAWhocUE37avvXvQPq35Q2t6wfMMHuXgzF600xqWbddlQ');

// Register
export const register = async (req, res) => {
    try {
        const { email, password, name, surname } = req.body
        const isUsed = await User.findOne({ email })
        if (isUsed) {
            return res.json({
                message: "Email already is used"
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            email,
            name,
            surname,
            password: hash
        })

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        await newUser.save()

        res.status(200).json({
            data: newUser,
            token: `Bearer ${token}`,
            message: `
                Registration was done successfully
            `
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: "Something went wrong."
        })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({
            email
        })

        if (!user) {
            return res.status(403).json({ message: "user not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "wrong password" })
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(200).json({
            token: `Bearer ${token}`,
            data: user,
            message: "You're loggined"
        })
    } catch (err) {
        res.status(403).json({
            message: "Something went wrong."
        })
    }
}

// Get Me
export const getMe = async (req, res) => {
    try {
        let user = await User.findById(req.userId)
        if (!user) {
            return res.status(403).json({ message: "Please login." })
        }
        let cards = []
        let cardsPromises = []
        for (let i = 0; i < user.cards.length; i++) {
            cardsPromises.push(stripeAPI.customers.retrieveSource(
                user.customerID,
                user.cards[i].cardID
            ));
        }

        if (cardsPromises.length) {
            Promise.all(cardsPromises).then(cardsData => {
                cards.push(...cardsData.map((card, index) => {
                    card.card.id = user.cards[index].cardID
                    return card.card
                }))
            }).then(() => {
                const token = jwt.sign(
                    {
                        id: user._id
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                )
                res.status(200).json({
                    data: { ...Object.values(user)[2], cards },
                    token: `Bearer ${token}`,
                    message: "User is got successfully"
                })
                return
            })
        } else {
            const token = jwt.sign(
                {
                    id: user._id
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            )
            res.status(200).json({
                data: user,
                token: `Bearer ${token}`,
                message: "User is got successfully"
            })
        }
    } catch (err) {
        res.status(403).json({ message: "Not accessed" })
    }
}

export const deleteUserCard = async (req, res) => {
    try {
        const { email } = await User.findById(req.userId)
        const { data } = await stripeAPI.customers.search({
            query: `email:\'${email}\'`,
        });
        const deleted = await stripeAPI.customers.deleteSource(
            data[0].id,
            req.body.cardId
        );
        if (deleted.id) {
            await User.findOneAndDelete({ "cards.cardID": req.body.cardId })
            res.status(200).json({ message: "Card was deleted successfully", data: deleted.id })
        } else {
            res.status(406).json({ message: "Card doesn't attached to user" })
        }
    } catch (err) {
        res.status(407).json({ message: "Deleting card was failed", data: deleted.id })
    }
}


export const addNewCard = async (req, res) => {
    try {
        let { customerID, source } = req.body

        if (!customerID) {
            const { name, email } = await User.findById(req.userId)
            const { id } = await stripeAPI.customers.create({
                email,
                name,
                description: 'New customer'
            })
            customerID = id
        }
        const { id: cardID } = await stripeAPI.customers.createSource(
            customerID,
            { source }
        );
        await User.findByIdAndUpdate(req.userId, { customerID, $push: { cards: { cardID } } })
        const { card: cardInfo } = await stripeAPI.customers.retrieveSource(
            customerID,
            cardID
        )
        res.status(200).json({
            data: cardInfo,
            message: "New card was added successfully"
        })
    } catch (err) {
        console.log(err, 'errorororoo');
        res.status(407).json({ message: "Adding new card was failed" })
    }
}

export const addNewAddress = async (req, res) => {
    try {
        const { address } = req.body
        await User.findByIdAndUpdate(req.userId, { $push: { addresses: address } })
        res.status(200).json({
            data: address,
            message: "New address was added successfully"
        })
    } catch (err) {
        console.log(err, 'errorororoo');
        res.status(407).json({ message: "Adding new card was failed" })
    }
}

export const clientSecret = async (req, res) => {
    try {
        let customerID = ""
        const { name, email } = await User.findById(req.userId)
        const { data } = await stripeAPI.customers.search({
            query: `email:\'${email}\'`,
        });

        if (!data.length) {
            const { id } = await stripeAPI.customers.create({
                email,
                name,
                description: 'New customer'
            })
            customerID = id
            await User.findByIdAndUpdate(req.userId, { customerID })
        } else {
            customerID = data[0].id
        }
        res.status(200).send({
            data: customerID,
            message: 'Your client_secret was getted successfully.'
        })
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const editUserInfo = async (req, res) => {
    try {
        const { data } = req.body
        const user = await User.findById(req.userId)
        const formattedData = {}
        data.forEach(elm => {
            formattedData[elm.name] = elm.value
        })
        if (formattedData["password"] && formattedData["new password"] && formattedData["confirm password"]) {
            const isPasswordCorrect = await bcrypt.compare(formattedData["password"], user.password)

            if (!isPasswordCorrect) {
                return res.status(403).json({ message: "wrong password" })
            }

            if (formattedData["new password"] === formattedData["confirm password"]) {
                const salt = bcrypt.genSaltSync(10)
                formattedData.password = bcrypt.hashSync(formattedData["new password"], salt)
            } else {
                return res.status(406).json({ message: "passwords are not the same" })
            }
        }
        for (const key in formattedData) {
            if (formattedData.hasOwnProperty(key) && key.split(' ').length === 2) {
                delete formattedData[key];
            }
        }
        const updatedUser = await User.findByIdAndUpdate(req.userId, formattedData, { new: true })
        res.status(200).json({ message: "Information is updated successfully", data: updatedUser })
    } catch (err) {
        res.status(406).json({ message: "Something went wrong." })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { _id } = req.body
        await User.findByIdAndUpdate(_id, { verified: true })
        res.status(200).send({
            message: "Your account is verified.",
            data: true
        })
    } catch (err) {
        res.status(406).json({ message: "Something went wrong." })
    }
}


export const sendVerificationMail = async (req, res) => {
    try {
        const { email } = await User.findById(req.userId)
        const mailOptions = {
            from: process.env.MAIL_AUTHENTICATION_USER,
            to: email,
            subject: 'Testy House Verify',
            html: htmlContent(req.userId)
        };
        await transporter.sendMail(mailOptions)
        res.send({
            message: "Check your email"
        })
    } catch (err) {
        res.status(407).json({
            message: "Something went wrong."
        })
    }
}