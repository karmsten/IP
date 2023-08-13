import auth0 from "auth0-js";

export default class Auth {
  private history: any;
  private auth0: auth0.WebAuth;

  constructor(history: any) {
    this.history = history;
    this.auth0 = new auth0.WebAuth({
      domain: import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN ?? "",
      clientID: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID ?? "",
      redirectUri: import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL,
      responseType: "token id_token",
      scope: "openid profile email",
    });
  }

  login = () => {
    this.auth0.authorize();
  };
}
