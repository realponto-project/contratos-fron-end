import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { Icon, Select, message, Modal } from "antd";
import * as R from "ramda";

import { GetByParams } from "../../../../services/client";
import { validator, masks } from "./validator";
import { NewContract } from "../../../../services/contract";
import { getAddressByZipCode } from "../../../../services/utils/viacep";

const { Option } = Select;

class NewContratosContainer extends Component {
  state = {
    visible: false,
    search: "",
    razaosocial: "",
    cnpj: "",
    codigo: "",
    grupo: "",
    valorTotal: "",
    dataAtivacao: "",
    status: "STATUS",
    tipo: "TIPO",
    base: "BASE",
    clientId: "",
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
      codigo: false,
      rua: false,
      bairro: false,
      cep: false,
      cidade: false,
      uf: false,
      complemento: false,
      observacoes: false
    }
  };

  clearState = () => {
    this.setState({
      search: "",
      razaosocial: "",
      cnpj: "",
      codigo: "",
      grupo: "",
      valorTotal: "",
      dataAtivacao: "",
      status: "STATUS",
      tipo: "TIPO",
      base: "BASE",
      clientId: "",
      fieldErrors: {
        razaosocial: false,
        cnpj: false,
        codigo: false
      }
    });
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value
    });
  };

  onBlur = async e => {
    const { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) }
    });

    if (name === "razaosocial" || name === "cnpj") {
      const { status, data } = await GetByParams({
        [name]: name === "cnpj" ? value.replace(/\D/gi, "") : value
      });
      if (status === 200) {
        if (data) {
          const { id: clientId, razaosocial, cnpj, group: grupo } = data;
          const cnpjFormated = masks("cnpj", cnpj);
          this.setState({
            [cnpjFormated.name]: cnpjFormated.value,
            clientId,
            razaosocial,
            grupo,
            fieldErrors: {
              ...fieldErrors,
              razaosocial: false,
              cnpj: false
            }
          });
          console.log(masks("cnpj", cnpj));
        } else {
          this.setState({
            fieldErrors: { ...fieldErrors, [name]: true }
          });
        }
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

  onChangeStatus = value => {
    this.setState({
      status: value
    });
  };

  onChangeTipo = value => {
    this.setState({
      tipo: value
    });
  };

  onChangeBase = value => {
    this.setState({
      base: value
    });
  };

  newContract = async () => {
    const {
      codigo: code,
      status,
      tipo: type,
      base: stockBase,
      clientId
    } = this.state;

    const value = {
      code,
      status,
      type,
      stockBase,
      clientId
    };

    const response = await NewContract(value);
    console.log(response);

    if (response.status === 200) {
      this.clearState();
      message.success("Contrato cadatrado com sucesso");
    }
  };

  ModalIncluir = () => (
    <Modal
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      cancelText="Cancelar"
      okText="Incluir"
    >
      <label
        style={{
          fontFamily: "Bebas",
          fontSize: "20px",
          margin: "10px 0 0 0"
        }}
      >
        Item
      </label>
      <div className="div-line-modal">
        <input className="input-item-modal" placeholder="ITEM"></input>
        <input className="input-codigo-modal" placeholder="CÒDIGO"></input>
      </div>
      <div className="div-twoInfo-modal">
        <input
          className={`input-cep-modal ${this.state.fieldErrors.cep &&
            "input-error"}`}
          placeholder="CEP"
          onChange={this.onChange}
          name="cep"
          value={this.state.cep}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        ></input>
        <input
          className="input-bairro-modal"
          placeholder="BAIRRO"
          onChange={this.onChange}
          name="bairro"
          value={this.state.bairro}
        ></input>
      </div>
      <input
        className="input-endereco-modal"
        placeholder="RUA"
        onChange={this.onChange}
        name="rua"
        value={this.state.rua}
      ></input>
      <div className="div-twoInfo-modal">
        <input
          className={`input-cidade-modal ${this.state.fieldErrors.cidade &&
            "input-error"}`}
          placeholder="CIDADE"
          onChange={this.onChange}
          name="cidade"
          value={this.state.cidade}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        ></input>
        <input
          className={`input-uf-modal ${this.state.fieldErrors.uf &&
            "input-error"}`}
          placeholder="UF"
          onChange={this.onChange}
          name="uf"
          value={this.state.uf}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        ></input>
      </div>
      <input
        className="input-endereco-modal"
        placeholder="COMPLEMENTO"
        onChange={this.onChange}
        name="complemento"
        value={this.state.complemento}
      ></input>
      <input
        className="input-endereco-modal"
        placeholder="OBSERVAÇÕES"
        onChange={this.onChange}
        name="observacoes"
        value={this.state.observacoes}
      ></input>
    </Modal>
  );

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value
    });
  };

  onFocus = e => {
    const { name } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: false }
    });
  };

  onBlur = async e => {
    const { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) }
    });

    if (name === "cep" && !validator(name, value)) {
      const { status, data } = await getAddressByZipCode(value);
      if (status === 200) {
        if (R.has("erro", data)) {
          this.setState({
            fieldErrors: { ...fieldErrors, [name]: true }
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
              uf: false
            }
          });
        }
      }
    }
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { state } = this;
    const { fieldErrors } = state;
    return (
      <div className="card-main">
        <this.ModalIncluir />
        <div className="div-titulo-usuario">
          <h1 className="h1-titulo">Contratos</h1>
          <div className="div-search-usuario">
            <input
              className="input-search-usuario"
              onChange={this.onChange}
              placeholder="PESQUISAR"
              value={this.state.search}
              name="search"
            ></input>
            <Icon
              type="search"
              style={{ fontSize: "18px", marginRight: "5px" }}
            />
          </div>
        </div>

        <div className="div-inputs-flex">
          <input
            className={`input-codigo-contratos ${fieldErrors.codigo &&
              "input-error"}`}
            placeholder="Nº CONTRATO"
            onChange={this.onChange}
            name="codigo"
            value={this.state.codigo}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          ></input>
          <input
            className={`input-nome-contratos ${fieldErrors.razaosocial &&
              "input-error"}`}
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={this.onChange}
            name="razaosocial"
            value={this.state.razaosocial}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          ></input>
          <input
            className={`input-cnpj-contratos ${fieldErrors.cnpj &&
              "input-error"}`}
            placeholder="CNPJ / CPF"
            onChange={this.onChange}
            name="cnpj"
            value={this.state.cnpj}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          ></input>
          <input
            readOnly
            className="input-grupo-contratos"
            placeholder="GRUPO"
            onChange={this.onChange}
            name="grupo"
            value={this.state.grupo}
          ></input>
        </div>

        <div className="div-inputs-flex-contratos">
          <input
            className="input-valor"
            placeholder="VALOR"
            onChange={this.onChange}
            name="nome"
            value={this.state.nome}
          ></input>
          <input
            className="input-data"
            placeholder="DATA ATIVAÇÃO"
            onChange={this.onChange}
            name="cnpj"
            value={this.state.cnpj}
          ></input>
          <Select
            onChange={this.onChangeStatus}
            defaultValue={this.state.status}
            className="select-contratos"
            size="large"
          >
            <Option value="ATIVO">ATIVO</Option>
            <Option value="DEBITO">EM DÉBITO</Option>
            <Option value="CANCELADO">CANCELADO</Option>
          </Select>
          <Select
            onChange={this.onChangeTipo}
            defaultValue={this.state.tipo}
            className="select-contratos"
            size="large"
          >
            <Option value="MENSAL">MENSAL</Option>
            <Option value="ANUAL">ANUAL</Option>
          </Select>
          <Select
            onChange={this.onChangeBase}
            defaultValue={this.state.base}
            className="select-contratos"
            size="large"
          >
            <Option value="REALPONTO">REALPONTO</Option>
            <Option value="NOVAREAL">NOVA REALPONTO</Option>
            <Option value="PONTOREAL">PONTOREAL</Option>
          </Select>
          <button className="button-historico-contratos">HISTÓRICO</button>
        </div>
        <div className="div-main-contratos">
          <div className="div-itens-contratos">
            <div className="div-h2-modal">
              <h2 style={{ fontFamily: "Bebas", marginLeft: "25px" }}>Itens</h2>
            </div>
            <div className="div-line-contratos">
              <input
                className="input-item-contratos"
                placeholder="ITEM"
              ></input>
              <input
                className="input-valor-contratos"
                placeholder="VALOR"
              ></input>
              <input
                className="input-data-contratos"
                placeholder="DATA"
              ></input>
            </div>
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar" onClick={this.newContract}>
            Salvar
          </button>
          <button className="button-incluir" onClick={this.showModal}>
            Incluir
          </button>
        </div>
      </div>
    );
  }
}

export default NewContratosContainer;
