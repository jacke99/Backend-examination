import { io } from "socket.io-client";

let URL = "ws://127.0.0.1:4000/";

export const socket = io(URL, {
  extraHeaders: {
    authorization: "Bearer " + sessionStorage.getItem("x-auth-token"),
  },
});
