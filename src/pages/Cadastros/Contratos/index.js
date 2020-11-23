import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import NewContratosContainer from "./NewContratosContainer";

class NewContratosRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/newContrato/add"
          component={NewContratosContainer}
        />
      </Switch>
    );
  }
}

export default NewContratosRoute;
