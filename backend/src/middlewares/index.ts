import jwksRsa, { GetVerificationKey } from 'jwks-rsa';
import { expressjwt } from 'express-jwt';
import { auth } from "express-oauth2-jwt-bearer";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();


//not in use
export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-z3ejygllsvz3xfet.us.auth0.com/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: "http://localhost:3001",
  issuer: `https://dev-z3ejygllsvz3xfet.us.auth0.com`,
  algorithms: ['RS256'],
});

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE, // AUTH0_AUDIENCE
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`, // AUTH0_DOMAIN
  tokenSigningAlg: "RS256",
});

export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const corsOptions = {
  origin: process.env.FRONTEND_URL, // Replace with your frontend's URL
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};