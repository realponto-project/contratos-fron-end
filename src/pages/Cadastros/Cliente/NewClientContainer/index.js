import React, { Component } from "react";
import * as R from "ramda";
import "../../../../global.css";
import "./index.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  NewClient,
  UpdateClient,
  DeleteClient,
  RestoreClient,
  GetClientByParams,
  GetAllGroups,
} from "../../../../services/client";
import { getAddressByZipCode } from "../../../../services/utils/viacep";
import { validator, masks } from "./validator";
import { clearClient } from "../../../Relatorios/Cadastro/cadastroRedux/action";
import { message, Modal, Select } from "antd";

const { Option } = Select;

class NewClientContainer extends Component {
  state = {
    visible: false,
    deletedAt: false,
    clientId: "",
    razaosocial: "",
    cnpj: "",
    grupo: "GRUPO",
    codigo: "",
    nomeContato: "",
    celularContato: "",
    telefoneContato: "",
    emailContato: "",
    rua: "",
    bairro: "",
    cep: "",
    cidade: "",
    uf: "",
    complemento: "",
    observacoes: "",
    fieldErrors: {
      razaosocial: false,
      cnpj: false,
      grupo: false,
      codigo: false,
      nomeContato: false,
      celularContato: false,
      telefoneContato: false,
      emailContato: false,
      rua: false,
      bairro: false,
      cep: false,
      cidade: false,
      uf: false,
      complemento: false,
      observacoes: false,
    },
    groups: [],
  };

  clearState = () => {
    this.setState({
      deletedAt: false,
      clientId: "",
      razaosocial: "",
      cnpj: "",
      grupo: "",
      codigo: "",
      nomeContato: "",
      celularContato: "",
      telefoneContato: "",
      emailContato: "",
      rua: "",
      bairro: "",
      cep: "",
      cidade: "",
      uf: "",
      complemento: "",
      observacoes: "",
      fieldErrors: {
        razaosocial: false,
        cnpj: false,
        grupo: false,
        codigo: false,
        nomeContato: false,
        celularContato: false,
        telefoneContato: false,
        emailContato: false,
        rua: false,
        bairro: false,
        cep: false,
        cidade: false,
        uf: false,
        complemento: false,
        observacoes: false,
      },
    });
  };

