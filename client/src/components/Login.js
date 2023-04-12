import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState({
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

  async function handleLogin() {
    const LOGIN_URL = "http://127.0.0.1:4040/ducks/api/login/";

    const loginData = {
      username: inputValues.username,
      password: inputValues.password,
    };

    const fetchOption = {
      method: "PUT",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(LOGIN_URL, fetchOption);
    console.log(response);
    if (response.status === 200) {
      const authToken = await response.text();
      sessionStorage.setItem("x-auth-token", authToken);
    }
  }

  async function onLoginClick() {
    await handleLogin();

    const authToken = sessionStorage.getItem("x-auth-token");

    if (authToken === null) {
      console.log("No auth token found");
      return false;
    } else {
      navigate("/Home");
    }
  }

  function onCreateAccountClick() {
    navigate("/CreateAccount");
  }
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="input-container">
          <label htmlFor="username-field">Username</label>
          <input
            onChange={handleChange}
            type="text"
            name="username"
            value={inputValues.username}
            className="username-field"
          />
        </div>
        <div className="input-container">
          <label htmlFor="password-field">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            value={inputValues.password}
            className="password-field"
          />
        </div>
        <div className="btn-container">
          <button onClick={onLoginClick} className="log-in-btn">
            Log in
          </button>
          <button onClick={onCreateAccountClick} className="home-btn">
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
