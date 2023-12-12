import React, { useState, useEffect, useMemo } from "react";
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
import Quotations from "./Quotations/Quotations";
import QuotationPage from "./QuotationPage/QuotationPage";

interface AppProps extends RouteComponentProps {}

const App: React.FC<AppProps> = (props) => {
  const [auth] = useState(() => new Auth(props.history));
  const [tokenRenewalComplete, setTokenRenewalComplete] = useState(false);
  const isAuthenticated = auth.isAuthenticated();

  useEffect(() => {
    const renewToken = async () => {
      try {
        await auth.renewToken((err: any, result: any) => {
          if (err) {
            console.error("Error renewing token:", err);
            throw new Error("Token renewal failed");
          }
          setTokenRenewalComplete(true);
        });
      } catch (error) {
        console.error("Error renewing token:", error);
      }
    };

    renewToken();
  }, [auth]);

  /* if (!tokenRenewalComplete) return <div>Loading........</div>; */

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
        {isAuthenticated && (
          <Route
            path="/customers"
            render={(props) => <Customers auth={auth} {...props} />}
          />
        )}
        {isAuthenticated && (
          <Route
            path="/products"
            render={(props) => <Products auth={auth} {...props} />}
          />
        )}

        {isAuthenticated && (
          <Route
            path="/quotations"
            render={(props) => <Quotations auth={auth} {...props} />}
          />
        )}

        <Route
          path="/customer/:customerId"
          render={(props) => <CustomerPage auth={auth} {...props} />}
        />
        <Route
          path="/product/:productId"
          render={(props) => <ProductPage auth={auth} {...props} />}
        />
        <Route
          path="/quotation/:quotationId"
          render={(props) => <QuotationPage auth={auth} {...props} />}
        />
      </div>
    </>
  );
};

export default App;
