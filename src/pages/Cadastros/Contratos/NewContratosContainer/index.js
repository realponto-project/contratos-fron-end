import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "../../../../global.css";
import "./index.css";
import { Icon, Select, message, Modal, DatePicker, InputNumber } from "antd";

import {
  DownOutlined,
  UpOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined
} from "@ant-design/icons";
import * as R from "ramda";
import { Redirect } from "react-router-dom";

import { GetClientByParams, GetAllClient } from "../../../../services/client";
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
    indexIgpm: -1,
    fine: "",
    index: NaN,
    redirect: false,
    visible: false,
    divOculta: false,
    modalInfo: false,
    modalAtualizada: false,
    search: "",
    razaosocial: "",
    cnpj: "",
    codigo: "",
    grupo: "",
    dataAtivacao: "",
    dataRescisao: null,
    status: "ATIVO",
    base: undefined,
    clientId: "",
    item: "NÃO SELECIONADO",
    codigoModal: "CÓDIGO",
    cnpjModal: "",
    tipo: undefined,
    rua: "",
    bairro: "",
    cep: "",
    cidade: "",
    uf: "",
    complemento: "",
    observacoes: "",
    contractCode: "",
    type: "",
    itemId: "",
    priceMonthly: "",
    priceYearly: "",
    fieldErrors: {
      razaosocial: false,
      cnpj: false,
      cnpjModal: false,
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
    allItens: [],
    clientList: []
  };

  clearState = () => {
    this.setState({
      fine: 0,
      priceMonthly: "",
      priceYearly: "",
      visible: false,
      search: "",
      razaosocial: "",
      cnpj: "",
      codigo: "",
      grupo: "",
      dataRescisao: null,
      dataAtivacao: "",
      status: "ATIVO",
      base: undefined,
      clientId: "",
      item: "NÃO SELECIONADO",
      codigoModal: "",
      cnpjModal: "",
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
        cnpjModal: false,
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
      return <Redirect push to="/logged/history/dash" />;
    }
  };

  componentDidMount = async () => {
    const query = {
      filters: {
        item: {
          specific: {
            igpm: false
          }
        }
      },
      total: 500
    };
    await this.setState({ allItens: (await GetAllItens(query)).data.rows });

    await this.getAllClient();
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      // [name]: value.toUpperCase()
      [name]: value
    });
  };

  getAllClient = async cnpj => {
    const query = {
      filters: {
        client: {
          specific: {
            cnpj
          }
        }
      },
      total: 50
    };
    const { status, data } = await GetAllClient(query);
    if (status === 200) {
      this.setState({ clientList: data.rows });
    }
  };

  getClientByParams = async (name, value, fieldErrors) => {
    const { status, data } = await GetClientByParams({
      where: {
        [name]: name === "cnpj" ? value.replace(/\D/gi, "") : value
      }
    });
    if (status === 200) {
      if (data) {
        const {
          id: clientId,
          razaosocial,
          cnpj,
          group: { group: grupo }
        } = data;
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

    if (name === "codigo") {
      const { status, data } = await GetContractByParams({ code: value });
      if (status === 200 && data) {
        const {
          code: contractCode,
          status,
          stockBase: base,
          client: { id: clientId, razaosocial, cnpj, group: grupo },
          items: itens = [],
          dateActivation: dataAtivacao,
          dateTermination: dataRescisao,
          priceMonthly,
          priceYearly,
          fine
        } = data;

        this.setState({
          fieldErrors: {
            razaosocial: false,
            cnpj: false,
            codigo: false
          },
          fine,
          contractCode,
          status,
          dataAtivacao: moment(dataAtivacao),
          dataRescisao: dataRescisao ? moment(dataRescisao) : dataRescisao,
          base,
          clientId,
          razaosocial,
          cnpj,
          grupo,
          itens,
          priceMonthly,
          priceYearly
        });
      } else {
        this.setState({
          razaosocial: "",
          cnpj: "",
          grupo: "",
          dataRescisao: null,
          dataAtivacao: "",
          status: "STATUS",
          base: "BASE",
          clientId: "",
          contractCode: "",
          itens: [],
          priceMonthly: 0,
          priceYearly: 0
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

  onFocus = e => {
    const { name } = e.target;

    const { fieldErrors } = this.state;

    this.setState({ fieldErrors: { ...fieldErrors, [name]: false } });
  };

  removeItem = async index => {
    const oldItem = this.state.itens;
    oldItem.splice(index, 1);

    await this.setState({
      itens: oldItem
    });
  };

  onChangeStatus = value => {
    const { status, dataRescisao } = this.state;
    this.setState({
      dataRescisao: status !== "CANCELADO" ? dataRescisao : null,
      status: value
    });
  };

  onChangeBase = value => {
    this.setState({
      base: value
    });
  };

  newContract = async () => {
    // console.log(this.state);
    const {
      codigo: code,
      status,
      base: stockBase,
      clientId,
      contractCode,
      itens = [],
      dataAtivacao: dateActivation,
      dataRescisao: dateTermination,
      priceMonthly,
      priceYearly,
      fine
    } = this.state;

    let value = {
      status,
      fine,
      stockBase,
      itens: itens.map(item => {
        if (R.has("id", item)) {
          const {
            price,
            address,
            contractItemId,
            id: itemId,
            id,
            zipCode,
            street,
            neighborhood,
            city,
            state,
            complement,
            observation
          } = item;
          return {
            price,
            address: zipCode
              ? {
                  ...address,
                  zipCode,
                  street,
                  neighborhood,
                  city,
                  state,
                  complement,
                  observation
                }
              : address,
            contractItemId,
            itemId,
            id
          };
        }
        return item;
      }),
      dateActivation,
      dateTermination,
      userId: this.props.login.user.id,
      priceMonthly,
      priceYearly
    };

    if (contractCode !== "") {
      value = { ...value, contractCode };

      console.log(value);

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
      } else if (response.status === 422) {
        R.keys(response.data.errors[0].field).map(key =>
          this.setState({
            fieldErrors: {
              ...this.state.fieldErrors,
              [key]: response.data.errors[0].field
            }
          })
        );
      }
    }
  };

  onChangeSelect = (value, option) => {
    this.setState({
      item: option.props.item.name,
      codigoModal: option.props.item.code,
      type: option.props.item.type,
      itemId: option.key
    });
  };

  ModalIncluir = () => (
    <Modal
      width={700}
      visible={this.state.visible}
      onOk={this.state.modalAtualizada ? this.handleOkAtualizar : this.handleOk}
      onCancel={this.handleCancel}
      cancelText="Cancelar"
      okText={this.state.modalAtualizada ? "Atualizar" : "Salvar"}
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
          style={{
            width: "75%",
            marginRight: "10px"
          }}
          size="large"
          showSearch
          placeholder="ITEM"
          optionFilterProp="children"
          value={this.state.item}
          onChange={this.onChangeSelect}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          getInputElement={() => (
            <input
              style={{
                textTransform: "uppercase"
              }}
            />
          )}
        >
          {this.state.allItens.map(value => (
            <Option key={value.id} value={value.name} item={value}>
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
          onChange={this.onChangeSelect}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.state.allItens.map(value => (
            <Option key={value.id} value={value.code} item={value}>
              {value.code}
            </Option>
          ))}
        </Select>
      </div>
      <div className="div-line-modal">
        <Select
          onChange={value => this.setState({ tipo: value })}
          placeholder="TIPO"
          value={this.state.tipo}
          size="large"
          style={{ width: "40%" }}
        >
          <Option value="MENSAL">MENSAL</Option>
          <Option value="ANUAL">ANUAL</Option>
        </Select>
        <input
          className={`input-cnpj-contratos ${this.state.fieldErrors.cnpjModal &&
            "input-error"}`}
          style={{ width: "40%" }}
          placeholder="CNPJ / CPF"
          onChange={this.onChange}
          name="cnpjModal"
          value={this.state.cnpjModal}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        ></input>
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

  showModal = e => {
    this.setState({
      visible: true
    });
  };

  getModal = index => {
    // console.log(index);
    const {
      id: itemId,
      contractItemId: id,
      contractItem: { type: tipo, cnpj: cnpjModal },
      name: item,
      code: codigoModal,
      costPrice,
      address,
      zipCode
    } = this.state.itens[index];

    if ((id && address) || zipCode) {
      const {
        street: rua,
        neighborhood: bairro,
        zipCode: cep,
        city: cidade,
        state: uf,
        complement: complemento,
        observation: observacoes
      } = id && !zipCode ? address : this.state.itens[index];

      this.setState({
        visible: true,
        itemId,
        item,
        codigoModal,
        rua,
        bairro,
        cep,
        cidade,
        uf,
        complemento,
        observacoes,
        modalAtualizada: true
      });
    }

    this.setState({
      index,
      costPrice,
      visible: true,
      itemId,
      item,
      codigoModal,
      tipo,
      cnpjModal,
      modalAtualizada: true
    });
  };

  handleOkAtualizar = () => {
    const {
      rua: street,
      bairro: neighborhood,
      cep: zipCode,
      cidade: city,
      uf: state,
      complemento: complement,
      observacoes: observation,
      itemId,
      item: name,
      itens,
      costPrice,
      index
    } = this.state;

    const copyItens = itens;

    // console.log(index, copyItens[index]);

    copyItens[index] = {
      ...copyItens[index],
      costPrice,
      street,
      neighborhood,
      zipCode,
      city,
      state,
      complement,
      observation,
      itemId,
      name
    };

    if (
      this.state.item !== "NÃO SELECIONADO" &&
      this.state.cep !== "" &&
      this.state.bairro !== ""
    ) {
      this.setState({
        itens: copyItens,
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
        visible: false,
        modalAtualizada: false
      });
    } else {
      message.error("Verifique se não falta nada para ser preenchido.");
    }
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
      tipo: type,
      cnpjModal: cnpj,
      // contractCode,
      itemId,
      item: name,
      itens
    } = this.state;

    if (
      this.state.itemId &&
      this.state.tipo &&
      ((this.state.type === "EQUIPAMENTO" &&
        this.state.cep &&
        this.state.bairro) ||
        (this.state.type === "SOFTWARE" &&
          ((this.state.cep && this.state.bairro) || !this.state.cep)))
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
            observation,
            igpms: [],
            type,
            cnpj
          }
        ],
        itemId: "",
        item: "NÃO SELECIONADO",
        codigoModal: "CÓDIGO",
        tipo: undefined,
        rua: "",
        bairro: "",
        cep: "",
        cidade: "",
        uf: "",
        complemento: "",
        observacoes: "",
        visible: false,
        modalAtualizada: false
      });
    } else {
      message.error("Verifique se não falta nada para ser preenchido.");
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
      itemId: "",
      modalAtualizada: false
    });
  };

  disabledDate = current => {
    return current && current < moment().startOf("day");
  };

  ModalInfo = () => {
    let address = {};
    if (this.state.itens[this.state.index]) {
      address = this.state.itens[this.state.index].address;
      const {
        zipCode,
        street,
        neighborhood,
        city,
        state,
        complement,
        observation
      } = this.state.itens[this.state.index];
      address = zipCode
        ? {
            ...address,
            zipCode,
            street,
            neighborhood,
            city,
            state,
            complement,
            observation
          }
        : address;
    }
    return (
      <Modal
        width={700}
        visible={this.state.modalInfo}
        onOk={e => console.log(e)}
        onCancel={() => this.setState({ modalInfo: false })}
        cancelText="Cancelar"
        okText="OK"
      >
        {this.state.itens[this.state.index] && (
          <div className="card-modal-info">
            <div className="rows-modal-info">
              <div className="rows-block-modal-info" style={{ width: "75%" }}>
                <strong>Item:</strong>
                <label>{this.state.itens[this.state.index].name}</label>
              </div>
              <div className="rows-block-modal-info" style={{ width: "25%" }}>
                <strong>Código:</strong>
                <label>{this.state.itens[this.state.index].code}</label>
              </div>
            </div>

            <div className="rows-modal-info">
              <div className="rows-block-modal-info" style={{ width: "100%" }}>
                <strong>Descrição:</strong>
                <label>{this.state.itens[this.state.index].description}</label>
              </div>
            </div>

            <div className="rows-modal-info">
              <div className="rows-block-modal-info" style={{ width: "25%" }}>
                <strong>Custo:</strong>
                <label>
                  {this.state.itens[this.state.index].costPrice.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL"
                    }
                  )}
                </label>
              </div>
              <div className="rows-block-modal-info" style={{ width: "35%" }}>
                <strong>Tipo:</strong>
                <label>
                  {this.state.itens[this.state.index].contractItem &&
                    this.state.itens[this.state.index].contractItem.type}
                </label>
              </div>
              <div className="rows-block-modal-info" style={{ width: "40%" }}>
                <strong>CNPJ:</strong>
                <label>
                  {this.state.itens[this.state.index].contractItem &&
                    this.state.itens[this.state.index].contractItem.cnpj}
                </label>
              </div>
            </div>

            {address && (
              <>
                <div className="rows-modal-info">
                  <div
                    className="rows-block-modal-info"
                    style={{ width: "45%" }}
                  >
                    <strong>Rua:</strong>
                    <label>{address.street}</label>
                  </div>
                  <div
                    className="rows-block-modal-info"
                    style={{ width: "45%" }}
                  >
                    <strong>Bairro:</strong>
                    <label>{address.neighborhood}</label>
                  </div>
                </div>

                <div className="rows-modal-info">
                  <div
                    className="rows-block-modal-info"
                    style={{ width: "45%" }}
                  >
                    <strong>CEP:</strong>
                    <label>{address.zipCode}</label>
                  </div>
                  <div
                    className="rows-block-modal-info"
                    style={{ width: "45%" }}
                  >
                    <strong>Cidade:</strong>
                    <label>{address.city}</label>
                  </div>
                  <div
                    className="rows-block-modal-info"
                    style={{ width: "10%" }}
                  >
                    <strong>UF:</strong>
                    <label>{address.state}</label>
                  </div>
                </div>

                <div className="rows-modal-info">
                  <div
                    className="rows-block-modal-info"
                    style={{ width: "45%" }}
                  >
                    <strong>Complemento:</strong>
                    <label>{address.complement}</label>
                  </div>
                </div>

                <div className="rows-modal-info">
                  <div
                    className="rows-block-modal-info"
                    style={{ width: "45%" }}
                  >
                    <strong>Observacoes:</strong>
                    <label>{address.observacoes}</label>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    );
  };

  render() {
    const { state } = this;
    const { fieldErrors } = state;

    // console.log(state);

    return (
      <div className="card-main">
        {this.renderRedirect()}
        <this.ModalIncluir />
        <this.ModalInfo />
        <div className="div-titulo">
          <h1 className="h1-titulo">Contratos</h1>
        </div>

        <div className="div-card-contratos-1">
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
            <Select
              // className={`input-cnpj-contratos ${
              //   fieldErrors.cnpj && "input-error"
              // }`}
              style={{ width: "25%" }}
              onChange={id => {
                const { clientList } = this.state;
                const index = R.findIndex(R.propEq("id", id))(clientList);

                this.setState({
                  razaosocial: clientList[index].razaosocial,
                  cnpj: clientList[index].cnpj,
                  grupo: clientList[index].group.group
                });
              }}
              showSearch
              onSearch={cnpj => this.getAllClient(cnpj)}
              placeholder="cnpj"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              size="large"
            >
              {this.state.clientList.map(client => (
                <Option
                  value={client.id}
                  onMouseEnter={() =>
                    this.setState({
                      razaosocial: client.razaosocial,
                      grupo: client.group.group
                    })
                  }
                  onMouseLeave={() => {
                    if (this.state.cnpj === "")
                      this.setState({
                        razaosocial: "",
                        grupo: ""
                      });
                  }}
                >
                  {client.cnpj}
                </Option>
              ))}
            </Select>
            <input
              className={`input-nome-contratos ${fieldErrors.razaosocial &&
                "input-error"}`}
              style={{ textTransform: "uppercase" }}
              placeholder="RAZÃO SOCIAL / NOME"
              onChange={this.onChange}
              name="razaosocial"
              value={this.state.razaosocial}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            ></input>
          </div>

          <div className="div-inputs-flex-contratos">
            <input
              readOnly
              className="input-grupo-contratos"
              placeholder="GRUPO"
              onChange={this.onChange}
              name="grupo"
              value={this.state.grupo}
            ></input>
            <Select
              onChange={this.onChangeBase}
              value={this.state.base}
              className="select-contratos"
              placeholder="base"
              size="large"
              // style={{ marginLeft: "10px" }}
            >
              <Option value="REALPONTO">REALPONTO</Option>
              <Option value="NOVAREAL">NOVA REALPONTO</Option>
              <Option value="PONTOREAL">PONTOREAL</Option>
            </Select>
            <DatePicker
              size="large"
              placeholder="DATA ATIVAÇÃO"
              className="data-contratos"
              style={{ margin: "0", width: "30%" }}
              name="dataAtivacao"
              value={this.state.dataAtivacao}
              format="DD/MM/YYYY"
              onChange={e => {
                this.setState({ dataAtivacao: e });
              }}
            />
          </div>

          {this.state.divOculta && (
            <div className="div-inputs-flex-contratos">
              <DatePicker
                size="large"
                placeholder="DATA RESCISÃO"
                style={{ marginLeft: "25px", width: "30%" }}
                name="dataRescisao"
                value={this.state.dataRescisao}
                disabledDate={this.disabledDate}
                format="DD/MM/YYYY"
                onChange={e => {
                  this.setState({ dataRescisao: e });
                }}
              />
              <Select
                placeholder="STATUS"
                value={this.state.status}
                size="large"
                onChange={this.onChangeStatus}
                className="select-contratos"
              >
                <Option value="ATIVO">ATIVO</Option>
                <Option value="DEBITO">EM DÉBITO</Option>
                <Option value="CANCELADO">CANCELADO</Option>
              </Select>
              <div className="div-block-row">
                <InputNumber
                  placeholder="MULTA"
                  size="large"
                  style={{ marginRight: "5%", width: "45%" }}
                  value={this.state.fine}
                  step={0.01}
                  min={0}
                  onChange={fine => this.setState({ fine })}
                />
                <button
                  onClick={() =>
                    this.state.contractCode !== "" ? this.setRedirect : null
                  }
                  className={
                    this.state.contractCode !== ""
                      ? "button-historico-contratos"
                      : "button-historico-contratos-disable"
                  }
                  disabled={this.state.contractCode === ""}
                >
                  HISTÓRICO
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px"
            }}
          >
            {!this.state.divOculta ? (
              <PlusOutlined
                onClick={() => this.setState({ divOculta: true })}
                className="icon-plus-contratos"
              />
            ) : (
              <MinusOutlined
                onClick={() => this.setState({ divOculta: false })}
                className="icon-plus-contratos"
              />
            )}
          </div>
        </div>

        <div
          className="div-inputs-flex-contratos"
          style={{ marginTop: "20px" }}
        >
          <input
            readOnly
            className="input-valor-contratos"
            placeholder="VALOR MENSAL"
            value={this.state.priceMonthly}
          ></input>
          <input
            readOnly
            className="input-valor-contratos"
            placeholder="VALOR ANUAL"
            value={this.state.priceYearly}
          ></input>
        </div>

        <div className="div-card-contratos-1">
          <div className="div-block-header-contractItem">
            <h2 style={{ fontFamily: "Bebas" }}>Itens</h2>
            <button className="button-incluir" onClick={this.showModal}>
              Incluir
            </button>
          </div>
          <div className="div-block-title-contractItem">
            <div className="div-codico-title-contractItem">
              <h4 className="h4-title-contractItem">#</h4>
            </div>
            <div className="div-nome-title-contractItem">
              <h4 className="h4-title-contractItem">name</h4>
            </div>
            <div className="div-tipo-title-contractItem">
              <h4 className="h4-title-contractItem">tipo</h4>
            </div>
            <div className="div-valor-title-contractItem">
              <h4 className="h4-title-contractItem">valor</h4>
            </div>
            <div className="div-acoes-title-contractItem">
              <h4 className="h4-title-contractItem">ações</h4>
            </div>
          </div>
          {this.state.itens.length !== 0
            ? this.state.itens.map((item, index) => (
                <>
                  <hr style={{ margin: "0" }} />
                  <div className="div-block-title-contractItem">
                    <div className="div-codico-title-contractItem">
                      <label>{item.code}</label>
                    </div>
                    <div className="div-nome-title-contractItem">
                      <label>{item.name}</label>
                    </div>
                    <div className="div-tipo-title-contractItem">
                      <label>{item.type}</label>
                    </div>
                    <div className="div-valor-title-contractItem">
                      <label>
                        {item.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        })}
                      </label>
                    </div>
                    <div className="div-acoes-title-contractItem">
                      {item.igpms && item.igpms.length !== 0 ? (
                        <>
                          {this.state.indexIgpm === index ? (
                            <UpOutlined
                              className="icon-info"
                              onClick={() => this.setState({ indexIgpm: -1 })}
                            />
                          ) : (
                            <DownOutlined
                              className="icon-info"
                              onClick={() =>
                                this.setState({ indexIgpm: index })
                              }
                            />
                          )}
                        </>
                      ) : (
                        <MinusOutlined />
                      )}
                      <EditOutlined
                        className="icon-edit-contractItem"
                        onClick={() => this.getModal(index)}
                      />
                      <CloseOutlined
                        className="icon-close"
                        onClick={() => {
                          const { priceMonthly, priceYearly } = this.state;
                          const price = item.price
                            ? parseFloat(item.price, 10)
                            : 0;
                          this.setState({
                            priceMonthly:
                              item.type === "MENSAL"
                                ? priceMonthly - price
                                : priceMonthly,
                            priceYearly:
                              item.type === "ANUAL"
                                ? priceYearly - price
                                : priceYearly
                          });
                          this.removeItem(index);
                        }}
                      />
                    </div>
                  </div>
                  {this.state.indexIgpm === index &&
                    this.state.itens[this.state.indexIgpm].igpms.map(item => (
                      <div className="div-igpm-contratos">
                        <h4 className="h4-contratos">{`${item.type} ${
                          item.month
                        }/${item.year}  ${item.value.toFixed(2)}%`}</h4>
                      </div>
                    ))}
                </>
              ))
            : null}
        </div>

        {/* <div className="div-main-contratos">
          <div className="div-itens-contratos">
            <div className="div-h2-modal">
              <h2 style={{ fontFamily: "Bebas", marginLeft: "25px" }}>Itens</h2>
            </div>
            {this.state.itens.length !== 0 ? (
              this.state.itens.map((item, index) => (
                <>
                  <div className="div-line-contratos">
                    <Icon
                      type="question-circle"
                      className="icon-info"
                      style={{ margin: "0 2px 0 25px" }}
                      onClick={() => this.setState({ modalInfo: true, index })}
                    />
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
                      onChange={(e) => {
                        const { value } = e.target;
                        const { itens, priceMonthly, priceYearly } = this.state;
                        itens[index].price =
                          itens[index].price === undefined
                            ? "0"
                            : itens[index].price;
                        this.setState({
                          itens,
                        });

                        this.setState({
                          priceMonthly:
                            item.type === "MENSAL"
                              ? priceMonthly +
                                parseFloat(value.slice(0, 9), 10) -
                                parseFloat(itens[index].price, 10)
                              : priceMonthly,
                          priceYearly:
                            item.type === "ANUAL"
                              ? priceYearly +
                                parseFloat(value.slice(0, 9), 10) -
                                parseFloat(itens[index].price, 10)
                              : priceYearly,
                        });

                        itens[index].price = value.slice(0, 9);

                        this.setState({
                          itens,
                        });
                      }}
                      value={item.price}
                    ></input>
                    <input
                      className="input-data-contratos"
                      value={moment(item.createdAt).format("L")}
                    ></input>
                    <div className="div-block-button-donw">
                      {item.igpms && item.igpms.length !== 0 ? (
                        <>
                          {this.state.indexIgpm === index ? (
                            <UpOutlined
                              onClick={() => this.setState({ indexIgpm: -1 })}
                            />
                          ) : (
                            <DownOutlined
                              onClick={() =>
                                this.setState({ indexIgpm: index })
                              }
                            />
                          )}
                        </>
                      ) : null}
                    </div>
                    <div className="div-block-icons-update-delete">
                      <Icon
                        type="edit"
                        className="icon-edit"
                        onClick={() => this.getModal(index)}
                      />
                      <Icon
                        type="delete"
                        className="icon-delete"
                        onClick={() => {
                          const { priceMonthly, priceYearly } = this.state;
                          const price = item.price
                            ? parseFloat(item.price, 10)
                            : 0;
                          this.setState({
                            priceMonthly:
                              item.type === "MENSAL"
                                ? priceMonthly - price
                                : priceMonthly,
                            priceYearly:
                              item.type === "ANUAL"
                                ? priceYearly - price
                                : priceYearly,
                          });
                          this.removeItem(index);
                        }}
                      />
                    </div>
                  </div>
                  {this.state.indexIgpm === index &&
                    this.state.itens[this.state.indexIgpm].igpms.map((item) => (
                      <div className="div-igpm-contratos">
                        <h4 className="h4-contratos">{`${item.type} ${
                          item.month
                        }/${item.year}  ${item.value.toFixed(2)}%`}</h4>
                      </div>
                    ))}
                </>
              ))
            ) : (
              <div className="div-noItens-contratos">
                NÃO HÁ NENHUM ITEM NO CONTRATO
              </div>
            )}
          </div>
        </div> */}
        <div className="div-buttons-usuario">
          <button className="button-cancelar" onClick={this.clearState}>
            Cancelar
          </button>
          <button className="button-salvar-cliente" onClick={this.newContract}>
            Salvar
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
