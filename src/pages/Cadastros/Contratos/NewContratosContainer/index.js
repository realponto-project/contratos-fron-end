import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "../../../../global.css";
import "./index.css";
import { Icon, Select, message, Modal, DatePicker } from "antd";
import * as R from "ramda";
import { Redirect } from "react-router-dom";

import { GetClientByParams } from "../../../../services/client";
import { GetAllItens } from "../../../../services/item";
import { validator, masks } from "./validator";
import { getAddressByZipCode } from "../../../../services/utils/viacep";
import {
  NewContract,
  UpdateContract,
  GetContractByParams
} from "../../../../services/contract";
import moment from "moment";
import { setContractCode } from "../ContratosRedux/action";

const { Option } = Select;

class NewContratosContainer extends Component {
  state = {
    redirect: false,
    visible: false,
    search: "",
    razaosocial: "",
    cnpj: "",
    codigo: "",
    grupo: "",
    valorTotal: "0",
    dataAtivacao: "",
    status: "STATUS",
    tipo: "TIPO",
    base: "BASE",
    clientId: "",
    item: "NÃO SELECIONADO",
    codigoModal: "CÓDIGO",
    rua: "",
    bairro: "",
    cep: "",
    cidade: "",
    uf: "",
    complemento: "",
    observacoes: "",
    contractCode: "",
    itemId: "",
    fieldErrors: {
      razaosocial: false,
      cnpj: false,
      codigo: false,
      rua: false,
      bairro: false,
      cep: false,
      cidade: false,
      uf: false,
      complemento: false,
      observacoes: false
    },
    itens: [],
    allItens: []
  };

  clearState = () => {
    this.setState({
      visible: false,
      search: "",
      razaosocial: "",
      cnpj: "",
      codigo: "",
      grupo: "",
      valorTotal: "0",
      dataAtivacao: "",
      status: "STATUS",
      tipo: "TIPO",
      base: "BASE",
      clientId: "",
      item: "NÃO SELECIONADO",
      codigoModal: "",
      rua: "",
      bairro: "",
      cep: "",
      cidade: "",
      uf: "",
      complemento: "",
      observacoes: "",
      contractCode: "",
      itemId: "",
      fieldErrors: {
        razaosocial: false,
        cnpj: false,
        codigo: false,
        rua: false,
        bairro: false,
        cep: false,
        cidade: false,
        uf: false,
        complemento: false,
        observacoes: false
      },
      itens: []
    });
  };

