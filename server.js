import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.get("/public", function (req, res) {
  res.json({
    message: "Hello from a public API!",
  });
});

app.listen(3001);
console.log(
  "API server listen on " + process.env.VITE_REACT_APP_AUTH0_AUDIENCE
);
