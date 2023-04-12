import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValues] = useState({
    username: "",
    password: "",
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
  async function createUser() {
    const CREATE_URL = "http://127.0.0.1:4040/ducks/api/create/account/";

    const loginData = {
      username: inputValue.username,
      password: inputValue.password,
    };

    const fetchOption = {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(CREATE_URL, fetchOption);

    if (response.status === 200) {
      console.log("Account was created");
      navigate("/");
    } else {
      console.log("Could not create account");
    }
  }

  function onCreateClick() {
    createUser();
    navigate("/");
  }
  function backBtn() {
    navigate("/");
  }

  return (
    <div>
      <section className="account-page">
        <h1>Create account</h1>
        <div className="login-input-container">
          <label htmlFor="input-username">Username</label>
          <input
            name="username"
            onChange={handleChange}
            value={inputValue.username}
            className="create-username"
            type="text"
            required
          />
          <label htmlFor="input-password">Password</label>
          <input
            name="password"
            onChange={handleChange}
            value={inputValue.password}
            className="create-password"
            type="password"
            required
          />
        </div>
        <button onClick={backBtn} className="back-btn">
          Back
        </button>
        <button onClick={onCreateClick} className="home-btn">
          Create account
        </button>
      </section>
    </div>
  );
};

export default CreateAccount;
