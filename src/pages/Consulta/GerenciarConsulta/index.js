import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import GerenciarConsultaContainer from "./GerenciarConsultaContainer";

class DashConsultaRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/dashConsulta/dash"
          component={GerenciarConsultaContainer}
        />
      </Switch>
    );
  }
}

export default DashConsultaRoute;
