import User from "../models/userModel.js"
import Message from '../models/messageModel.js'
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log('error in getUsersForSidebar:', error);
        res.status(500).json({ error: "getUserForSidebar internal server error" })

    }
}
export const getMessages = async (req, res) => {
    try {
        const { id: userTochatId } = req.params
        const myId = req.user._id

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userTochatId },
                { senderId: userTochatId, receiverId: myId }
            ]
        })

        res.status(200).json(message)
    } catch (error) {
        console.log('error in getMessages:', error);
        res.status(500).json({ error: "getMessages internal server error" })

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user.id

        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage',newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log('error in sendMessage:', error);
        res.status(500).json({ error: "sendMessage internal server error" })
    }
}