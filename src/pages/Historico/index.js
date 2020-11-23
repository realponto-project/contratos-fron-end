import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import HistoricoContainer from "./HistoricoContainer";

class HistoricoRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/history/dash"
          component={HistoricoContainer}
        />
      </Switch>
    );
  }
}

export default HistoricoRoute;
