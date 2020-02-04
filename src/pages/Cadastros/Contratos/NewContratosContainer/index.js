import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";

import { Icon, Select } from "antd";

const { Option } = Select;

class NewContratosContainer extends Component {
  state = {
    search: "",
    nome: "",
    cnpj: "",
    codigo: "",
    grupo: "",
    valorTotal: "",
    dataAtivacao: "",
    status: "STATUS",
    tipo: "TIPO",
    base: "BASE"
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
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

  render() {
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
            className="input-codigo-contratos"
            placeholder="Nº CONTRATO"
            onChange={this.onChange}
            name="codigo"
            value={this.state.codigo}
          ></input>
          <input
            className="input-nome-contratos"
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={this.onChange}
            name="nome"
            value={this.state.nome}
          ></input>
          <input
            className="input-cnpj-contratos"
            placeholder="CNPJ / CPF"
            onChange={this.onChange}
            name="cnpj"
            value={this.state.cnpj}
          ></input>
          <input
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
            <Option value="EMDEBITO">EM DÉBITO</Option>
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
            <Option value="NOVAREALPONTO">NOVA REALPONTO</Option>
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
          <button className="button-salvar">Salvar</button>
          <button className="button-incluir">Incluir</button>
        </div>
      </div>
    );
  }
}

export default NewContratosContainer;
