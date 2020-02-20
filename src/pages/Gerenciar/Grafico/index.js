import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import GraficoContainer from "./GraficoContainer";

class GraficoRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/logged/grafico/dash" component={GraficoContainer} />
      </Switch>
    );
  }
}

export default GraficoRoute;
