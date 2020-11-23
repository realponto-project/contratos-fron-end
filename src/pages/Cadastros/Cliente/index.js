import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import NewClientContainer from "./NewClientContainer";

class NewClientRoute extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/logged/newClient/add"
          component={NewClientContainer}
        />
      </Switch>
    );
  }
}

export default NewClientRoute;
