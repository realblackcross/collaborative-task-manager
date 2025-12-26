import { io } from "socket.io-client";

export const socket = io("https://collaborative-task-manager-phxp.onrender.com", {
  autoConnect: false,
});
