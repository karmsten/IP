import jwksRsa, { GetVerificationKey } from 'jwks-rsa';
import { expressjwt } from 'express-jwt';
import { Request, Response, NextFunction } from 'express';
import { auth } from "express-oauth2-jwt-bearer";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE, // AUTH0_AUDIENCE
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`, // AUTH0_DOMAIN
  tokenSigningAlg: "RS256",
});

/* export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}); */
export const dbp = mysql.createPool({
  connectionLimit: 10, // Adjust the limit as per your requirement
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const corsOptions = {
  origin: process.env.FRONTEND_URL, // Replace with your frontend's URL
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
