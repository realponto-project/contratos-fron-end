import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";

import { Icon } from "antd";

class UserContainer extends Component {
  state = {
    nome: "",
    senha: "",
    email: "",
    telefone: "",
    search: ""
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo-usuario">
          <h1 className="h1-titulo">Usuario</h1>
          <div className="div-search-usuario">
            <input
              className="input-search-usuario"
              onChange={this.onChange}
              placeholder="Pesquisar"
              value={this.state.search}
              name="search"
            ></input>
            <Icon
              type="search"
              style={{ fontSize: "18px", marginRight: "5px" }}
            />
          </div>
        </div>

        <div className="div-main">
          <div className="div-info-usuario">
            <input
              className="input-info-usuario"
              onChange={this.onChange}
              placeholder="Nome"
              value={this.state.nome}
              name="nome"
            ></input>

            <input
              className="input-info-usuario"
              onChange={this.onChange}
              placeholder="Senha"
              value={this.state.senha}
              name="senha"
            ></input>

            <input
              className="input-info-usuario"
              onChange={this.onChange}
              placeholder="E-mail"
              value={this.state.email}
              name="email"
            ></input>

            <input
              className="input-info-usuario"
              onChange={this.onChange}
              placeholder="Telefone"
              value={this.state.telefone}
              name="telefone"
            ></input>
          </div>

          <div className="div-permissoes-main-usuario">
            <label style={{ fontFamily: "Bebas", fontSize: "20px" }}>
              Permissoes
            </label>
            <div className="div-permissoes-usuario"></div>
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar">Salvar</button>
          <button className="button-excluir">Excluir</button>
        </div>
      </div>
    );
  }
}

export default UserContainer;
