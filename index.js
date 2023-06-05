import express from "express";
import dotenv from "dotenv";
//import cors from "cors";
//import mongoose from "mongoose";
//import authRouter from "./routes/auth/authRouter.js";
import connectionWS from "./connectionWS/connectionWS.js";
import expressWs from "express-ws";
//import messageRouter from "./routes/message/messageRouter.js";
//import userRouter from "./routes/user/userRouter.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const WSServer = expressWs(app);
export const aWss = WSServer.getWss();

// app.use(
//   cors({
//     origin: ["http://localhost:3000", process.env.CLIENT_URL],
//   })
// );
app.use(express.json());
//app.use("/auth", authRouter);
//app.use("/messages", messageRouter);
//app.use("/users", userRouter);
app.ws("/", connectionWS);

async function start() {
  try {
    // await mongoose
    //   .connect(process.env.MONGODB_KEY, {
    //     useNewUrlParser: true,
    //   })
    //   .then(() => console.log("DB Connection Successfull!"))
    //   .catch((err) => {
    //     console.log(err);
    //   });

    app.listen(PORT, () => {
      console.log(`🚀 Server has been started on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
