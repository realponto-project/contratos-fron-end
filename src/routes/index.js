import React from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import PrivateRoute from "./privateRoutes";

import LoginPage from "../pages/Login";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <PrivateRoute path="/logged" />
      <Redirect to="/login" />
    </Switch>
  </BrowserRouter>
);

export default Routes;
