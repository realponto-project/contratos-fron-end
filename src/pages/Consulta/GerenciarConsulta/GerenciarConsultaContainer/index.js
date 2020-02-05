import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { masks } from "./validator";

class GerenciarConsultaContainer extends Component {
  state = {
    nome: "",
    cnpj: "",
    grupo: "",
    codigo: "",
    tipo: "",
    total: 10,
    count: 0,
    page: 3
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value
    });
  };

  TableConsulta = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <label className="label-nome-table">TESTE TESTE TESTE</label>
          <label className="label-cnpj-table">50.418.420/0001-60</label>
          <label className="label-grupo-table">TESTE</label>
          <label className="label-codigo-table">321312</label>
          <label className="label-tipo-table">ANUAL</label>
        </div>
      </div>
    </div>
  );

  changePages = pages => {
    this.setState(
      {
        page: pages
      }
      // () => {
      //   this.getStock();
      // }
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
    const { state, onChange } = this;
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Consulta</h1>
        </div>
        <div className="div-inputs-flex">
          <input
            className="input-nome"
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={onChange}
            name="nome"
            value={state.nome}
          ></input>
          <input
            className="input-cnpj-consulta"
            placeholder="CNPJ / CPF"
            onChange={onChange}
            name="cnpj"
            value={state.cnpj}
          ></input>
          <input
            className="input-grupo"
            placeholder="GRUPO"
            onChange={onChange}
            name="grupo"
            value={state.grupo}
          ></input>
          <input
            className="input-codigo-consulta"
            placeholder="CÓDIGO"
            onChange={onChange}
            name="codigo"
            value={state.codigo}
          ></input>
          <input
            className="input-tipo-consulta"
            placeholder="TIPO"
            onChange={onChange}
            name="tipo"
            value={state.tipo}
          ></input>
        </div>

        <this.TableConsulta />
        <div className="div-main-pages">
          <this.Pages />
        </div>
      </div>
    );
  }
}

export default GerenciarConsultaContainer;
