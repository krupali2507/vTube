import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
const DB_NAME = process.env.DB_NAME;
console.log("🚀 ~ DB_NAME:", DB_NAME);
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
console.log("🚀 ~ CONNECTION_STRING:", CONNECTION_STRING);
console.log(`${CONNECTION_STRING}${DB_NAME}`);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${CONNECTION_STRING}${DB_NAME}`
    );
    console.log("Server connected to the database successfully!");
  } catch (error) {
    console.log("Error while connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
