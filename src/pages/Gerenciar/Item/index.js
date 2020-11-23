import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import ItemContainer from "./ItemContainer";

class DashItemRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/logged/item/dash" component={ItemContainer} />
      </Switch>
    );
  }
}

export default DashItemRoute;
