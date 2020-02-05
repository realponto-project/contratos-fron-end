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
    tipo: ""
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value
    });
  };

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
      </div>
    );
  }
}

export default GerenciarConsultaContainer;