  componentDidMount = async () => {
    await GetAllGroups()
      .then((resp) => this.setState({ groups: resp.data }))
      .catch((err) => console.error(err));

    const {
      deletedAt,
      clientId,
      razaosocial,
      cnpj,
      grupo,
      codigo,
      nomeContato,
      celularContato,
      telefoneContato,
      emailContato,
      rua,
      bairro,
      cep,
      cidade,
      uf,
      complemento,
      observacoes,
    } = this.props.clientValue;

    await this.setState({
      deletedAt,
      clientId,
      razaosocial,
      cnpj,
      grupo,
      codigo,
      nomeContato,
      celularContato,
      telefoneContato,
      emailContato,
      rua,
      bairro,
      cep,
      cidade,
      uf,
      complemento,
      observacoes,
    });

    this.props.clearClient();
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

  newClient = async () => {
    const {
      clientId,
      nomeContato: name,
      telefoneContato: telphone,
      celularContato: celular,
      emailContato: email,
      cidade: city,
      rua: street,
      uf: state,
      cep: zipCode,
      bairro: neighborhood,
      razaosocial,
      grupo: group,
      codigo: code,
      cnpj,
      complemento: complement,
      observacoes: observation,
    } = this.state;

    const value = {
      name,
      telphone,
      celular,
      email,
      city,
      street,
      state,
      zipCode,
      neighborhood,
      razaosocial,
      group,
      code,
      cnpj,
      complement,
      observation,
    };

    if (clientId) {
      const { status } = await UpdateClient({ ...value, clientId });

      if (status === 200) {
        this.clearState();
        message.success("Cliente atualizado com sucesso");
      }
    } else {
      const { status, data } = await NewClient(value);

      if (status === 200) {
        this.clearState();
        message.success("Cliente cadatrado com sucesso");
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
    }
  };

  onFocus = (e) => {
    const { name } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: false },
    });
  };

  onBlur = async (e) => {
    const { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) },
    });

    if (name === "cep" && !validator(name, value)) {
      const { status, data } = await getAddressByZipCode(value);
      if (status === 200) {
        if (R.has("erro", data)) {
          this.setState({
            fieldErrors: { ...fieldErrors, [name]: true },
          });
        } else {
          const { logradouro: rua, bairro, localidade: cidade, uf } = data;
          this.setState({
            rua,
            bairro,
            cidade,
            uf,
            fieldErrors: {
              ...fieldErrors,
              rua: false,
              bairro: false,
              cidade: false,
              uf: false,
            },
          });
        }
      }
    }

    if (name === "razaosocial" || name === "cnpj") {
      const { status, data } = await GetClientByParams({
        where: {
          [name]: name === "cnpj" ? value.replace(/\D/gi, "") : value,
        },
        paranoid: false,
      });

      if (status === 200 && data) {
        const {
          id: clientId,
          razaosocial,
          cnpj,
          group: { group: grupo },
          code: codigo,
          contact: {
            name: nomeContato,
            celular: celularContato,
            telphone: telefoneContato,
            email: emailContato,
          },
          address: {
            street: rua,
            neighborhood: bairro,
            zipCode: cep,
            city: cidade,
            state: uf,
            complement: complemento,
            observation: observacoes,
          },
          deletedAt,
        } = data;

        this.setState({
          deletedAt: !!deletedAt,
          clientId,
          razaosocial,
          cnpj:
            cnpj.length === 12
              ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4")
              : cnpj.replace(
                  /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
                  "$1.$2.$3/$4-$5"
                ),
          grupo,
          codigo,
          nomeContato,
          celularContato: celularContato.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
          ),
          telefoneContato: telefoneContato.replace(
            /(\d{2})(\d{4})(\d{4})/,
            "($1) $2-$3"
          ),
          emailContato,
          rua,
          bairro,
          cep,
          cidade,
          uf,
          complemento,
          observacoes,
          fieldErrors: {
            razaosocial: false,
            cnpj: false,
            grupo: false,
            codigo: false,
            nomeContato: false,
            celularContato: false,
            telefoneContato: false,
            emailContato: false,
            rua: false,
            bairro: false,
            cep: false,
            cidade: false,
            uf: false,
            complemento: false,
            observacoes: false,
          },
        });
      } else if (this.state.clientId) {
        this.setState({
          deletedAt: false,
          clientId: "",
          razaosocial: name === "razaosocial" ? this.state.razaosocial : "",
          cnpj: name === "cnpj" ? this.state.cnpj : "",
          grupo: "",
          codigo: "",
          nomeContato: "",
          celularContato: "",
          telefoneContato: "",
          emailContato: "",
          rua: "",
          bairro: "",
          cep: "",
          cidade: "",
          uf: "",
          complemento: "",
          observacoes: "",
          fieldErrors: {
            razaosocial:
              name === "razaosocial" ? this.state.fieldErrors.razaosocial : "",
            cnpj: name === "cnpj" ? this.state.fieldErrors.cnpj : "",
            grupo: false,
            codigo: false,
            nomeContato: false,
            celularContato: false,
            telefoneContato: false,
            emailContato: false,
            rua: false,
            bairro: false,
            cep: false,
            cidade: false,
            uf: false,
            complemento: false,
            observacoes: false,
          },
        });
      }
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = async (e) => {
    const { clientId } = this.state;
    const { status } = await DeleteClient(clientId);

    switch (status) {
      case 422:
        message.error("ocorreu um erro");
        break;
      case 200:
        message.success("cliente excluído");
        break;
      default:
        message.error("ocorreu um erro");
    }
    this.setState({
      visible: false,
    });
    this.clearState();
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  ModalConfirmeDelete = () => {
    const { razaosocial, cnpj, grupo, codigo } = this.state;
    return (
      <Modal
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <h2>Deseja excluir esse cliente?</h2>
        <br />
        <p>
          <strong>Razão Social: </strong>
          {razaosocial}
        </p>
        <p>
          <strong>CNPJ/CPF: </strong>
          {cnpj}
        </p>
        <p>
          <strong>Grupo: </strong>
          {grupo}
        </p>
        <p>
          <strong>Código: </strong>
          {codigo}
        </p>
      </Modal>
    );
  };

  render() {
    const { state, onChange, onFocus, onBlur } = this;
    const { fieldErrors, deletedAt } = state;
    return (
      <div className="card-main">
        <div className="div-inputs-flex-hor">
          <div className="div-h2-cliente">
            <h2 className="h2-sub-titulo">Cliente</h2>
          </div>
          <div className="div-inputs-flex-cliente">
            <input
              className={`input-nome-cliente ${
                fieldErrors.razaosocial && "input-error"
              }`}
              placeholder="RAZÃO SOCIAL / NOME"
              onChange={onChange}
              name="razaosocial"
              value={state.razaosocial}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <input
              className={`input-cnpj-cliente ${
                fieldErrors.cnpj && "input-error"
              }`}
              placeholder="CNPJ / CPF"
              onChange={onChange}
              name="cnpj"
              value={state.cnpj}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <Select
              showSearch
              onSearch={(grupo) => this.setState({ grupo })}
              onChange={(grupo) => this.setState({ grupo })}
              onBlur={(grupo) => this.setState({ grupo: grupo.toUpperCase() })}
              className={`input-grupo-cliente ${
                fieldErrors.grupo && "input-error"
              }`}
              size="large"
              readOnly={deletedAt}
              value={state.grupo}
              placeholder="GRUPO"
              style={{ marginLeft: "15px" }}
              getInputElement={() => (
                <input
                  style={{
                    textTransform: "uppercase",
                  }}
                />
              )}
            >
              {this.state.groups.length !== 0 &&
                this.state.groups.map((group, index) => (
                  <Option key={index} value={group}>
                    {group}
                  </Option>
                ))}
            </Select>
            <input
              readOnly={deletedAt}
              className={`input-codigo-cliente ${
                fieldErrors.codigo && "input-error"
              }`}
              placeholder="CÓDIGO"
              onChange={onChange}
              name="codigo"
              value={state.codigo}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
          </div>
        </div>
        <div className="div-main-cliente">
          <div className="div-contato-cliente">
            <div className="div-h2-cliente">
              <h2 className="h2-sub-titulo">Contato</h2>
            </div>
            <input
              readOnly={deletedAt}
              className={`input-contato-cliente ${
                fieldErrors.nomeContato && "input-error"
              }`}
              placeholder="NOME"
              onChange={onChange}
              name="nomeContato"
              value={state.nomeContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <input
              readOnly={deletedAt}
              className={`input-contato-cliente ${
                fieldErrors.celularContato && "input-error"
              }`}
              placeholder="CELULAR"
              onChange={onChange}
              name="celularContato"
              value={state.celularContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <input
              readOnly={deletedAt}
              className={`input-contato-cliente ${
                fieldErrors.telefoneContato && "input-error"
              }`}
              placeholder="TELEFONE"
              onChange={onChange}
              name="telefoneContato"
              value={state.telefoneContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <input
              readOnly={deletedAt}
              className={`input-contato-cliente ${
                fieldErrors.emailContato && "input-error"
              }`}
              style={{ textTransform: "none" }}
              placeholder="E-MAIL"
              onChange={this.onChangeEmail}
              name="emailContato"
              value={state.emailContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
          </div>
          <div className="div-endereco-cliente">
            <div className="div-h2-cliente">
              <h2 className="h2-sub-titulo">Endereco</h2>
            </div>
            <div className="div-twoInfo-cliente">
              <input
                readOnly={deletedAt}
                className={`input-cep-cliente ${
                  fieldErrors.cep && "input-error"
                }`}
                placeholder="CEP"
                onChange={onChange}
                name="cep"
                value={state.cep}
                onFocus={onFocus}
                onBlur={onBlur}
              ></input>
              <input
                readOnly={deletedAt}
                className={`input-bairro-cliente ${
                  fieldErrors.bairro && "input-error"
                }`}
                placeholder="BAIRRO"
                onChange={this.onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                name="bairro"
                value={this.state.bairro}
              ></input>
            </div>
            <input
              readOnly={deletedAt}
              className={`input-endereco-cliente ${
                fieldErrors.rua && "input-error"
              }`}
              placeholder="RUA"
              onChange={this.onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              name="rua"
              value={this.state.rua}
            ></input>
            <div className="div-twoInfo-cliente">
              <input
                readOnly={deletedAt}
                className={`input-cidade-cliente ${
                  fieldErrors.cidade && "input-error"
                }`}
                placeholder="CIDADE"
                onChange={onChange}
                name="cidade"
                value={state.cidade}
                onFocus={onFocus}
                onBlur={onBlur}
              ></input>
              <input
                readOnly={deletedAt}
                className={`input-uf-cliente ${
                  fieldErrors.uf && "input-error"
                }`}
                placeholder="UF"
                onChange={onChange}
                name="uf"
                value={state.uf}
                onFocus={onFocus}
                onBlur={onBlur}
              ></input>
            </div>
            <input
              readOnly={deletedAt}
              className="input-endereco-cliente"
              placeholder="COMPLEMENTO"
              onChange={onChange}
              name="complemento"
              value={state.complemento}
            ></input>
            <input
              readOnly={deletedAt}
              className="input-endereco-cliente"
              placeholder="OBSERVAÇÕES"
              onChange={onChange}
              name="observacoes"
              value={state.observacoes}
            ></input>
          </div>
        </div>
        <div className="div-buttons-usuario">
          {deletedAt ? (
            <button
              className="button-salvar"
              onClick={async () => {
                const { status } = await RestoreClient(this.state.clientId);

                if (status === 200) this.setState({ deletedAt: false });
              }}
            >
              Restaurar
            </button>
          ) : (
            <>
              <button
                className={`button-excluir-cliente ${
                  !this.state.clientId && "button-disabled"
                }`}
                onClick={this.state.clientId && this.showModal}
              >
                Excluir
              </button>
              <button
                className="button-salvar-cliente"
                onClick={this.newClient}
              >
                {this.state.clientId ? "Atualizar" : "Cadastrar"}
              </button>
            </>
          )}
        </div>
        <this.ModalConfirmeDelete />
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ clearClient }, dispach);
}

function mapStateToProps(state) {
  return {
    clientValue: state.clientValue,
  };
}

export default connect(mapStateToProps, mapDispacthToProps)(NewClientContainer);
