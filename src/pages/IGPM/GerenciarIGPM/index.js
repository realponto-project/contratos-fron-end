import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import DashIgpmContainer from "./DashIgpmContainer";

class DashIgpmRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/dashIgpm/dash"
          component={DashIgpmContainer}
        />
      </Switch>
    );
  }
}

export default DashIgpmRoute;
