import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
// import { readFileSync } from "fs";

// const privateKey = readFileSync("./config/private.pem");
// const publicKey = readFileSync("./config/public.pem");

function generateServerToken() {
  let payloadOptions = {
    issuer: "express-server",
    subject: "server-communication",
    expiresIn: "15m", // 15 minutes
  };

  let token = jwt.sign({}, process.env.SUPER_SECRET, payloadOptions);

  return token;
}

function generate(user) {
  // registered claims (pre defined payload variables)
  let payloadOptions = {
    issuer: "phone-duck-inc",
    subject: "user access token",
    expiresIn: "15m", // 15 minutes
    // algorithm: "RS256",
  };

  // private claims (custom payload)
  let payload = {
    username: user.username,
    role: user.role,
  };

  let token = jwt.sign(payload, process.env.SUPER_SECRET, payloadOptions);

  return token;
}

function verify(token) {
  try {
    return jwt.verify(token, process.env.SUPER_SECRET); // verify signature and return payload
  } catch (err) {
    let verfError = new Error(); //custom verification error

    if (err.name == "JsonWebTokenError") {
      verfError.clientMessage = "Digital signing is invalid, request new token";
      verfError.serverMessage = "Token verification failed";
    }

    if (err.name == "TokenExpiredError") {
      verfError.clientMessage = "Digital signing is invalid, request new token";
      verfError.serverMessage = "Token expired";
    }

    throw verfError;
  }
}

function getUser(req) {
  const authHeader = req.headers["authorization"];
  const authToken = authHeader.replace("Bearer ", "");
  const decoded = jwt.verify(authToken, process.env.SUPER_SECRET);
  return decoded;
}

export default { generate, verify, getUser, generateServerToken };
