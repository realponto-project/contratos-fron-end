import React, { Component } from "react";
import * as R from "ramda";
import "../../../../global.css";
import "./index.css";
import { NewClient } from "../../../../services/client";
import { getAddressByZipCode } from "../../../../services/utils/viacep";
import { validator, masks } from "./validator";
import { message } from "antd";

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
    observacoes: "",
    fieldErrors: {
      nome: false,
      cnpj: false,
      grupo: false,
      codigo: false,
      nomeContato: false,
      celularContato: false,
      telefoneContato: false,
      emailContato: false,
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
      observacoes: "",
      fieldErrors: {
        nome: false,
        cnpj: false,
        grupo: false,
        codigo: false,
        nomeContato: false,
        celularContato: false,
        telefoneContato: false,
        emailContato: false,
        rua: false,
        bairro: false,
        cep: false,
        cidade: false,
        uf: false,
        complemento: false,
        observacoes: false
      }
    });
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value
    });
  };

  newClient = async () => {
    const {
      nomeContato: name,
      telefoneContato: telphone,
      celularContato: celular,
      emailContato: email,
      cidade: city,
      rua: street,
      uf: state,
      cep: zipCode,
      bairro: neighborhood,
      nome: razaosocial,
      grupo: group,
      codigo: code,
      cnpj
    } = this.state;

    const value = {
      name,
      telphone,
      celular,
      email,
      city,
      street,
      state,
      zipCode,
      neighborhood,
      razaosocial,
      group,
      code,
      cnpj
    };

    const { status } = await NewClient(value);

    if (status === 200) {
      this.clearState();
      message.success("Cliente cadatrado com sucesso");
    }
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

  render() {
    const { state, onChange, onFocus, onBlur } = this;
    const { fieldErrors } = state;
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Cliente</h1>
        </div>

        <div className="div-inputs-flex">
          <input
            className={`input-nome ${fieldErrors.nome && "input-error"}`}
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={onChange}
            name="nome"
            value={state.nome}
            onFocus={onFocus}
            onBlur={onBlur}
          ></input>
          <input
            className={`input-cnpj ${fieldErrors.cnpj && "input-error"}`}
            placeholder="CNPJ / CPF"
            onChange={onChange}
            name="cnpj"
            value={state.cnpj}
            onFocus={onFocus}
            onBlur={onBlur}
          ></input>
          <input
            className={`input-grupo ${fieldErrors.grupo && "input-error"}`}
            placeholder="GRUPO"
            onChange={onChange}
            name="grupo"
            value={state.grupo}
            onFocus={onFocus}
            onBlur={onBlur}
          ></input>
          <input
            className={`input-codigo ${fieldErrors.codigo && "input-error"}`}
            placeholder="CÓDIGO"
            onChange={onChange}
            name="codigo"
            value={state.codigo}
            onFocus={onFocus}
            onBlur={onBlur}
          ></input>
        </div>

        <div className="div-main-cliente">
          <div className="div-contato-cliente">
            <div className="div-h2-cliente">
              <h2 style={{ fontFamily: "Bebas", margin: 0 }}>Contato</h2>
            </div>
            <input
              className={`input-contato-cliente ${fieldErrors.nomeContato &&
                "input-error"}`}
              placeholder="NOME"
              onChange={onChange}
              name="nomeContato"
              value={state.nomeContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <input
              className={`input-contato-cliente ${fieldErrors.celularContato &&
                "input-error"}`}
              placeholder="CELULAR"
              onChange={onChange}
              name="celularContato"
              value={state.celularContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <input
              className={`input-contato-cliente ${fieldErrors.telefoneContato &&
                "input-error"}`}
              placeholder="TELEFONE"
              onChange={onChange}
              name="telefoneContato"
              value={state.telefoneContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
            <input
              className={`input-contato-cliente ${fieldErrors.emailContato &&
                "input-error"}`}
              placeholder="E-MAIL"
              onChange={onChange}
              name="emailContato"
              value={state.emailContato}
              onFocus={onFocus}
              onBlur={onBlur}
            ></input>
          </div>
          <div className="div-endereco-cliente">
            <div className="div-h2-cliente">
              <h2 style={{ fontFamily: "Bebas", margin: 0 }}>Endereco</h2>
            </div>
            <div className="div-twoInfo-cliente">
              <input
                className={`input-cep-cliente ${fieldErrors.cep &&
                  "input-error"}`}
                placeholder="CEP"
                onChange={onChange}
                name="cep"
                value={state.cep}
                onFocus={onFocus}
                onBlur={onBlur}
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
                className={`input-cidade-cliente ${fieldErrors.cidade &&
                  "input-error"}`}
                placeholder="CIDADE"
                onChange={onChange}
                name="cidade"
                value={state.cidade}
                onFocus={onFocus}
                onBlur={onBlur}
              ></input>
              <input
                className={`input-uf-cliente ${fieldErrors.uf &&
                  "input-error"}`}
                placeholder="UF"
                onChange={onChange}
                name="uf"
                value={state.uf}
                onFocus={onFocus}
                onBlur={onBlur}
              ></input>
            </div>
            <input
              className="input-endereco-cliente"
              placeholder="COMPLEMENTO"
              onChange={onChange}
              name="complemento"
              value={state.complemento}
            ></input>
            <input
              className="input-endereco-cliente"
              placeholder="OBSERVAÇÕES"
              onChange={onChange}
              name="observacoes"
              value={state.observacoes}
            ></input>
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar" onClick={this.newClient}>
            Cadastrar
          </button>
          <button className="button-excluir">Excluir</button>
        </div>
      </div>
    );
  }
}

export default NewClientContainer;
