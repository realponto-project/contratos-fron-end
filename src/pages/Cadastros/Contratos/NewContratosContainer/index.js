import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { Icon, Select, message } from "antd";

import { GetByParams } from "../../../../services/client";
import { validator, masks } from "./validator";
import { NewContract } from "../../../../services/contract";

const { Option } = Select;

class NewContratosContainer extends Component {
  state = {
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

  render() {
    const { fieldErrors } = this.state;
    return (
      <div className="card-main">
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
            <div className="div-h2-cliente">
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
          <button className="button-incluir">Incluir</button>
        </div>
      </div>
    );
  }
}

export default NewContratosContainer;
