import React, { Component } from "react";
import * as R from "ramda";
import "../../../../global.css";
import "./index.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Modal, Progress, Select } from "antd";
import {
  NewItem,
  UpdateItem,
  GetItemByParams,
  DeleteItem,
  RestoreItem
} from "../../../../services/item";

import { MailOutlined, BellOutlined } from "@ant-design/icons";

import { validator, masks } from "./validator";
import { clearItem } from "../../../Relatorios/Cadastro/cadastroRedux/action";

const { Option } = Select;

class NewItemContainer extends Component {
  state = {
    search: "",
    itemId: "",
    name: "",
    custoAnual: undefined,
    custoMensal: undefined,
    tipo: undefined,
    codigo: "",
    descricao: "",
    fieldErrors: {
      name: false,
      tipo: false,
      codigo: false,
      descricao: false
    },
    visible: false,
    deletedAt: false
  };

  componentDidMount = async () => {
    const {
      itemId,
      name,
      custoAnual,
      custoMensal,
      tipo,
      codigo,
      descricao,
      deletedAt
    } = this.props.itemValue;

    await this.setState({
      deletedAt,
      name,
      itemId,
      custoAnual,
      custoMensal,
      tipo,
      codigo,
      descricao
    });

    this.props.clearItem();
  };

  clearState = () => {
    this.setState({
      itemId: "",
      name: "",
      custoAnual: 0,
      custoMensal: 0,
      tipo: undefined,
      codigo: "",
      descricao: "",
      search: "",
      fieldErrors: {
        name: false,
        tipo: false,
        codigo: false,
        descricao: false
      }
    });
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);

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
      itemId,
      custoMensal: costPriceMonthly,
      custoAnual: costPriceYearly
    } = this.state;

    const value = {
      name,
      type,
      code,
      description,
      costPriceMonthly,
      costPriceYearly
    };

    if (itemId) {
      const { status } = await UpdateItem({ ...value, id: itemId });

      if (status === 200) {
        this.clearState();
        message.success("Item Atualizado com sucesso");
      }
    } else {
      const { status, data } = await NewItem(value);

      if (status === 200) {
        this.clearState();
        message.success("Item cadatrado com sucesso");
      } else if (status === 422) {
        R.keys(data.errors[0].field).map(key =>
          this.setState({
            fieldErrors: {
              ...this.state.fieldErrors,
              [key]: data.errors[0].field
            }
          })
        );
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
        width={700}
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
        <div className="div-titulo">
          <h1 className="h1-titulo">Item</h1>
          <div className="div-info-titulo">
            <div className="div-h3-titulo">
              <h4 style={{ margin: "0" }}>EMPRESA</h4>
              <Progress
                percent={50}
                status="active"
                style={{ padding: "0 !important" }}
              />
            </div>
            <div className="div-h3-titulo">
              <h4 style={{ margin: "0" }}>USUARIO</h4>
              <Progress
                percent={50}
                status="active"
                style={{ padding: "0 !important" }}
              />
            </div>
          </div>
          <div className="div-bell-titulo">
            <MailOutlined style={{ fontSize: "28px", marginRight: "20px" }} />
            <BellOutlined style={{ fontSize: "28px" }} />
          </div>
        </div>
        <div className="div-card-item">
          <div className="div-titulo-usuario"></div>
          <div className="div-inputs-flex">
            <input
              className={`input-nome-item ${fieldErrors.name && "input-error"}`}
              onChange={this.onChange}
              placeholder="NOME"
              value={this.state.name}
              name="name"
              onFocus={onFocus}
            ></input>
            <Select
              value={this.state.tipo}
              className={`input-tipo-item ${fieldErrors.tipo && "input-error"}`}
              placeholder="TIPO"
              onChange={value => this.setState({ tipo: value })}
              size="large"
            >
              <Option key="SOFTWARE" value="SOFTWARE">
                SOFTWARE
              </Option>
              <Option key="EQUIPAMENTO" value="EQUIPAMENTO">
                EQUIPAMENTO
              </Option>
            </Select>
          </div>

          <div className="div-inputs-flex">
            <input
              className={`input-codigo-item  ${fieldErrors.codigo &&
                "input-error"}`}
              onChange={this.onChange}
              placeholder="CÓDIGO"
              value={this.state.codigo}
              name="codigo"
              onFocus={onFocus}
            ></input>
            <input
              className="input-codigo-item"
              onChange={this.onChange}
              placeholder="CUSTO MENSAL"
              value={this.state.custoMensal}
              name="custoMensal"
              onFocus={onFocus}
              min="0"
              max="99999"
              type="number"
              step={0.01}
              onBlur={() =>
                this.setState({
                  custoMensal: parseFloat(this.state.custoMensal).toFixed(2)
                })
              }
            ></input>
            <input
              className="input-codigo-item"
              onChange={this.onChange}
              placeholder="CUSTO ANUAL"
              value={this.state.custoAnual}
              name="custoAnual"
              onFocus={onFocus}
              min="0"
              max="99999"
              type="number"
              step={0.01}
              onBlur={() =>
                this.setState({
                  custoAnual: parseFloat(this.state.custoAnual).toFixed(2)
                })
              }
            ></input>
          </div>

          <div className="div-descricao-item">
            <label
              style={{
                fontFamily: "Bebas",
                fontSize: "20px",
                margin: "20px 0 10px"
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
        </div>
        <div className="div-buttons-usuario">
          {deletedAt ? (
            <button
              className="button-salvar"
              onClick={async () => {
                const { status } = await RestoreItem(this.state.itemId);

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

function mapDispacthToProps(dispach) {
  return bindActionCreators({ clearItem }, dispach);
}

function mapStateToProps(state) {
  return {
    itemValue: state.itemValue
  };
}

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(NewItemContainer);
