import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./index.css";

import PagesRoute from "../pages";
import SideBar from "../components/SideBar";

class PrivateRoute extends Component {
  state = {
    auth: true
  };

  render() {
    return (
      <div className="div-main-route">
        <div className="div-sideBar">
          <SideBar />
        </div>
        <div className="div-body">
          <Switch>
            <Route path="/logged" component={PagesRoute} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default PrivateRoute;
