import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Progress, Button, Input, Select } from "antd";
import { MailOutlined, BellOutlined, EditOutlined } from "@ant-design/icons";
import { GetAllUsers } from "../../../../services/user";
import { Redirect } from "react-router-dom";
import { setUser } from "../../../Relatorios/Cadastro/cadastroRedux/action";

class UserContainer extends Component {
  state = {
    avancado: false,
    nome: undefined,
    email: undefined,
    telefone: undefined,
    rows: [],
    total: 10,
    count: 0,
    page: 1,
    show: 0,
    redirect: "",
  };

  componentDidMount = async () => {
    await this.getAllUsers();
  };

  getAllUsers = async () => {
    const query = {
      filters: {
        user: {
          specific: {
            username: this.state.nome,
            email: this.state.email,
            telphone: this.state.telefone,
          },
        },
        page: this.state.page,
        total: this.state.total,
      },
    };

    const { status, data } = await GetAllUsers(query);

    if (status === 200)
      this.setState({
        rows: data.rows,
        page: data.page,
        count: data.count,
        show: data.show,
      });
  };

  onChange = async (e) => {
    const { name, value } = e.target;

    await this.setState({ [name]: value });
    await this.getAllUsers();
  };

  setUserRedux = (user) => {
    console.log(user);
    const {
      deletedAt,
      id: userId,
      username,
      email,
      telphone,
      awardBoolean,
      description,
      resource,
      typeAccount,
      award,
    } = user;
    this.props.setUser({
      deletedAt: !!deletedAt,
      userId,
      username,
      email,
      telphone,
      description,
      awardBoolean,
      resource,
      typeAccount,
      award,
    });

    this.setState({ redirect: "/logged/newUser/add" });
  };

  changePages = async (pages) => {
    await this.setState(
      {
        page: pages,
      },
      () => {
        this.getAllUsers();
      }
    );
  };

  Pages = () => (
    <div className="div-pages">
      {Math.ceil(this.state.count / this.state.total) >= 5 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 1 ? (
        <button
          className="button-salvar"
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
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 3)}
        >
          {this.state.page - 3}
        </button>
      ) : null}
      {this.state.page >= 3 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 2)}
        >
          {this.state.page - 2}
        </button>
      ) : null}
      {this.state.page >= 2 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 1)}
        >
          {this.state.page - 1}
        </button>
      ) : null}
      <div className="div-teste">{this.state.page}</div>
      {this.state.page < this.state.count / this.state.total ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 1)}
        >
          {this.state.page + 1}
        </button>
      ) : null}
      {this.state.page + 1 < this.state.count / this.state.total ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 2)}
        >
          {this.state.page + 2}
        </button>
      ) : null}
      {this.state.page + 2 < this.state.count / this.state.total &&
      this.state.page < 3 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 3)}
        >
          {this.state.page + 3}
        </button>
      ) : null}
      {this.state.page + 3 < this.state.count / this.state.total &&
      this.state.page < 2 ? (
        <button
          className="button-salvar"
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
          <h1 className="h1-titulo">Usuario</h1>
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
        <div className="div-main-client-dash">
          <div className="div-block-search-gerClient">
            <Button
              onClick={() => this.setState({ avancado: !this.state.avancado })}
            >
              {this.state.avancado ? "Ocultar" : "Avançar"}
            </Button>
            {this.state.avancado && (
              <div className="div-block-input-search-gerClient">
                <Input
                  value={this.state.nome}
                  name="nome"
                  placeholder="nome"
                  style={{ width: "25%" }}
                  onChange={this.onChange}
                />
                <Input
                  value={this.state.email}
                  name="email"
                  placeholder="email"
                  style={{ width: "25%" }}
                  onChange={this.onChange}
                />
                <Input
                  value={this.state.telefone}
                  name="telefone"
                  placeholder="telefone"
                  style={{ width: "25%" }}
                  onChange={this.onChange}
                />
              </div>
            )}
          </div>

          <div className="div-main-table-client">
            <table>
              <tr>
                <th style={{ width: "30%" }}>nome</th>
                <th style={{ width: "30%" }}>e-mail</th>
                <th style={{ width: "30%" }}>telefone</th>
                <th style={{ width: "10%" }}>ação</th>
              </tr>

              {this.state.rows.map((row) => (
                <tr>
                  {console.log(row)}
                  <td>{row.username}</td>
                  <td>{row.email}</td>
                  <td>{row.telphone}</td>
                  <td>
                    <EditOutlined
                      className="icon-edit"
                      onClick={() => this.setUserRedux(row)}
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div className="div-paginacao">
            <this.Pages />
          </div>
        </div>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ setUser }, dispach);
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, mapDispacthToProps)(UserContainer);
