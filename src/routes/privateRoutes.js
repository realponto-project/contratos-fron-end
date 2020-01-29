import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import PagesRoute from "../pages";

class PrivateRoute extends Component {
  state = {
    auth: true
  };

  render() {
    return (
      <Switch>
        <Route path="/logged" component={PagesRoute} />
      </Switch>
    );
  }
}

export default PrivateRoute;
