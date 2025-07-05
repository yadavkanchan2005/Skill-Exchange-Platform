// socket.js
import { io } from "socket.io-client";

const URL = "https://skill-exchange-platform-pamq.onrender.com";
const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
