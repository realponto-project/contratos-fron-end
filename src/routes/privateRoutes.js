import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./index.css";
import { Icon } from "antd";

import { TrophyOutlined } from "@ant-design/icons";

import PagesRoute from "../pages";
import SideBar from "../components/SideBar";

class PrivateRoute extends Component {
  state = {
    display: "none"
  };

  render() {
    return (
      <div className="div-main-route">
        <div
          className="div-sideBar"
          onMouseOver={() => this.setState({ display: "block" })}
          onMouseLeave={() => this.setState({ display: "none" })}
        >
          {this.state.display === "block" ? (
            <SideBar />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50px",
                height: "100%"
              }}
            >
              <div className="menuIcon"></div>
              <Icon
                type="plus"
                style={{
                  fontSize: "20px",
                  color: "white",
                  margin: "15px 0 5px 0"
                }}
              />
              <Icon
                type="bar-chart"
                style={{
                  fontSize: "20px",
                  color: "white",
                  margin: "20px 0 20px 0"
                }}
              />
              <Icon
                type="edit"
                style={{
                  fontSize: "20px",
                  color: "white",
                  margin: "5px 0 20px 0"
                }}
              />
              <Icon
                type="dollar"
                style={{ fontSize: "20px", color: "white", margin: "5px 0" }}
              />
              <Icon
                type="file-pdf"
                style={{ fontSize: "20px", color: "white", margin: "25px 0" }}
              />
              <TrophyOutlined
                style={{ fontSize: "20px", color: "white", margin: "5px 0" }}
              />
            </div>
          )}
        </div>
        <div className="div-main-body">
          <div
            className={`div-block-switch ${this.props.login.user &&
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
