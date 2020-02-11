import React, { Component } from "react";
import { Icon, Checkbox, message } from "antd";
import "../../../../global.css";
import "./index.css";
import { validator, masks } from "./validator";
import { NewUser } from "../../../../services/user";

class UserContainer extends Component {
  state = {
    nome: "",
    senha: "",
    email: "",
    telefone: "",
    search: "",
    fieldErrors: {
      nome: false,
      senha: false,
      email: false,
      telefone: false
    }
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);

    this.setState({
      [name]: value
    });
  };

  clearState = () => {
    this.setState({
      nome: "",
      senha: "",
      email: "",
      telefone: "",
      search: "",
      fieldErrors: {
        nome: false,
        senha: false,
        email: false,
        telefone: false
      }
    });
  };

  newUser = async () => {
    const {
      nome: username,
      senha: password,
      telefone: telphone,
      email
    } = this.state;

    const value = {
      username,
      password,
      telphone,
      email
    };

    const { status } = await NewUser(value);

    if (status === 200) {
      this.clearState();
      message.success("Usuario cadatrado com sucesso");
    }
  };

  onFocus = e => {
    const { name } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: false }
    });
  };

  onBlur = e => {
    let { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) }
    });
  };

  render() {
    const state = this.state;
    const { fieldErrors } = state;
    return (
      <div className="card-main">
        <div className="div-titulo-usuario">
          <h1 className="h1-titulo">Usuario</h1>
          <div className="div-search-usuario">
            <input
              className="input-search-usuario"
              onChange={this.onChange}
              placeholder="PESQUISAR"
              value={state.search}
              name="search"
            ></input>
            <Icon
              type="search"
              style={{
                fontSize: "18px",
                marginRight: "5px",
                cursor: "pointer"
              }}
            />
          </div>
        </div>

        <div className="div-main-usuario">
          <div className="div-info-usuario">
            <input
              className={`input-info-usuario ${fieldErrors.nome &&
                "input-error"}`}
              onChange={this.onChange}
              placeholder="NOME"
              value={state.nome}
              name="nome"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            ></input>

            <input
              className={`input-info-usuario ${fieldErrors.senha &&
                "input-error"}`}
              onChange={this.onChange}
              placeholder="SENHA"
              value={state.senha}
              name="senha"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              // type="password"
            ></input>

            <input
              className={`input-info-usuario ${fieldErrors.email &&
                "input-error"}`}
              onChange={this.onChange}
              placeholder="E-MAIL"
              value={state.email}
              name="email"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            ></input>

            <input
              className={`input-info-usuario ${fieldErrors.telefone &&
                "input-error"}`}
              onChange={this.onChange}
              placeholder="TELEFONE"
              value={state.telefone}
              name="telefone"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            ></input>
          </div>

          <div className="div-permissoes-main-usuario">
            <label style={{ fontFamily: "Bebas", fontSize: "20px" }}>
              Permissoes
            </label>
            <div className="div-permissoes-usuario">
              <Checkbox value="B">B</Checkbox>
              <Checkbox value="B">B</Checkbox>
              <Checkbox value="B">B</Checkbox>
            </div>
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar" onClick={this.newUser}>
            Salvar
          </button>
          <button className="button-excluir">Excluir</button>
        </div>
      </div>
    );
  }
}

export default UserContainer;
