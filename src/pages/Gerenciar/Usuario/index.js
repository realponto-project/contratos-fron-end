import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import UserContainer from "./UserContainer";

class UserRoute extends Component {
  render() {
    return (
      <Switch>
        <div
          className={`${this.props.login.user &&
            this.props.login.user.troll &&
            "troll"}`}
          style={{ width: "100vw", height: "100vh" }}
        >
          <Route exact path="/logged/user/dash" component={UserContainer} />
        </div>
      </Switch>
    );
  }
}

export default UserRoute;
