import { useState } from "react";
import { Route, RouteComponentProps, Redirect } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";

interface AppProps extends RouteComponentProps {}

function App(props: AppProps) {
  const auth = new Auth(props.history);

  return (
    <>
      <Nav auth={auth} />
      <div className="body">
        <Route
          path="/"
          exact
          render={(props) => <Home auth={auth} {...props} />}
        />
        <Route
          path="/callback"
          render={(props) => <Callback auth={auth} {...props} />}
        />
        <Route
          path="/profile"
          render={(props) =>
            auth.isAuthenticated() ? (
              <Profile auth={auth} {...props} />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route path="/public" component={Public} />
      </div>
    </>
  );
}

export default App;
