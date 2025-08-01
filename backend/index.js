import express, { response } from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import geminiResponse from "./gemini.js";

const app = express();

app.use(cors({
    origin: "https://ai-virtual-assistant-cf04.onrender.com",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);



const port = process.env.PORT || 3000;

app.listen(port, () => {
    connectDb();
    console.log("Server started on port", port);
});
