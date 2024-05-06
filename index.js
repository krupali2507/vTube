import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { mongoDBConnect } from "./src/config/index.js";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

dotenv.config({
  path: "./.env",
});
console.log("PORT::", process.env.PORT);
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
console.log("🚀 ~ CONNECTION_STRING:", CONNECTION_STRING);

mongoDBConnect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started at PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed!`);
  });

import { userRoutes } from "./src/routes/index.js";
import { InternalLinks } from "./src/constants/index.js";
import { userController } from "./src/controllers/index.js";

app.use(InternalLinks.Users.BASE_URL, userRoutes);
