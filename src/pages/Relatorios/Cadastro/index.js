import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import RelatorioCadastroContainer from "./RelatorioCadastroContainer";

class RelatorioCadastroRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/relatorioCadastro/dash"
          component={RelatorioCadastroContainer}
        />
      </Switch>
    );
  }
}

export default RelatorioCadastroRoute;
