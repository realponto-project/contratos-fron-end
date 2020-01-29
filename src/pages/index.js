import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Dash from "./Dash";

class PagesRoute extends Component {
  state = {
    auth: true
  };

  render() {
    console.log("state", this.props.login);
    if (this.props.login.token) {
      return (
        <Switch>
          <Route exact path="/logged/dash" component={Dash} />
        </Switch>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

export default connect(mapStateToProps)(PagesRoute);
