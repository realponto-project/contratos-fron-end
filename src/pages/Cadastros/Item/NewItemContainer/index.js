import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";

class NewItemContainer extends Component {
  state = {
    nome: "",
    tipo: "",
    codigo: "",
    descricao: ""
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
          <h1 className="h1-titulo">Item</h1>
        </div>

        <div className="div-inputs-flex">
          <input
            className="input-nome-item"
            onChange={this.onChange}
            placeholder="NOME"
            value={this.state.nome}
            name="nome"
          ></input>
          <input
            className="input-tipo-item"
            onChange={this.onChange}
            placeholder="TIPO"
            value={this.state.tipo}
            name="tipo"
          ></input>
          <input
            className="input-codigo-item"
            onChange={this.onChange}
            placeholder="CÓDIGO"
            value={this.state.codigo}
            name="codigo"
          ></input>
        </div>

        <div className="div-descricao-item">
          <label
            style={{
              fontFamily: "Bebas",
              fontSize: "20px",
              margin: "50px 0 0 25px"
            }}
          >
            Descricao
          </label>
          <textarea
            className="textArea-descricao-item"
            value={this.state.descricao}
            name="descricao"
            rows="4"
            onChange={this.onChange}
          ></textarea>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar">Cadastrar</button>
          <button className="button-excluir">Excluir</button>
        </div>
      </div>
    );
  }
}

export default NewItemContainer;
