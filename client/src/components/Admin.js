import React, { useState } from "react";

const Admin = () => {
  const [inputValues, setInputValues] = useState({
    title: "",
    message: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInputValues((previnputValues) => {
      return {
        ...previnputValues,
        [name]: value,
      };
    });
  }

  async function sendBroadcasts() {
    const authToken = sessionStorage.getItem("x-auth-token");
    const BROADCAST_URL = "http://127.0.0.1:4040/ducks/api/broadcast/";

    const broadcastData = {
      title: inputValues.title,
      message: inputValues.message,
    };

    const fetchOption = {
      method: "POST",
      body: JSON.stringify(broadcastData),
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(BROADCAST_URL, fetchOption);
    console.log(response);
    setInputValues({
      title: "",
      message: "",
    });
  }
  return (
    <div className="admin-container">
      <h3>Admin page</h3>

      <div className="admin-broadcast-container">
        <h3>Create broadcast</h3>
        <div className="admin-input-container">
          <input
            onChange={handleChange}
            value={inputValues.title}
            name="title"
            className="title-field"
            type="text"
            placeholder="Title..."
          />
          <textarea
            onChange={handleChange}
            value={inputValues.message}
            name="message"
            className="text-field"
            type="text"
            placeholder="Message..."
          />
          <button className="broadcast-btn" onClick={sendBroadcasts}>
            Create broadcast
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
