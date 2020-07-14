import React, { Component } from "react";
import {
  Input,
  Checkbox,
  message,
  Modal,
  Select,
  Tooltip,
  Switch,
  Progress
} from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as R from "ramda";
import "../../../../global.css";
import "./index.css";
import { validator, masks } from "./validator";
import { NewUser, UpdateUser } from "../../../../services/user";
import { GetAllAwards } from "../../../../services/award";
import { MailOutlined, BellOutlined } from "@ant-design/icons";
import {
  NewTypeAccount,
  GetAllTypeAccounts
} from "../../../../services/typeAccount";
import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { clearUser } from "../../../Relatorios/Cadastro/cadastroRedux/action";

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
      confirmarSenha: false
    },
    addClient: false,
    addItem: false,
    addContract: false,
    addUser: false,
    addIgpm: false,
    typeAccounts: [],
    visible: false,
    grupo: "",
    typeAccountId: "",
    typeAccount: undefined,
    awardList: [],
    award: undefined,
    awardId: "",
    deletedAt: false,
    userId: ""
  };

  componentDidMount = async () => {
    await this.getAllTypeAccounts();
    await this.getAllAwards();

    const {
      deletedAt,
      userId,
      username: nome,
      email,
      telphone: telefone,
      awardBoolean: premiacao,
      description: descricao,
      resource: { addClient, addItem, addContract, addUser, addIgpm },
      typeAccount: { id: typeAccountId, group: typeAccount },
      award
    } = this.props.userValue;

    if (premiacao) this.setState({ award: award.name, awardId: award.id });
    this.setState({
      deletedAt,
      userId,
      nome,
      email,
      telefone,
      descricao,
      premiacao,
      typeAccount,
      typeAccountId,
      addClient,
      addItem,
      addContract,
      addUser,
      addIgpm
    });

    this.props.clearUser();
  };

  getAllAwards = async name => {
    const query = {
      filters: {
        award: {
          specific: {
            name
          }
        }
      },
      total: 100
    };
    const { status, data } = await GetAllAwards(query);

    if (status === 200) this.setState({ awardList: data });
  };

  getAllTypeAccounts = async () => {
    const { status, data } = await GetAllTypeAccounts();

    if (status === 200) this.setState({ typeAccounts: data.rows });
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);

    this.setState({
      [name]: value
    });
  };

  onChangeEmail = e => {
    const { name, value } = masks(e.target.name, e.target.value);

    this.setState({
      [name]: value
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
      premiacao: false,
      fieldErrors: {
        nome: false,
        senha: false,
        email: false,
        telefone: false,
        confirmarSenha: false
      },
      addClient: false,
      addItem: false,
      addContract: false,
      addUser: false,
      addIgpm: false,
      grupo: "",
      typeAccountId: "",
      typeAccount: undefined,
      award: undefined,
      awardId: ""
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
      premiacao: awardBoolean,
      awardId,
      userId
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
      awardBoolean,
      resources: {
        addClient,
        addItem,
        addContract,
        addUser,
        addIgpm
      },
      awardId
    };

    if (userId) {
      const { status, data } = await UpdateUser({ ...value, userId });

      if (status === 200) {
        this.clearState();
        message.success("Usuario atualizado com sucesso");
      }
    } else {
      const { status, data } = await NewUser(value);

      if (status === 200) {
        this.clearState();
        message.success("Usuario cadatrado com sucesso");
      } else if (status === 422) {
        R.keys(data.errors[0].field).map(key =>
          this.setState({
            fieldErrors: {
              ...this.state.fieldErrors,
              [key]: data.errors[0].field
            }
          })
        );
      }
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
    const { fieldErrors, senha, confirmarSenha } = this.state;

    if (name === "confirmarSenha") {
      fieldErrors.confirmarSenha = senha !== confirmarSenha;
    }

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) }
    });
  };

  onChengeCheckbox = e => {
    const { name, checked } = e.target;
    this.setState({ [name]: checked });
  };

  onChangeSelect = (typeAccount, prop) => {
    this.setState({ typeAccount, typeAccountId: prop.key });
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
    </Modal>
  );

  newTypeAccount = async () => {
    const { grupo: group } = this.state;
    const value = { group };
    const { status } = await NewTypeAccount(value);
    if (status === 200) {
      this.setState({
        grupo: "",
        fieldErrors: {
          grupo: false
        },
        visible: false
      });
      message.success("sucesso");
      await this.getAllTypeAccounts();
    } else {
      message.error("erro");
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  openModal = () => {
    this.setState({
      visible: true
    });
  };

  render() {
    const state = this.state;
    const { fieldErrors } = state;
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
        <div className="div-main-usuario">
          <div className="div-info-usuario">
            <input
              className={`input-info-usuario ${fieldErrors.nome &&
                "input-error"}`}
              style={{ textTransform: "none" }}
              onChange={this.onChange}
              placeholder="NOME"
              value={state.nome}
              name="nome"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            ></input>

            <input
              className={`input-info-usuario ${fieldErrors.email &&
                "input-error"}`}
              style={{ textTransform: "none" }}
              onChange={this.onChangeEmail}
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

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input
                className={`input-info-usuario ${fieldErrors.senha &&
                  "input-error"}`}
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
                className={`input-info-usuario ${fieldErrors.confirmarSenha &&
                  "input-error"}`}
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
                  checked={this.state.premiacao}
                  onChange={value =>
                    this.setState({
                      premiacao: value,
                      award: undefined,
                      awardId: ""
                    })
                  }
                />
              </div>
            </div>

            {this.state.premiacao && (
              <Select
                showSearch
                onSearch={name => this.getAllAwards(name)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{ marginTop: "15px" }}
                onChange={name => {
                  const { id: awardId, name: award } = R.find(
                    R.propEq("name", name)
                  )(this.state.awardList);
                  this.setState({ awardId, award });
                }}
                placeholder="SELECIONE UM GRUPO"
                value={this.state.award}
              >
                {this.state.awardList.map(award => (
                  <Option value={award.name}>{award.name}</Option>
                ))}
              </Select>
            )}

            <textarea
              className={`textArea-descricao-item ${fieldErrors.descricao &&
                "input-error"}`}
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
                    width: "200px"
                  }}
                  onChange={this.onChangeSelect}
                  value={this.state.typeAccount}
                >
                  {this.state.typeAccounts.map(typeAccount => (
                    <Option key={typeAccount.id} value={typeAccount.group}>
                      {typeAccount.group}
                    </Option>
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
          <div className="div-buttons-usuario">
            {this.state.deletedAt ? (
              <button
                className="button-salvar"
                onClick={async () => {
                  // const { status } = await RestoreItem(this.state.itemId);
                  // if (status === 200) this.setState({ deletedAt: false });
                }}
              >
                Restaurar
              </button>
            ) : (
              <>
                <button className="button-excluir-cliente">Excluir</button>
                <button
                  className="button-salvar-cliente"
                  onClick={this.newUser}
                >
                  {this.state.userId ? "Atualizar" : "Cadastrar"}
                </button>
              </>
            )}
          </div>
        </div>

        <this.ModalNewTypeAccount />
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ clearUser }, dispach);
}

function mapStateToProps(state) {
  return {
    userValue: state.userValue
  };
}

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(UserContainer);
