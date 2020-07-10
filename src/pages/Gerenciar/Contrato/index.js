import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import ContratoContainer from "./ContratoContainer";

class DashContratoRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/contrato/dash"
          component={ContratoContainer}
        />
      </Switch>
    );
  }
}

export default DashContratoRoute;
