import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./index.css";

import PagesRoute from "../pages";
import SideBar from "../components/SideBar";

class PrivateRoute extends Component {
  render() {
    return (
      <div className="div-main-route">
        <div className="div-sideBar">
          <SideBar />
        </div>
        <div className="div-main-body">
          <div
            className={`div-body ${this.props.login.user &&
              this.props.login.user.troll &&
              "troll"}`}
          >
            <Switch>
              <Route path="/logged" component={PagesRoute} />
            </Switch>
          </div>
          <div className="div-footer-main">
            © DEVELOPED BY JESSI LEANDRO AND GUILHERME STAIN
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

export default connect(mapStateToProps)(PrivateRoute);
