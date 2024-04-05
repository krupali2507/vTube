import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({
  path: "./.env",
});
console.log("PORT::", process.env.PORT);
