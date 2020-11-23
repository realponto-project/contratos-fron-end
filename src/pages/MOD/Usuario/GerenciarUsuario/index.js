import React, { Component } from "react";
import { connect } from "react-redux";
import "./index.css";
import { Spin, Icon, Progress } from "antd";
import { BellOutlined, MailOutlined } from "@ant-design/icons";

import { GetAllUsers, UpdateUserTroll } from "../../../../services/user";

class GerenciarUsuario extends Component {
  state = {
    loading: false,
    total: 10,
    count: 0,
    page: 3,
    users: [],
  };

  componentWillMount = async () => {
    await this.getAllUsers();
  };

  getAllUsers = () => {
    GetAllUsers().then((resp) => this.setState({ users: resp.data }));
  };

  updateUserTroll = async (id, troll) => {
    const value = {
      id,
      userId: this.props.login.user.id,
      troll,
    };
    await UpdateUserTroll(value);

    await this.getAllUsers();
  };

  TableIgpm = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <label className="label-nome-troll">NOME</label>
          <label className="label-troll-troll">TROLL</label>
          <label className="label-button-troll">MÁGICA</label>
        </div>
      </div>
      <div className="div-lineMain-table">
        {this.state.users.map((user, index) => (
          <div className="div-line-table">
            <label className="label-nome-troll">{user.username}</label>
            <label className="label-troll-troll">
              {user.troll ? (
                <Icon
                  type="check-circle"
                  style={{ fontSize: "22px", color: "green" }}
                />
              ) : (
                <Icon
                  type="close-circle"
                  style={{ fontSize: "22px", color: "red" }}
                />
              )}
            </label>
            <div className="label-button-troll">
              <label class="switch">
                <input
                  type="checkbox"
                  checked={user.troll}
                  onClick={() => this.updateUserTroll(user.id, !user.troll)}
                />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  Pages = () => (
    <div className="div-pages">
      {Math.ceil(this.state.count / this.state.total) >= 5 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 1 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 4)}
        >
          {this.state.page - 4}
        </button>
      ) : null}
      {Math.ceil(this.state.count / this.state.total) >= 4 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 2 &&
      this.state.page > 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 3)}
        >
          {this.state.page - 3}
        </button>
      ) : null}
      {this.state.page >= 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 2)}
        >
          {this.state.page - 2}
        </button>
      ) : null}
      {this.state.page >= 2 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 1)}
        >
          {this.state.page - 1}
        </button>
      ) : null}
      <button className="button-paginacao-atual" type="primary">
        {this.state.page}
      </button>
      {this.state.page < this.state.count / this.state.total ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 1)}
        >
          {this.state.page + 1}
        </button>
      ) : null}
      {this.state.page + 1 < this.state.count / this.state.total ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 2)}
        >
          {this.state.page + 2}
        </button>
      ) : null}
      {this.state.page + 2 < this.state.count / this.state.total &&
      this.state.page < 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 3)}
        >
          {this.state.page + 3}
        </button>
      ) : null}
      {this.state.page + 3 < this.state.count / this.state.total &&
      this.state.page < 2 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 4)}
        >
          {this.state.page + 4}
        </button>
      ) : null}
    </div>
  );

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Gerenciar Usuario</h1>
          <div className="div-info-titulo">
            <div className="div-h3-titulo">
              <h4 style={{ margin: "0" }}>EMPRESA</h4>
              <Progress
                percent={50}
                status="active"
                style={{ padding: "0 !important" }}
              />
            </div>
            <div className="div-h3-titulo">
              <h4 style={{ margin: "0" }}>USUARIO</h4>
              <Progress
                percent={50}
                status="active"
                style={{ padding: "0 !important" }}
              />
            </div>
          </div>
          <div className="div-bell-titulo">
            <MailOutlined style={{ fontSize: "28px", marginRight: "20px" }} />
            <BellOutlined style={{ fontSize: "28px" }} />
          </div>
        </div>

        {this.state.loading ? (
          <div className="div-spin">
            <Spin />
          </div>
        ) : (
          <this.TableIgpm />
        )}
        <div className="div-main-pages">
          <this.Pages />
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

export default connect(mapStateToProps)(GerenciarUsuario);
