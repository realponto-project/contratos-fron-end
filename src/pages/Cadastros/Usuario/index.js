import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import UserContainer from "./UserContainer";

class NewUserRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/logged/newUser/add" component={UserContainer} />
      </Switch>
    );
  }
}

export default NewUserRoute;
