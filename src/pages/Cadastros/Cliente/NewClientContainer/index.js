import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";

class NewClientContainer extends Component {
  state = {
    nome: "",
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
    observacoes: ""
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
            className="input-nome"
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={this.onChange}
            name="nome"
            value={this.state.nome}
          ></input>
          <input
            className="input-cnpj"
            placeholder="CNPJ / CPF"
            onChange={this.onChange}
            name="cnpj"
            value={this.state.cnpj}
          ></input>
          <input
            className="input-grupo"
            placeholder="GRUPO"
            onChange={this.onChange}
            name="grupo"
            value={this.state.grupo}
          ></input>
          <input
            className="input-codigo"
            placeholder="CÓDIGO"
            onChange={this.onChange}
            name="codigo"
            value={this.state.codigo}
          ></input>
        </div>

        <div className="div-main-cliente">
          <div className="div-contato-cliente">
            <div className="div-h2-cliente">
              <h2 style={{ fontFamily: "Bebas", margin: 0 }}>Contato</h2>
            </div>
            <input
              className="input-contato-cliente"
              placeholder="NOME"
              onChange={this.onChange}
              name="nomeContato"
              value={this.state.nomeContato}
            ></input>
            <input
              className="input-contato-cliente"
              placeholder="CELULAR"
              onChange={this.onChange}
              name="celularContato"
              value={this.state.celularContato}
            ></input>
            <input
              className="input-contato-cliente"
              placeholder="TELEFONE"
              onChange={this.onChange}
              name="telefoneContato"
              value={this.state.telefoneContato}
            ></input>
            <input
              className="input-contato-cliente"
              placeholder="E-MAIL"
              onChange={this.onChange}
              name="emailContato"
              value={this.state.emailContato}
            ></input>
          </div>
          <div className="div-endereco-cliente">
            <div className="div-h2-cliente">
              <h2 style={{ fontFamily: "Bebas", margin: 0 }}>Endereco</h2>
            </div>
            <div className="div-twoInfo-cliente">
              <input
                className="input-cep-cliente"
                placeholder="CEP"
                onChange={this.onChange}
                name="cep"
                value={this.state.cep}
              ></input>
              <input
                className="input-bairro-cliente"
                placeholder="BAIRRO"
                onChange={this.onChange}
                name="bairro"
                value={this.state.bairro}
              ></input>
            </div>
            <input
              className="input-endereco-cliente"
              placeholder="RUA"
              onChange={this.onChange}
              name="rua"
              value={this.state.rua}
            ></input>
            <div className="div-twoInfo-cliente">
              <input
                className="input-cidade-cliente"
                placeholder="CIDADE"
                onChange={this.onChange}
                name="cidade"
                value={this.state.cidade}
              ></input>
              <input
                className="input-uf-cliente"
                placeholder="UF"
                onChange={this.onChange}
                name="uf"
                value={this.state.uf}
              ></input>
            </div>
            <input
              className="input-endereco-cliente"
              placeholder="COMPLEMENTO"
              onChange={this.onChange}
              name="complemento"
              value={this.state.complemento}
            ></input>
            <input
              className="input-endereco-cliente"
              placeholder="OBSERVAÇÕES"
              onChange={this.onChange}
              name="observacoes"
              value={this.state.observacoes}
            ></input>
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar">Cadastrar</button>
          <button className="button-excluir">Excluir</button>
        </div>
      </div>
    );
  }
}

export default NewClientContainer;
