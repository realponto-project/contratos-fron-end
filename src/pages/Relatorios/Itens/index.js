import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import RelatorioItens from "./RelatorioItens";

class RelatorioItensRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/relatorioItens/dash"
          component={RelatorioItens}
        />
      </Switch>
    );
  }
}

export default RelatorioItensRoute;
