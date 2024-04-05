import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({
  path: "./.env",
});
console.log("PORT::", process.env.PORT);

console.log(`Server started at PORT ${process.env.PORT}`);
