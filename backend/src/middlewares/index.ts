import jwksRsa, { GetVerificationKey } from 'jwks-rsa';
import { expressjwt } from 'express-jwt';
import { auth } from "express-oauth2-jwt-bearer";


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
  audience: "http://localhost:3001", // AUTH0_AUDIENCE
  issuerBaseURL: "https://dev-z3ejygllsvz3xfet.us.auth0.com/", // AUTH0_DOMAIN
  tokenSigningAlg: "RS256",
});