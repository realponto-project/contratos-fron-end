import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { message } from "antd";
import { NewItem } from "../../../../services/item";
import { validator } from "./validator";
class NewItemContainer extends Component {
  state = {
    nome: "",
    tipo: "",
    codigo: "",
    descricao: "",
    fieldErrors: {
      nome: "",
      tipo: "",
      codigo: "",
      descricao: ""
    }
  };

  clearState = () => {
    this.setState({
      nome: "",
      tipo: "",
      codigo: "",
      descricao: "",
      fieldErrors: {
        nome: "",
        tipo: "",
        codigo: "",
        descricao: ""
      }
    });
  };

  onChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  onBlur = e => {
    const { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) }
    });
  };

  onFocus = e => {
    const { name } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: false }
    });
  };

  newItem = async () => {
    const {
      nome: name,
      tipo: type,
      codigo: code,
      descricao: description
    } = this.state;

    const value = { name, type, code, description };

    const { status } = await NewItem(value);

    if (status === 200) {
      this.clearState();
      message.success("Item cadatrado com sucesso");
    }
  };

  render() {
    const { state, onFocus, onBlur } = this;
    const { fieldErrors } = state;
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Itens</h1>
        </div>

        <div className="div-inputs-flex">
          <input
            className={`input-nome-item ${fieldErrors.nome && "input-error"}`}
            onChange={this.onChange}
            placeholder="NOME"
            value={this.state.nome}
            name="nome"
            onBlur={onBlur}
            onFocus={onFocus}
          ></input>
          <input
            className={`input-tipo-item ${fieldErrors.tipo && "input-error"}`}
            onChange={this.onChange}
            placeholder="TIPO"
            value={this.state.tipo}
            name="tipo"
            onBlur={onBlur}
            onFocus={onFocus}
          ></input>
          <input
            className={`input-codigo-item  ${fieldErrors.codigo &&
              "input-error"}`}
            onChange={this.onChange}
            placeholder="CÓDIGO"
            value={this.state.codigo}
            name="codigo"
            onBlur={onBlur}
            onFocus={onFocus}
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
            className={`textArea-descricao-item ${fieldErrors.descricao &&
              "input-error"}`}
            value={this.state.descricao}
            placeholder="DIGITE A DESCRIÇÃO"
            name="descricao"
            rows="4"
            onChange={this.onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          ></textarea>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar" onClick={this.newItem}>
            Cadastrar
          </button>
          <button className="button-excluir">Excluir</button>
        </div>
      </div>
    );
  }
}

export default NewItemContainer;
