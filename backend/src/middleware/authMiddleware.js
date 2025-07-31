import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/userModel.js'
dotenv.config()

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: 'Unauthoriezed - NO Token Provided' })
        }
        const decodeed = jwt.verify(token, process.env.JWT_SECRET)

        if (!decodeed) {
            return res.status(401).json({ message: 'Unauthoriezed -  Invaild Token' })

        }

        const user = await User.findById(decodeed.userId).select('-password')

        if (!user) {
            return res.status(401).json({ message: 'User not found' })

        }

        req.user = user

        next()

    } catch (error) {
        console.log('middlerware', error);
        return res.status(500).json({ message: 'middlerware error' })

    }
}
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log('checkAuth', error);

        return res.status(500).json({ message: 'checkAuth error' })

    }
}