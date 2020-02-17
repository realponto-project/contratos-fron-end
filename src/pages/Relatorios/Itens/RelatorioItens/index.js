import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";

class RelatorioItens extends Component {
  state = {
    item: "",
    codigo: "",
    total: 10,
    count: 0,
    page: 1
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  tableRelatorioItens = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <label className="label-nContrato-table">124563</label>
          <label className="label-razao-table">RAZÃO SOCIAL</label>
          <label className="label-cnpj-table">04.550.884/0001-09</label>
          <label className="label-valor-table">90,00</label>
          <label className="label-tipo-table">ANUAL</label>
        </div>
      </div>
    </div>
  );

  changePages = async pages => {
    await this.setState(
      {
        page: pages
      }
      // () => {
      //   this.getAllContract();
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
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Relatorio Itens</h1>
        </div>

        <div className="div-inputs-flex">
          <input
            className="input-item-relatorioItens"
            placeholder="ITEM"
            onChange={this.onChange}
            name="item"
            value={this.state.item}
          ></input>
          <input
            className="input-codigo-relatorioItens"
            placeholder="CODIGO"
            onChange={this.onChange}
            name="codigo"
            value={this.state.codigo}
          ></input>
        </div>

        <this.tableRelatorioItens />
        <div className="div-main-pages">
          <this.Pages />
        </div>
      </div>
    );
  }
}

export default RelatorioItens;
