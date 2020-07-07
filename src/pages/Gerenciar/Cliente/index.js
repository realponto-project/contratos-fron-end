import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import ClienteContainer from "./ClienteContainer";

class DashClienteRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/logged/client/dash" component={ClienteContainer} />
      </Switch>
    );
  }
}

export default DashClienteRoute;
