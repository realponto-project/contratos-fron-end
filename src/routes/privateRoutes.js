import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./index.css";

import { RightOutlined } from "@ant-design/icons";

import PagesRoute from "../pages";
import SideBar from "../components/SideBar";

class PrivateRoute extends Component {
  state = {
    display: "none",
  };

  render() {
    return (
      <div className="div-main-route">
        <div
          className="div-sideBar"
          onMouseOver={() => this.setState({ display: "block" })}
        >
          {this.state.display === "block" ? (
            <SideBar />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RightOutlined style={{ fontSize: "20px" }} />
            </div>
          )}
        </div>
        <div
          className="div-main-body"
          onMouseOver={() => this.setState({ display: "none" })}
        >
          <div
            className={`div-bSMTPyarn ody ${
              this.props.login.user && this.props.login.user.troll && "troll"
            }`}
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
    login: state.login,
  };
}

export default connect(mapStateToProps)(PrivateRoute);
