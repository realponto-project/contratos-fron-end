import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { Logout } from "./Login/LoginRedux/action";
// import moment from "moment";

import Dash from "./Dash";

class PagesRoute extends Component {
  state = {
    auth: true
  };

  componentDidMount = async () => {
    // console.log("test");
    await promisify(jwt.verify)(
      this.props.login.token,
      // this.props.login.token,
      "%dfsJd"
    )
      .then(resp => {
        console.log(resp);
      })
      .catch(error => {
        console.log(error);
        this.props.Logout();
      });
  };

  render() {
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

function mapDispacthToProps(dispach) {
  return bindActionCreators({ Logout }, dispach);
}

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

export default connect(mapStateToProps, mapDispacthToProps)(PagesRoute);
