// socket.js
import { io } from "socket.io-client";

const URL = "http://localhost:3000"; // Backend ka URL
const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
