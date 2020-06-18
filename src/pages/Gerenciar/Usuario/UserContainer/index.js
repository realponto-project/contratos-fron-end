import React, { Component } from "react";
import { Input, Checkbox, message, Modal, Select, Tooltip, Switch } from "antd";
import * as R from "ramda";
import "../../../../global.css";
import "./index.css";
import { validator, masks } from "./validator";
import { NewUser } from "../../../../services/user";
import {
  NewTypeAccount,
  GetAllTypeAccounts,
} from "../../../../services/typeAccount";
import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

class UserContainer extends Component {
  state = {
    nome: "",
    senha: "",
    confirmarSenha: "",
    email: "",
    telefone: "",
    search: "",
    descricao: "",
    premiacao: false,
    fieldErrors: {
      nome: false,
      senha: false,
      email: false,
      telefone: false,
      confirmarSenha: false,
    },
    addClient: false,
    addItem: false,
    addContract: false,
    addUser: false,
    addIgpm: false,
    typeAccounts: [],
    visible: false,
    grupo: "",
    equacao: "",
    typeAccountId: "",
  };

  componentDidMount = async () => {
    await this.getAllTypeAccounts();
  };

  getAllTypeAccounts = async () => {
    const { status, data } = await GetAllTypeAccounts();

    if (status === 200) this.setState({ typeAccounts: data.rows });
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
      confirmarSenha: "",
      email: "",
      telefone: "",
      search: "",
      descricao: "",
      fieldErrors: {
        nome: false,
        senha: false,
        email: false,
        telefone: false,
        confirmarSenha: false,
      },
      addClient: false,
      addItem: false,
      addContract: false,
      addUser: false,
      addIgpm: false,
      grupo: "",
      equacao: "",
      typeAccountId: "",
    });
  };

  newUser = async () => {
    const {
      nome: username,
      confirmarSenha,
      senha: password,
      telefone: telphone,
      descricao: description,
      typeAccountId,
      email,
      addClient,
      addItem,
      addContract,
      addUser,
      addIgpm,
      premiacao: award,
    } = this.state;

    if (confirmarSenha !== password) {
      message.error("senha incompatível");
      return;
    }

    const value = {
      username,
      password,
      telphone,
      email,
      description,
      typeAccountId,
      award,
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
    const { fieldErrors, senha, confirmarSenha } = this.state;

    if (name === "confirmarSenha") {
      fieldErrors.confirmarSenha = senha !== confirmarSenha;
    }

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) },
    });
  };

  onChengeCheckbox = (e) => {
    const { name, checked } = e.target;
    this.setState({ [name]: checked });
  };

  onChangeSelect = (typeAccountId) => {
    this.setState({ typeAccountId });
  };

  ModalNewTypeAccount = () => (
    <Modal
      title="Novo Tipo de Conta"
      visible={this.state.visible}
      onOk={this.newTypeAccount}
      onCancel={this.handleCancel}
    >
      <div className="div-block-input-premio" style={{ marginTop: "0" }}>
        <label>Grupo</label>
        <Input
          name="grupo"
          className={`${this.state.fieldErrors.grupo ? "input-error" : null}`}
          value={this.state.grupo}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
      </div>
      <div className="div-block-input-premio">
        <label>
          Equeção{" "}
          <Tooltip
            mouseEnterDelay={0.2}
            trigger={["click"]}
            placement="right"
            title={`São aceitos apenas numeros, "+" para soma, "-" para subtração, "*" para multiplicação, "/" para divisão, "^" para exponeciação, "(" e ")" para indicar a importância da operação e "x" para representar o valor do item`}
          >
            <InfoCircleOutlined style={{ fontSize: "10px" }} />
          </Tooltip>
        </label>
        <Input
          name="equacao"
          className={`${this.state.fieldErrors.equacao ? "input-error" : null}`}
          value={this.state.equacao}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
      </div>
    </Modal>
  );

  newTypeAccount = async () => {
    const { grupo: group, equacao: equation } = this.state;
    const value = { group, equation };
    const { status } = await NewTypeAccount(value);
    if (status === 200) {
      this.setState({
        grupo: "",
        equacao: "",
        fieldErrors: {
          grupo: false,
          equacao: false,
        },
        visible: false,
      });
      message.success("sucesso");
      await this.getAllTypeAccounts();
    } else {
      message.error("erro");
    }
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const state = this.state;
    const { fieldErrors } = state;
    return (
      <div className="card-main">
        <div className="div-main-usuario">
          <div className="div-info-usuario">
            <label style={{ fontFamily: "Bebas", fontSize: "20px" }}>
              Usuario
            </label>
            <input
              className={`input-info-usuario ${
                fieldErrors.nome && "input-error"
              }`}
              style={{ textTransform: "none" }}
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

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input
                className={`input-info-usuario ${
                  fieldErrors.senha && "input-error"
                }`}
                style={{ textTransform: "none", width: "30%" }}
                onChange={this.onChange}
                placeholder="SENHA"
                value={state.senha}
                name="senha"
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                // type="password"
              ></input>
              <input
                className={`input-info-usuario ${
                  fieldErrors.confirmarSenha && "input-error"
                }`}
                style={{ textTransform: "none", width: "30%" }}
                onChange={this.onChange}
                placeholder="CONFIRMAR SENHA"
                value={state.confirmarSenha}
                name="confirmarSenha"
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                // type="password"
              ></input>

              <div className="div-switch">
                <label style={{ color: "#C8C8C8", marginTop: "20px" }}>
                  PREMIAÇÃO:
                </label>
                <Switch
                  className="switch-info-usuario"
                  value={this.state.premiacao}
                  onChange={(value) => this.setState({ premiacao: value })}
                />
              </div>
            </div>

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
            <div className="div-block-subtitulo-permissoes">
              <label style={{ fontFamily: "Bebas", fontSize: "20px" }}>
                Permissoes
              </label>

              <div style={{ display: "flex" }}>
                <button className="button-plus" onClick={this.openModal}>
                  <PlusOutlined style={{ fontSize: "16px" }} />
                </button>
                <Select
                  style={{
                    width: "200px",
                  }}
                  onChange={this.onChangeSelect}
                >
                  {this.state.typeAccounts.map((typeAccount) => (
                    <Option value={typeAccount.id}>{typeAccount.group}</Option>
                  ))}
                </Select>
              </div>
            </div>
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

        <this.ModalNewTypeAccount />
      </div>
    );
  }
}

export default UserContainer;
