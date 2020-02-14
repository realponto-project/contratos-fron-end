import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { message, Modal, Icon } from "antd";
import {
  NewItem,
  UpdateItem,
  GetItemByParams,
  DeleteItem,
  RestoreItem
} from "../../../../services/item";
import { validator } from "./validator";

class NewItemContainer extends Component {
  state = {
    search: "",
    itemId: "",
    name: "",
    tipo: "",
    codigo: "",
    descricao: "",
    fieldErrors: {
      name: "",
      tipo: "",
      codigo: "",
      descricao: ""
    },
    visible: false,
    deletedAt: false
  };

  clearState = () => {
    this.setState({
      itemId: "",
      name: "",
      tipo: "",
      codigo: "",
      descricao: "",
      search: "",
      fieldErrors: {
        name: "",
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

  onBlur = async e => {
    const { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) }
    });

    if (name === "name") {
      const { status, data } = await GetItemByParams({ name, value });

      if (status === 200 && data) {
        const {
          id: itemId,
          name,
          type: tipo,
          code: codigo,
          description: descricao,
          deletedAt
        } = data;
        this.setState({
          deletedAt: !!deletedAt,
          itemId,
          name,
          tipo,
          codigo,
          descricao
        });
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

  newItem = async () => {
    const {
      name,
      tipo: type,
      codigo: code,
      descricao: description,
      itemId
    } = this.state;

    const value = { name, type, code, description };

    if (itemId) {
      const { status } = await UpdateItem({ ...value, id: itemId });

      if (status === 200) {
        this.clearState();
        message.success("Item Atualizado com sucesso");
      }
    } else {
      const { status } = await NewItem(value);

      if (status === 200) {
        this.clearState();
        message.success("Item cadatrado com sucesso");
      }
    }
  };

  handleOk = async e => {
    const { itemId } = this.state;
    const { status } = await DeleteItem(itemId);

    switch (status) {
      case 422:
        message.error("ocorreu um erro");
        break;
      case 200:
        message.success("item excluído");
        break;
      default:
        message.error("ocorreu um erro");
    }
    this.setState({
      visible: false
    });
    this.clearState();
  };

  ModalConfirmeDelete = () => {
    const { name, tipo, codigo, descricao } = this.state;
    return (
      <Modal
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={() =>
          this.setState({
            visible: false
          })
        }
      >
        <h2>Deseja excluir esse item?</h2>
        <br />
        <p>
          <strong>Nome: </strong>
          {name}
        </p>
        <p>
          <strong>Tipo: </strong>
          {tipo}
        </p>
        <p>
          <strong>Código: </strong>
          {codigo}
        </p>
        <p>
          <strong>Descricao: </strong>
          {descricao}
        </p>
      </Modal>
    );
  };

  render() {
    const { state, onFocus, onBlur } = this;
    const { fieldErrors, deletedAt } = state;

    return (
      <div className="card-main">
        <div className="div-titulo-usuario">
          <h1 className="h1-titulo">Itens</h1>
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
              onBlur={onBlur}
            />
          </div>
        </div>

        <div className="div-inputs-flex">
          <input
            className={`input-nome-item ${fieldErrors.name && "input-error"}`}
            onChange={this.onChange}
            placeholder="NOME"
            value={this.state.name}
            name="name"
            onFocus={onFocus}
          ></input>
          <input
            className={`input-tipo-item ${fieldErrors.tipo && "input-error"}`}
            onChange={this.onChange}
            placeholder="TIPO"
            value={this.state.tipo}
            name="tipo"
            onFocus={onFocus}
          ></input>
          <input
            className={`input-codigo-item  ${fieldErrors.codigo &&
              "input-error"}`}
            onChange={this.onChange}
            placeholder="CÓDIGO"
            value={this.state.codigo}
            name="codigo"
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
            onFocus={onFocus}
          ></textarea>
        </div>
        <div className="div-buttons-usuario">
          {deletedAt ? (
            <button
              className="button-salvar"
              onClick={async () => {
                const { status } = await RestoreItem(this.state.clientId);

                if (status === 200) this.setState({ deletedAt: false });
              }}
            >
              Restaurar
            </button>
          ) : (
            <>
              <button
                className={`button-excluir-cliente ${!this.state.itemId &&
                  "button-disabled"}`}
                onClick={
                  this.state.itemId && (() => this.setState({ visible: true }))
                  // (async () => await DeleteItem(this.state.itemId))
                }
              >
                Excluir
              </button>
              <button className="button-salvar-cliente" onClick={this.newItem}>
                {this.state.itemId ? "Atualizar" : "Cadastrar"}
              </button>
            </>
          )}
        </div>
        <this.ModalConfirmeDelete />
      </div>
    );
  }
}

export default NewItemContainer;
