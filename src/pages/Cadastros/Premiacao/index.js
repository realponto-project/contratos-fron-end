import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import PremiacaoContainer from "./PremiacaoContainer";

class NewPremiacaoRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/newPremiacao/add"
          component={PremiacaoContainer}
        />
      </Switch>
    );
  }
}

export default NewPremiacaoRoute;
