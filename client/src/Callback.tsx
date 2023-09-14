import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import Auth from "./Auth/Auth";

interface CallbackProps extends RouteComponentProps {
  auth: Auth;
}

const Callback: React.FC<CallbackProps> = (props) => {
  useEffect(() => {
    if (/access_token|id_token|error/.test(props.location.hash)) {
      props.auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback URL.");
    }
  }, [props.location.hash, props.auth]);

  return <h1>Potatoes are boiling...</h1>;
};

export default Callback;
