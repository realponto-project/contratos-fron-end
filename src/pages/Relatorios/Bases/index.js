import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import RelatorioBases from "./RelatorioBases";

class RelatorioBasesRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/relatorioBases/dash"
          component={RelatorioBases}
        />
      </Switch>
    );
  }
}

export default RelatorioBasesRoute;
