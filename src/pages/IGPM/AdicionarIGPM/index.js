import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import NewIgpmContainer from "./NewIgpmContainer";

class NewIgpmRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/logged/newIgpm/add" component={NewIgpmContainer} />
      </Switch>
    );
  }
}

export default NewIgpmRoute;
