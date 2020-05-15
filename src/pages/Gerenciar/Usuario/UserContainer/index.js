import React, { Component } from "react";
import { Icon, Checkbox, message, Input } from "antd";
import * as R from "ramda";
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
    descricao: "",
    fieldErrors: {
      nome: false,
      senha: false,
      email: false,
      telefone: false,
    },
    addClient: false,
    addItem: false,
    addContract: false,
    addUser: false,
    addIgpm: false,
  };

  onChange = (e) => {
    const { name, value } = masks(e.target.name, e.target.value);

    this.setState({
      [name]: value,
    });
  };

  onChangeEmail = (e) => {
    const { name, value } = masks(e.target.name, e.target.value);

    this.setState({
      [name]: value,
    });
  };

  clearState = () => {
    this.setState({
      nome: "",
      senha: "",
      email: "",
      telefone: "",
      search: "",
      descricao: "",
      fieldErrors: {
        nome: false,
        senha: false,
        email: false,
        telefone: false,
      },
      addClient: false,
      addItem: false,
      addContract: false,
      addUser: false,
      addIgpm: false,
    });
  };

  newUser = async () => {
    const {
      nome: username,
      senha: password,
      telefone: telphone,
      descricao: description,
      email,
      addClient,
      addItem,
      addContract,
      addUser,
      addIgpm,
    } = this.state;

    const value = {
      username,
      password,
      telphone,
      email,
      description,
      resources: {
        addClient,
        addItem,
        addContract,
        addUser,
        addIgpm,
      },
    };

    const { status, data } = await NewUser(value);

    if (status === 200) {
      this.clearState();
      message.success("Usuario cadatrado com sucesso");
    } else if (status === 422) {
      R.keys(data.errors[0].field).map((key) =>
        this.setState({
          fieldErrors: {
            ...this.state.fieldErrors,
            [key]: data.errors[0].field,
          },
        })
      );
    }
  };

  onFocus = (e) => {
    const { name } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: false },
    });
  };

  onBlur = (e) => {
    let { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) },
    });
  };

  onChengeCheckbox = (e) => {
    const { name, checked } = e.target;
    this.setState({ [name]: checked });
  };

  render() {
    const state = this.state;
    const { fieldErrors } = state;
    return (
      <div className="card-main">
        <div className="div-titulo-usuario">
          <h1 className="h1-titulo">Usuario</h1>
        </div>

        <div className="div-main-usuario">
          <div className="div-info-usuario">
            <input
              className={`input-info-usuario ${
                fieldErrors.nome && "input-error"
              }`}
              onChange={this.onChange}
              placeholder="NOME"
              value={state.nome}
              name="nome"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            ></input>

            <input
              className={`input-info-usuario ${
                fieldErrors.email && "input-error"
              }`}
              style={{ textTransform: "none" }}
              onChange={this.onChangeEmail}
              placeholder="E-MAIL"
              value={state.email}
              name="email"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            ></input>

            <input
              className={`input-info-usuario ${
                fieldErrors.telefone && "input-error"
              }`}
              onChange={this.onChange}
              placeholder="TELEFONE"
              value={state.telefone}
              name="telefone"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            ></input>

            <input
              className={`input-info-usuario ${
                fieldErrors.senha && "input-error"
              }`}
              style={{ textTransform: "none" }}
              onChange={this.onChange}
              placeholder="SENHA"
              value={state.senha}
              name="senha"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              // type="password"
            ></input>

            <textarea
              className={`textArea-descricao-item ${
                fieldErrors.descricao && "input-error"
              }`}
              style={{ marginTop: "20px" }}
              value={this.state.descricao}
              placeholder="DIGITE A DESCRIÇÃO"
              name="descricao"
              rows="4"
              onChange={this.onChange}
              // onFocus={onFocus}
            ></textarea>
          </div>

          <div className="div-permissoes-main-usuario">
            <label style={{ fontFamily: "Bebas", fontSize: "20px" }}>
              Permissoes
            </label>
            <div className="div-permissoes-usuario">
              <Checkbox
                name="addClient"
                onChange={this.onChengeCheckbox}
                checked={this.state.addClient}
              >
                Adicionar Cliente
              </Checkbox>
              <Checkbox
                name="addItem"
                onChange={this.onChengeCheckbox}
                checked={this.state.addItem}
              >
                Adicionar Item
              </Checkbox>
              <Checkbox
                name="addContract"
                onChange={this.onChengeCheckbox}
                checked={this.state.addContract}
              >
                Adicionar Contrato
              </Checkbox>
              <Checkbox
                name="addUser"
                onChange={this.onChengeCheckbox}
                checked={this.state.addUser}
              >
                Adicionar Usuário
              </Checkbox>
              <Checkbox
                name="addIgpm"
                onChange={this.onChengeCheckbox}
                checked={this.state.addIgpm}
              >
                Adicionar Igpm
              </Checkbox>
            </div>
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-excluir-cliente">Excluir</button>
          <button className="button-salvar-cliente" onClick={this.newUser}>
            Salvar
          </button>
        </div>
      </div>
    );
  }
}

export default UserContainer;
