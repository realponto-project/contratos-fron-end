import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import UserContainer from "./UserContainer";

class UserRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/logged/user/dash" component={UserContainer} />
      </Switch>
    );
  }
}

export default UserRoute;
