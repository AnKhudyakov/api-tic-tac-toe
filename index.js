import express from "express";
import dotenv from "dotenv";
import connectionWS from "./connectionWS/connectionWS.js";
import expressWs from "express-ws";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const WSServer = expressWs(app);
export const aWss = WSServer.getWss();

app.use(express.json());
app.ws("/", connectionWS);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server has been started on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
