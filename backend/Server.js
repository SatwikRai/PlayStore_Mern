import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRouter.js";
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import reviewRoutes from './routes/ReviewRoutes.js'
import cors from "cors";
import { createServer } from 'http';

import { Server } from 'socket.io';




//configure env
dotenv.config({ path: '../.env' });

//databse config
connectDB();

//rest object
const app = express();

//middelwares
let corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);

//...
const http = createServer(app);
const io = new Server(http, { cors: corsOptions });

io.on("connection", (socket) => {
    console.log("a user connected :D");
    socket.on("admin message", (msg) => {
        io.emit("user message", msg);
    });
    socket.on("user message", (msg) => {
        io.emit("admin message", msg);
    });
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
http.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
