import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";

class NewClientContainer extends Component {
  state = {
    nome: "",
    cnpj: "",
    grupo: "",
    codigo: ""
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Cliente</h1>
        </div>

        <div className="div-inputs-flex">
          <input
            className="input-nome-cliente"
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={this.onChange}
            name="nome"
            value={this.state.nome}
          ></input>
          <input
            className="input-cnpj-cliente"
            placeholder="CNPJ / CPF"
            onChange={this.onChange}
            name="cnpj"
            value={this.state.cnpj}
          ></input>
          <input
            className="input-grupo-cliente"
            placeholder="GRUPO"
            onChange={this.onChange}
            name="grupo"
            value={this.state.grupo}
          ></input>
          <input
            className="input-codigo-cliente"
            placeholder="CÓDIGO"
            onChange={this.onChange}
            name="codigo"
            value={this.state.codigo}
          ></input>
        </div>
      </div>
    );
  }
}

export default NewClientContainer;
