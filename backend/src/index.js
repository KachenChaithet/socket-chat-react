import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import http from 'http'

import authRoutes from './routes/authRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { connectDB } from './lib/db.js'
import { initSocket } from './lib/socket.js'

dotenv.config()
const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

// ⬇️ init socket.io
initSocket(server)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

// ⬇️ Serve frontend in production
const __dirname = path.resolve()
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(port, () => {
    console.log('✅ Server running on port:', port)
    connectDB()
})
