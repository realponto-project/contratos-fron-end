import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import GerenciarUsuario from "./GerenciarUsuario";

class GerenciarUsuarioRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/dashUsuario/dash"
          component={GerenciarUsuario}
        />
      </Switch>
    );
  }
}

export default GerenciarUsuarioRoute;
