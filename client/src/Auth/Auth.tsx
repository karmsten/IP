import auth0 from "auth0-js";
/* import { GetTokenSilentlyOptions } from "@auth0/auth0-react"; */

interface AuthResult {
  accessToken: any;
  idToken: any;
  expiresIn: any;
}

/* let getAccessTokenSilently: (
  options?: GetTokenSilentlyOptions | undefined
) => Promise<string>; */
const REDIRECT_ON_LOGIN: any = "redirect_on_login";

export default class Auth {
  private history: any;
  private auth0: auth0.WebAuth;
  private userProfile: any | null;
  private accessToken: string | null = null;
  private idToken: string | null = null;
  private expiresAt: number = 0;

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
    console.log("handleAuthentication ran");
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
        console.log("Access token set:", authResult.accessToken);
        /* console.log("accesstoken: ", accessToken); */
      } else if (err) {
        console.log(err.error);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  /* setSession = (authResult: AuthResult) => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt.toString());
  }; */
  setSession = (authResult: AuthResult) => {
    console.log("setSession ran");
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken || null;
    this.idToken = authResult.idToken || null;

    this.scheduleTokenRenewal();
  };

  /* isAuthenticated() {
    const expiresAtString = localStorage.getItem("expires_at");
    if (expiresAtString !== null) {
      const expiresAt = JSON.parse(expiresAtString);
      return new Date().getTime() < expiresAt;
    }
    return false;
  } */

  isAuthenticated() {
    console.log("isAuthenticated ran");
    return new Date().getTime() < this.expiresAt;
  }

  login = (): void => {
    console.log("login ran");
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize();
    console.log("logging in");
  };

  /* logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.userProfile = null;
    this.auth0.logout({
      clientID: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
      returnTo: import.meta.env.VITE_REACT_APP_FRONTEND_URL,
    });
  }; */
  logout = (): void => {
    console.log("logout ran");
    /*     this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.userProfile = null; */
    this.auth0.logout({
      clientID: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
      returnTo: import.meta.env.VITE_REACT_APP_FRONTEND_URL,
    });
  };

  getAccessToken = () => {
    console.log("getAccessToken ran");
    /* const accessToken = localStorage.getItem("access_token"); */
    if (!this.accessToken) {
      throw new Error("No access token found");
    }
    return this.accessToken;
  };

  getProfile = (
    cb: (profile: any, error: auth0.Auth0Error | null) => void
  ): void => {
    console.log("getProfile ran");
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

  renewToken(cb: (error: auth0.Auth0Error | null, result?: any) => void): void {
    console.log("renewToken ran");
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log("renewtoken in err");
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        /* console.log("renewToken in else"); */
        this.setSession(result);
      }
      cb(err, result);
    });
  }

  scheduleTokenRenewal() {
    const delay = this.expiresAt - Date.now();
    if (delay > 0) {
      setTimeout(
        () =>
          this.renewToken((err, result) => {
            if (err) {
              console.error("Error renewing token:", err);
            }
          }),
        delay
      );
    }
  }
}
