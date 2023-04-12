import express from "express";
import cors from "cors";
import router from "./src/router/router.js";

const addr = "127.0.0.1";
const port = 4040;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/ducks/api", router);

app.get("/health", (req, res) => {
  res.send({ state: "Up", message: "Server is healthy" });
});

app.listen(port, addr, () => {
  console.log(`Server is listening on port: ${port}`);
});
