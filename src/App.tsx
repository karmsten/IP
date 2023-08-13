import { useState } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";

interface AppProps extends RouteComponentProps {}

function App(props: AppProps) {
  const auth = new Auth(props.history);

  return (
    <>
      <Nav />
      <div className="body">
        <Route
          path="/"
          exact
          render={(props) => <Home auth={auth} {...props} />}
        />
        <Route path="/profile" exact component={Profile} />
      </div>
    </>
  );
}

export default App;
