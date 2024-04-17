import express from "express";
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import UserRouter from "./routes/UserRoutes.js";
import OrderRouter from "./routes/OrderRoutes.js";
import { crons } from './crons/index.js'
import http from 'http'
import { Server as Socket } from 'socket.io'
import { engine } from 'express-handlebars';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express()
const server = http.createServer(app);

const io = new Socket(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})
export default io

dotenv.config()

// constants
const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/user', UserRouter)
app.use('/api/order', OrderRouter)

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./utils/mailer/"));

crons()

async function start() {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.jzrpvec.mongodb.net/${DB_NAME}`)
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }
    catch (err) {
        console.log(err);
    }
}
start()
