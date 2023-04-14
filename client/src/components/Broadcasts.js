import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

const Broadcasts = () => {
  const ref = useRef(false);

  const [broadcasts, setBroadcasts] = useState(null);

  useEffect(() => {
    handleNewConnect();
  }, []);
  useEffect(() => {
    if (ref.current === false) {
      ref.current = true;
      console.log(socket);
      socket.on("new-connection", handleNewConnect);
      socket.on("new-broadcast", handleNewConnect);
    }
  }, []);

  async function handleNewConnect(data) {
    console.log("Yay, new connection!");

    const GET_BROADCAST_URL = "http://127.0.0.1:4040/ducks/api/broadcast/";

    const fetchOption = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(GET_BROADCAST_URL, fetchOption);
    const result = await response.json();
    setBroadcasts(result);
  }

  return (
    <div className="home-container">
      {broadcasts &&
        broadcasts.map((broadcast, index) => {
          return (
            <div className="channel-container" key={index}>
              <h3 className="channel-title">{broadcast.title}</h3>
              <p>{broadcast.message}</p>
              <p className="channel-created-by">{broadcast.uploadedAt}</p>
            </div>
          );
        })}
      <h2>Broadcasts</h2>
    </div>
  );
};

export default Broadcasts;
