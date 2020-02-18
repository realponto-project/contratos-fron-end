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
    open: [""]
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
        case "user_dash":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/user/dash"
              }}
            />
          );
        case "dashConsulta_dash":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/dashConsulta/dash"
              }}
            />
          );
        case "newClient_add":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/newClient/add"
              }}
            />
          );
        case "newItem_add":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/newItem/add"
              }}
            />
          );
        case "newContrato_add":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/newContrato/add"
              }}
            />
          );
        case "newIgpm_add":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/newIgpm/add"
              }}
            />
          );
        case "dashIgpm_dash":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/dashIgpm/dash"
              }}
            />
          );
        case "relatorioItens_dash":
          return (
            <Redirect
              push
              to={{
                pathname: "/logged/relatorioItens/dash"
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
          <Tooltip placement="bottom" title={"Contratos"}>
            <Icon
              className="menuIcon-icon"
              type="file-add"
              onClick={() =>
                this.handleClickCompany(" newContrato_add", "Cadastros")
              }
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Gráficos"}>
            <Icon
              type="pie-chart"
              className="menuIcon-icon"
              onClick={() => this.handleClickCompany("dash", "Gerenciar")}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Consulta"}>
            <Icon
              className="menuIcon-icon"
              type="edit"
              onClick={() =>
                this.handleClickCompany("dashConsulta_dash", "Consulta")
              }
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"IGPM"}>
            <Icon
              className="menuIcon-icon"
              type="dollar"
              onClick={() => this.handleClickCompany("dashIgpm_dash", "IGPM")}
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
            key="Cadastros"
            title={
              <span>
                <Icon type="plus" />
                <span>Cadastros</span>
              </span>
            }
          >
            <Menu.Item key="newClient_add">
              <Icon type="user-add" />
              Cliente
            </Menu.Item>

            <Menu.Item key="newItem_add">
              <Icon type="tablet" />
              Item
            </Menu.Item>

            <Menu.Item key="newContrato_add">
              <Icon type="file-add" />
              Contratos
            </Menu.Item>
          </SubMenu>
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

            <Menu.Item key="user_dash">
              <Icon type="user-add" />
              Usuário
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="Consulta"
            title={
              <span>
                <Icon type="edit" />
                <span>Consulta</span>
              </span>
            }
          >
            <Menu.Item key="dashConsulta_dash">
              <Icon type="ordered-list" />
              Gerenciar
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="IGPM"
            title={
              <span>
                <Icon type="dollar" />
                <span>IGPM</span>
              </span>
            }
          >
            <Menu.Item key="newIgpm_add">
              <Icon type="user-add" />
              Adicionar
            </Menu.Item>
            <Menu.Item key="dashIgpm_dash">
              <Icon type="ordered-list" />
              Gerenciar
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="Relatorios"
            title={
              <span>
                <Icon type="file-pdf" />
                <span>Relatórios</span>
              </span>
            }
          >
            <Menu.Item key="relatorioItens_dash">
              <Icon type="ordered-list" />
              Itens
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

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(SideBar);
