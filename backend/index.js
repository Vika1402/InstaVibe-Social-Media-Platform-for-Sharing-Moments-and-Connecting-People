import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dbConnect } from "./database/dbConnect.js";
dotenv.config();
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "server is running .." });
});
app.listen(process.env.PORT, () => {
  console.log(`Server is runninmg on port ${process.env.PORT}`);
  dbConnect();
});
