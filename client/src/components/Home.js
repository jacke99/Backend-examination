import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const Home = () => {
  const ref = useRef(false);

  const [channels, setChannels] = useState(null);
  const [refreshChannel, setRefreshChannel] = useState(null);
  const [renderChannel, setRenderChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [render, setRender] = useState(true);
  const [number, setNumber] = useState(null);
  const [channelTitle, setChannelTitle] = useState("");

  useEffect(() => {
    handleGetChannels();
  }, []);

  //Refresh only the channel that got a new message
  useEffect(() => {
    if (refreshChannel !== null && renderChannel !== null) {
      if (refreshChannel.title === renderChannel.title) {
        setRenderChannel(refreshChannel);
      }
    }
  }, [renderChannel, refreshChannel]);

  //Socket connection
  useEffect(() => {
    // if (ref.current === false) {
    //   ref.current = true;
    console.log(socket);
    socket.on("new-connection", (msg) => {
      console.log(msg);
    });
    socket.on("new-channel", handleGetChannels);

    socket.on("new-message", handleNewMessage);
    // }
  }, []);

  //Get JWT user info
  function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }

  //Get all channels
  async function handleGetChannels() {
    const authToken = sessionStorage.getItem("x-auth-token");
    const GET_CHANNEL_URL = "http://127.0.0.1:4040/ducks/api/channel/";

    const fetchOption = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(GET_CHANNEL_URL, fetchOption);
    const result = await response.json();

    setChannels(result);
  }

  //Refresh messages for specific channel
  async function handleNewMessage(data) {
    const authToken = sessionStorage.getItem("x-auth-token");
    console.log(data);

    const MESSAGE_URL = `http://127.0.0.1:4040/ducks/api/channel/${data.id}`;

    const fetchOption = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(MESSAGE_URL, fetchOption);
    const result = await response.json();
    setRefreshChannel(result);
  }

  function readChannel(event) {
    let channelIndex = event.target.getAttribute("value");

    setNumber(channelIndex);
    setRenderChannel(channels[channelIndex]);
    setRender(!render);
  }

  function handleMessage(event) {
    const value = event.target.value;
    setMessage(value);
  }

  async function sendMessage(event) {
    const authToken = sessionStorage.getItem("x-auth-token");
    const roomId = event.target.value;
    console.log(roomId);
    const SEND_MSG_URL = `http://127.0.0.1:4040/ducks/api/channel/${roomId}`;

    const messageData = {
      title: renderChannel.title,
      message: message,
      roomId: roomId,
    };

    const fetchOption = {
      method: "POST",
      body: JSON.stringify(messageData),
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(SEND_MSG_URL, fetchOption);
    await response.json();

    setMessage("");
  }

  function goBack() {
    setRender(!render);
  }

  async function createChannel() {
    const authToken = sessionStorage.getItem("x-auth-token");

    const CREATE_CHANNEL_URL = "http://127.0.0.1:4040/ducks/api/channel/";

    const channelData = {
      title: channelTitle,
    };
    const fetchOption = {
      method: "PUT",
      body: JSON.stringify(channelData),
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(CREATE_CHANNEL_URL, fetchOption);
    await response.json();
    setChannelTitle("");
  }

  function handleChannel(event) {
    const value = event.target.value;
    setChannelTitle(value);
  }

  async function deleteChannel(event) {
    const authToken = sessionStorage.getItem("x-auth-token");
    let value = event.target.value;
    const DELETE_URL = `http://127.0.0.1:4040/ducks/api/channel/${channels[value]._id}`;
    console.log(channels[value]);

    const fetchOption = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(DELETE_URL, fetchOption);
    console.log(response);
  }

  return (
    <div className="home-container">
      {render && (
        <div className="header-container">
          <input
            onChange={handleChannel}
            value={channelTitle}
            type="text"
            placeholder="Channel title..."
          />
          <button onClick={createChannel} className="create-channel-btn">
            Create new channel
          </button>
        </div>
      )}

      {render &&
        channels &&
        channels.map((channel, index) => {
          return (
            <div key={index} className="channel-container">
              <div onClick={readChannel} value={index}>
                <div value={index} className="channel-title">
                  {channel.title}
                </div>
                <p value={index} className="channel-created-by">
                  Created by: {channel.createdBy}
                </p>
              </div>
              <button
                className="delete-btn"
                value={index}
                onClick={deleteChannel}>
                Delete
              </button>
            </div>
          );
        })}
      {!render && renderChannel && (
        <div>
          <h3>{renderChannel.title}</h3>
          <button className="back-btn" onClick={goBack}>
            Back
          </button>
          <div className="message-container">
            <div className="chat-container">
              {renderChannel.messages.map((message, index) => {
                const authToken = sessionStorage.getItem("x-auth-token");
                let currentUser = parseJwt(authToken);
                let sentFrom;
                let sentFromContainer;
                if (message.from === currentUser.username) {
                  sentFrom = "my-message";
                  sentFromContainer = "my-message-container";
                } else {
                  sentFrom = "other-user-message";
                  sentFromContainer = "other-user-container";
                }
                return (
                  <div className={sentFromContainer} key={index}>
                    <div className={sentFrom}>
                      <div>{message.from}:</div>
                      <div>{message.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <input
                onChange={handleMessage}
                value={message}
                type="text"></input>
              <button onClick={sendMessage} value={channels[number]._id}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