  setRedirect = () => {
    this.props.setContractCode(this.state.codigo);

    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/logged/history/dash" />;
    }
  };

  componentDidMount = async () => {
    await this.setState({ allItens: (await GetAllItens()).data });
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value
    });
  };

  getClientByParams = async (name, value, fieldErrors) => {
    const { status, data } = await GetClientByParams({
      [name]: name === "cnpj" ? value.replace(/\D/gi, "") : value
    });
    if (status === 200) {
      if (data) {
        const { id: clientId, razaosocial, cnpj, group: grupo } = data;
        const cnpjFormated = masks("cnpj", cnpj);
        this.setState({
          [cnpjFormated.name]: cnpjFormated.value,
          clientId,
          razaosocial,
          grupo,
          fieldErrors: {
            ...fieldErrors,
            razaosocial: false,
            cnpj: false
          }
        });
      } else {
        this.setState({
          fieldErrors: { ...fieldErrors, [name]: true }
        });
      }
    }
  };

  onBlur = async e => {
    const { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) }
    });

    if (name === "razaosocial" || name === "cnpj") {
      await this.getClientByParams(name, value, fieldErrors);
    }

    if (name === "codigo") {
      const { status, data } = await GetContractByParams({ code: value });
      if (status === 200 && data) {
        const {
          code: contractCode,
          status,
          type: tipo,
          stockBase: base,
          client: { id: clientId, razaosocial, cnpj, group: grupo },
          items: itens = []
        } = data;

        this.setState({
          contractCode,
          status,
          tipo,
          base,
          clientId,
          razaosocial,
          cnpj,
          grupo,
          itens
        });
      } else {
        this.setState({
          razaosocial: "",
          cnpj: "",
          grupo: "",
          valorTotal: "0",
          dataAtivacao: "",
          status: "STATUS",
          tipo: "TIPO",
          base: "BASE",
          clientId: "",
          contractCode: "",
          itens: []
        });
      }
    }

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

  removeItem = async index => {
    const oldItem = this.state.itens;
    const newItens = oldItem.filter((item, indexx) => index !== indexx);

    await this.setState({
      itens: newItens
    });
  };

  onChangeStatus = value => {
    this.setState({
      status: value
    });
  };

  onChangeTipo = value => {
    this.setState({
      tipo: value
    });
  };

  onChangeBase = value => {
    this.setState({
      base: value
    });
  };

  newContract = async () => {
    const {
      codigo: code,
      status,
      tipo: type,
      base: stockBase,
      clientId,
      contractCode,
      itens = [],
      dateActivation,
      valorTotal: price
    } = this.state;

    let value = {
      status,
      type,
      stockBase,
      itens,
      dateActivation,
      price,
      userId: this.props.login.user.id
    };

    if (contractCode !== "") {
      value = { ...value, contractCode };

      const response = await UpdateContract(value);

      if (response.status === 200) {
        this.clearState();
        message.success("Contrato atualizado com sucesso");
      }
    } else {
      value = { ...value, clientId, code };
      const response = await NewContract(value);

      if (response.status === 200) {
        this.clearState();
        message.success("Contrato cadatrado com sucesso");
      }
    }
  };

  onChangeItem = (value, props) => {
    this.setState({
      item: value,
      itemId: props.key
    });
  };

  onChangeCodigo = value => {
    this.setState({
      codigoItem: value
    });
  };

  ModalIncluir = () => (
    <Modal
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      cancelText="Cancelar"
      okText="Salvar"
    >
      <label
        style={{
          fontFamily: "Bebas",
          fontSize: "20px",
          margin: "10px 0 0 0"
        }}
      >
        Item
      </label>
      <div className="div-line-modal">
        <Select
          style={{ width: "75%", marginRight: "10px" }}
          size="large"
          showSearch
          placeholder="ITEM"
          optionFilterProp="children"
          value={this.state.item}
          onChange={this.onChangeItem}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.state.allItens.map(value => (
            <Option key={value.id} value={value.name}>
              {" "}
              {value.name}
            </Option>
          ))}
        </Select>
        <Select
          style={{ width: "25%" }}
          size="large"
          showSearch
          placeholder="CÓDIGO"
          optionFilterProp="children"
          value={this.state.codigoModal}
          onChange={this.onChangeCodigo}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.state.allItens.map(value => (
            <Option value={value.code}>{value.code}</Option>
          ))}
        </Select>
      </div>
      <div className="div-twoInfo-modal">
        <input
          className={`input-cep-modal ${this.state.fieldErrors.cep &&
            "input-error"}`}
          placeholder="CEP"
          onChange={this.onChange}
          name="cep"
          value={this.state.cep}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        ></input>
        <input
          className="input-bairro-modal"
          placeholder="BAIRRO"
          onChange={this.onChange}
          name="bairro"
          value={this.state.bairro}
        ></input>
      </div>
      <input
        className="input-endereco-modal"
        placeholder="RUA"
        onChange={this.onChange}
        name="rua"
        value={this.state.rua}
      ></input>
      <div className="div-twoInfo-modal">
        <input
          className={`input-cidade-modal ${this.state.fieldErrors.cidade &&
            "input-error"}`}
          placeholder="CIDADE"
          onChange={this.onChange}
          name="cidade"
          value={this.state.cidade}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        ></input>
        <input
          className={`input-uf-modal ${this.state.fieldErrors.uf &&
            "input-error"}`}
          placeholder="UF"
          onChange={this.onChange}
          name="uf"
          value={this.state.uf}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        ></input>
      </div>
      <input
        className="input-endereco-modal"
        placeholder="COMPLEMENTO"
        onChange={this.onChange}
        name="complemento"
        value={this.state.complemento}
      ></input>
      <input
        className="input-endereco-modal"
        placeholder="OBSERVAÇÕES"
        onChange={this.onChange}
        name="observacoes"
        value={this.state.observacoes}
      ></input>
    </Modal>
  );

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    const {
      rua: street,
      bairro: neighborhood,
      cep: zipCode,
      cidade: city,
      uf: state,
      complemento: complement,
      observacoes: observation,
      // contractCode,
      itemId,
      item: name,
      itens
    } = this.state;

    if (
      this.state.item !== "NÃO SELECIONADO" &&
      this.state.cep !== "" &&
      this.state.bairro !== ""
    ) {
      this.setState({
        itens: [
          ...itens,
          {
            name,
            itemId,
            street,
            neighborhood,
            zipCode,
            city,
            state,
            complement,
            observation
          }
        ],
        itemId: "",
        item: "NÃO SELECIONADO",
        codigoModal: "CÓDIGO",
        rua: "",
        bairro: "",
        cep: "",
        cidade: "",
        uf: "",
        complemento: "",
        observacoes: "",
        visible: false
      });
    } else {
      message.error("Selecione um item");
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      item: "NÃO SELECIONADO",
      codigoModal: "CÓDIGO",
      rua: "",
      bairro: "",
      cep: "",
      cidade: "",
      uf: "",
      complemento: "",
      observacoes: "",
      contractCode: "",
      itemId: ""
    });
  };

  render() {
    console.log(this.state.itens);
    const { state } = this;
    const { fieldErrors } = state;

    return (
      <div className="card-main">
        {this.renderRedirect()}
        <this.ModalIncluir />
        <div className="div-titulo-usuario">
          <h1 className="h1-titulo">Contratos</h1>
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
            />
          </div>
        </div>

        <div className="div-inputs-flex">
          <input
            className={`input-codigo-contratos ${fieldErrors.codigo &&
              "input-error"}`}
            placeholder="Nº CONTRATO"
            onChange={this.onChange}
            name="codigo"
            value={this.state.codigo}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          ></input>
          <input
            className={`input-nome-contratos ${fieldErrors.razaosocial &&
              "input-error"}`}
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={this.onChange}
            name="razaosocial"
            value={this.state.razaosocial}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          ></input>
          <input
            className={`input-cnpj-contratos ${fieldErrors.cnpj &&
              "input-error"}`}
            placeholder="CNPJ / CPF"
            onChange={this.onChange}
            name="cnpj"
            value={this.state.cnpj}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          ></input>
          <input
            readOnly
            className="input-grupo-contratos"
            placeholder="GRUPO"
            onChange={this.onChange}
            name="grupo"
            value={this.state.grupo}
          ></input>
        </div>

        <div className="div-inputs-flex-contratos">
          <input
            readOnly
            className="input-valor"
            placeholder="VALOR"
            // onChange={this.onChange}
            name="valorTotal"
            value={this.state.valorTotal}
          ></input>
          <DatePicker
            size="large"
            placeholder="DATA ATIVAÇÃO"
            style={{ marginLeft: "10px" }}
            name="dateActivation"
            value={this.state.dateActivation}
            format="DD/MM/YYYY"
            onChange={e => {
              this.setState({ dateActivation: e });
            }}
          />
          <Select
            placeholder="STATUS"
            value={this.state.status}
            className="select-contratos"
            size="large"
            onChange={this.onChangeStatus}
          >
            <Option value="ATIVO">ATIVO</Option>
            <Option value="DEBITO">EM DÉBITO</Option>
            <Option value="CANCELADO">CANCELADO</Option>
          </Select>
          <Select
            onChange={this.onChangeTipo}
            value={this.state.tipo}
            className="select-contratos"
            size="large"
          >
            <Option value="MENSAL">MENSAL</Option>
            <Option value="ANUAL">ANUAL</Option>
          </Select>
          <Select
            onChange={this.onChangeBase}
            value={this.state.base}
            className="select-contratos"
            size="large"
          >
            <Option value="REALPONTO">REALPONTO</Option>
            <Option value="NOVAREAL">NOVA REALPONTO</Option>
            <Option value="PONTOREAL">PONTOREAL</Option>
          </Select>
          <button
            onClick={this.setRedirect}
            className="button-historico-contratos"
          >
            HISTÓRICO
          </button>
        </div>
        <div className="div-main-contratos">
          <div className="div-itens-contratos">
            <div className="div-h2-modal">
              <h2 style={{ fontFamily: "Bebas", marginLeft: "25px" }}>Itens</h2>
            </div>
            {this.state.itens.length !== 0 ? (
              this.state.itens.map((item, index) => (
                <div className="div-line-contratos" onClick={this.showModal}>
                  <Icon type="question-circle" className="icon-info" />
                  <input
                    readOnly
                    className="input-item-contratos"
                    placeholder={item.name}
                  ></input>
                  <input
                    step="0.01"
                    min="0"
                    max="99999"
                    type="number"
                    className="input-valor-contratos"
                    placeholder="VALOR"
                    onChange={e => {
                      const { value } = e.target;
                      const { itens } = this.state;
                      itens[index].price =
                        itens[index].price === undefined
                          ? "0"
                          : itens[index].price;

                      this.setState({
                        itens
                      });

                      this.setState({
                        valorTotal:
                          parseFloat(this.state.valorTotal, 10) +
                          parseFloat(value.slice(0, 9), 10) -
                          parseFloat(itens[index].price, 10)
                      });

                      itens[index].price = value.slice(0, 9);

                      this.setState({
                        itens
                      });
                    }}
                    value={item.price}
                  ></input>
                  <input
                    className="input-data-contratos"
                    // placeholder="DATA"
                    value={moment(item.createdAt).format("lll")}
                  ></input>
                  <button
                    className="button-delete"
                    onClick={() => this.removeItem(index)}
                  >
                    <Icon type="delete" />
                  </button>
                </div>
              ))
            ) : (
              <div className="div-noItens-contratos">
                NÃO HÁ NENHUM ITEM NO CONTRATO
              </div>
            )}
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-salvar" onClick={this.newContract}>
            Salvar
          </button>
          <button className="button-incluir" onClick={this.showModal}>
            Incluir
          </button>
        </div>
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ setContractCode }, dispach);
}

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(NewContratosContainer);
