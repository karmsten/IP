import auth0 from "auth0-js";
import { GetTokenSilentlyOptions } from "@auth0/auth0-react";

interface AuthResult {
  accessToken: any;
  idToken: any;
  expiresIn: any;
}

let getAccessTokenSilently: (
  options?: GetTokenSilentlyOptions | undefined
) => Promise<string>;

export default class Auth {
  private history: any;
  private auth0: auth0.WebAuth;
  private userProfile: any | null;

  constructor(history: any) {
    this.userProfile = null;
    this.history = history;
    this.auth0 = new auth0.WebAuth({
      domain: import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN,
      clientID: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL,
      audience: import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: "openid profile email",
    });
  }

  handleAuthentication = (): void => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        const { accessToken, idToken, expiresIn = 0 } = authResult; // Provide default value
        const result: AuthResult = {
          accessToken: accessToken || "",
          idToken,
          expiresIn,
        };
        this.setSession(result);
        this.history.push("/");
        /* console.log("accesstoken: ", accessToken); */
      } else if (err) {
        console.log(err.error);
      }
    });
  };

  setSession = (authResult: AuthResult) => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt.toString());
  };

  isAuthenticated() {
    const expiresAtString = localStorage.getItem("expires_at");
    if (expiresAtString !== null) {
      const expiresAt = JSON.parse(expiresAtString);
      return new Date().getTime() < expiresAt;
    }
    return false;
  }
  login = (): void => {
    this.auth0.authorize();
    console.log("logging in");
  };

  logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.userProfile = null;
    this.auth0.logout({
      clientID: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
      returnTo: import.meta.env.VITE_REACT_APP_FRONTEND_URL,
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return accessToken;
  };

  getProfile = (
    cb: (profile: any, error: auth0.Auth0Error | null) => void
  ): void => {
    if (this.userProfile) {
      cb(this.userProfile, null);
    } else {
      this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
        if (profile) {
          this.userProfile = profile;
          cb(profile, null);
        } else {
          cb(null, err);
        }
      });
    }
  };
}
