import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { jwtCheck } from "./middlewares";

dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT || 3001;

const domain = process.env.AUTH0_DOMAIN;
/* console.log(`JWKS URI: https://${domain}/.well-known/jwks.json`);
console.log("AUDIENCE: " + process.env.AUTH0_AUDIENCE); */


app.get("/public", function (req, res) {
  res.json({
    message: "Hello from a public API!",
  });
});

app.get("/private", jwtCheck, function (req, res) {
  console.log("Reached /private route");
  console.log("req.user:", req.user);
  res.json({
    message: "Hello from a private API!",
  });
});

/* app.listen(3001);
console.log(
  "API server listen on " + process.env.AUTH0_AUDIENCE
); */
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

