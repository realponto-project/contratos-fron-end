import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import NewItemContainer from "./NewItemContainer";

class NewItemRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/logged/newItem/add" component={NewItemContainer} />
      </Switch>
    );
  }
}

export default NewItemRoute;
