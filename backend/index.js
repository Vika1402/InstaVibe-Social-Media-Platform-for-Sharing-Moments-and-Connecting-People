import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dbConnect } from "./database/dbConnect.js";
import { router } from "./routers/router.js";
import { connectCloudinary } from "./utils/cloudinary.js";
import { app, server } from "./socket/socket.js";
dotenv.config();
connectCloudinary();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use("/api", router);
app.get("/", (req, res) => {
  res.json({ message: "server is running .." });
});

server.listen(process.env.PORT, () => {
  dbConnect();
  console.log(`Server is runninmg on port ${process.env.PORT}`);
});
