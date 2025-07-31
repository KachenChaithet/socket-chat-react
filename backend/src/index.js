import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import messageRoutes from './routes/messageRoutes.js'
import cors from 'cors'
import { app, server } from './lib/socket.js'

import path from 'path'


dotenv.config()
const port = process.env.PORT || 5000
const __dirname = path.resolve();



app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

if (process.env.NODE_ENV === "production") {
    let distPath, indexPath;
    try {
        distPath = path.resolve(__dirname, "../frontend/dist");
        indexPath = path.resolve(distPath, "index.html");
        console.log("[PROD] Serving static from:", distPath);
        console.log("[PROD] Index.html path:", indexPath);
    } catch (err) {
        console.error("[PROD] Error resolving static paths:", err);
    }

    try {
        app.use((req, res, next) => {
            console.log(`[PROD] Static middleware: ${req.method} ${req.url}`);
            next();
        });
        app.use(express.static(distPath));
    } catch (err) {
        console.error("[PROD] Error setting up static middleware:", err);
    }

    // Use regex to match all routes except those containing a dot (static assets)
    app.get(/^((?!\.).)*$/, (req, res) => {
        console.log(`[PROD] Fallback route: ${req.method} ${req.url}`);
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error("[PROD] Failed to send index.html:", err);
                res.status(500).send("Error loading app");
            } else {
                console.log("[PROD] Sent index.html successfully");
            }
        });
    });
}

server.listen(port, () => {
    console.log('Server runnign on Port:', port);
    connectDB()

})