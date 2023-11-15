import React, { useState } from "react";
import { Route, RouteComponentProps, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Nav from "./Nav/Nav";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Customers from "./Customers/Customers";
import CustomerPage from "./CustomerPage/CustomerPage";
import Products from "./Products/Products";
import ProductPage from "./ProductPage/ProductPage";

interface AppProps extends RouteComponentProps {}

const App: React.FC<AppProps> = (props) => {
  const [auth] = useState(() => new Auth(props.history));

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
        <Route
          path="/customers"
          render={(props) => <Customers auth={auth} {...props} />}
        />
        <Route
          path="/products"
          render={(props) => <Products auth={auth} {...props} />}
        />
        <Route
          path="/customer/:customerId"
          render={(props) => <CustomerPage auth={auth} {...props} />}
        />
        <Route
          path="/product/:productId"
          render={(props) => <ProductPage auth={auth} {...props} />}
        />
      </div>
    </>
  );
};

export default App;
