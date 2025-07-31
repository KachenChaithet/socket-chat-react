import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "please enter your fullName email and password" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at last 6 characters' })
        }

        const user = await User.findOne({ email })
        if (user) {

            return res.status(400).json({ message: 'Email already exists' })

        }
        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashPassword
        })

        if (newUser) {
            //genereate jwt token here
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })


        } else {
            res.status(400).json({ message: 'Invaild user data' })

        }

    } catch (error) {
        console.log("error in signup", error);
        res.status(500).json({ message: 'Invaild user data' })


    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!email) {
            return res.status(400).json({ message: "Invaild email " })
        }
        const checkpassword = await bcrypt.compare(password, user.password)
        if (!checkpassword) {
            return res.status(400).json({ message: "password not found" })
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("error in login", error);
        res.status(500).json({ message: 'Invaild user data' })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("error in logout", error);
        res.status(500).json({ message: 'fail logout' })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            res.status(400).json({ message: 'Profile Pic is required' })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json({ updateUser })

    } catch (error) {
        console.log("error in updateProfile", error);
        res.status(500).json({ message: 'fail updateProfile' })

    }
}
export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error in checkAuth", error);
        res.status(500).json({ message: 'fail checkAuth' })
    }
}