import React, { Component } from "react";
import { Menu, Icon, Tooltip } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import "antd/dist/antd.css";
import "./index.css";

import { Logout } from "../../pages/Login/LoginRedux/action";

const SubMenu = Menu.SubMenu;

class SideBar extends Component {
  state = {
    current: "0",
    redirect: false,
    open: ["Gerenciar"]
  };

  handleClickCompany = async (current, keyPath) => {
    this.setState({
      current,
      redirect: true,
      open: [keyPath]
    });
  };

  changeRedirectState = () => {
    this.setState({
      redirect: false
    });
  };

  handleClickAtalhos = async (current, keyPath) => {
    this.setState({
      current,
      redirect: true,
      open: [keyPath]
    });
  };

  handleClick = async e => {
    this.setState({
      current: e.key,
      redirect: true,
      open: [e.keyPath[1]]
    });
  };

  render() {
    if (this.state.redirect) {
      this.changeRedirectState();
      switch (this.state.current) {
        case "novoUsuario_add":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/novoUsuario/add",
                state: { from: this.props.location }
              }}
            />
          );
        case "logout":
          return <Redirect to="/login" />;
        default:
          return <Redirect to="/logged/dash" />;
      }
    }
    return (
      <div>
        <div className="menuIcon">
          <Tooltip placement="bottom" title={"Gráficos"}>
            <Icon
              type="pie-chart"
              className="menuIcon-icon"
              onClick={() => this.handleClickCompany("dash", "Gerenciar")}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Logout"}>
            <Icon
              key="logout"
              className="menuIcon-icon"
              type="logout"
              // onClick={() => this.logout()}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Logout"}>
            <Icon
              key="logout"
              className="menuIcon-icon"
              type="logout"
              onClick={() => this.props.Logout()}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Logout"}>
            <Icon
              key="logout"
              className="menuIcon-icon"
              type="logout"
              // onClick={() => this.logout()}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Logout"}>
            <Icon
              key="logout"
              className="menuIcon-icon"
              type="logout"
              // onClick={() => this.logout()}
            />
          </Tooltip>
        </div>

        <Menu
          className="menu"
          theme="dark"
          onClick={this.handleClick}
          defaultOpenKeys={this.state.open}
          selectedKeys={[this.state.current]}
          mode="inline"
        >
          <SubMenu
            key="Gerenciar"
            title={
              <span>
                <Icon type="bar-chart" />
                <span>Gerenciar</span>
              </span>
            }
          >
            <Menu.Item key="dash">
              <Icon type="pie-chart" />
              Gráficos
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ Logout }, dispach);
}

function mapStateToProps(state) {
  return {
    state: state
  };
}

export default connect(mapStateToProps, mapDispacthToProps)(SideBar);
