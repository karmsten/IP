import auth0 from "auth0-js";

interface AuthResult {
  accessToken: any;
  idToken: any;
  expiresIn: any;
  /* expiresAt: number; */
}

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
      responseType: "token id_token",
      scope: "openid profile email",
    });
  }
  /*   generateRandomState = (): string => {
    const state = Math.random().toString(36).substring(2);
    // Store the generated state securely, e.g., in session storage or a private variable
    return state;
  }; */
  /*   login = (): void => {
    const state = this.generateRandomState();
    // Store the state securely, e.g., in session storage or a private variable
    this.auth0.authorize({
      state, // Include the generated state in the request
    });
  }; */

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
        console.log(accessToken, idToken, expiresIn);
      } else if (err) {
        console.log(err.error);
        /* this.history.push("/"); */
        /* alert(`Error: ${err.error}. See console for further details.`); */
      }
    });
  };
  /*   handleAuthentication = (): void => {
    this.auth0.parseHash((err, authResult) => {
      if (!authResult) {
        console.log("authResult is undefined");
        return; // Exit the function if authResult is undefined
      }
      if (
        authResult.accessToken !== undefined &&
        authResult.idToken !== undefined
      ) {
        const { accessToken, idToken, expiresIn = 0 } = authResult;
        const result: AuthResult = {
          accessToken: accessToken || "",
          idToken,
          expiresIn,
        };
        this.setSession(result);
        this.history.push("/");
      } else {
        // Handle scenario where authResult values are initially undefined
        console.log("Initial authentication");
      }
    });
  }; */

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
      returnTo: "http://localhost:5173/",
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
