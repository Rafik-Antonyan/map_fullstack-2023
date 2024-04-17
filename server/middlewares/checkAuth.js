import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || "").split(" ")[1]
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = decoded.id
            next()
        } catch (err) {
            return res.status(405).json({
                message: "not accessed"
            })
        }
    } else {
        return res.status(405).json({
            message: "not accessed"
        })
    }

}