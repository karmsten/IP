import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import Auth from "./Auth/Auth";

interface CallbackProps extends RouteComponentProps {
  auth: Auth;
}

export default class Callback extends Component<CallbackProps> {
  componentDidMount = () => {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback URL.");
    }
  };
  render() {
    return <h1>Potatoes are boiling...</h1>;
  }
}
