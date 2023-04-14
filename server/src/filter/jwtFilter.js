import jwtUtil from "../util/jwtUtil.js";

// Verify that each request has a valid jwt token
function authorize(request, response, next) {
  const authHeader = request.headers["authorization"];

  if (authHeader == undefined) {
    response.status(400);
    response.send("Authorization header is missing");
  } else {
    const authToken = authHeader.replace("Bearer ", "");

    try {
      jwtUtil.verify(authToken);
      next();
    } catch (err) {
      console.log(request.ip, err.serverMessage);

      response.status(403).send(err.clientMessage);
    }
  }
}

// Verify that each request has a valid jwt token with "ADMIN" role
function authorizeAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const authToken = authHeader.replace("Bearer ", "");
  const decoded = jwtUtil.verify(authToken);
  if (authHeader == undefined) {
    res.status(400); //bad request
    res.send("Authorization header is missing");
  } else {
    if (decoded.role == "ADMIN") {
      next();
    } else {
      res.status(403).send("You do not have the admin role");
    }
  }
}

export default { authorize, authorizeAdmin };
