import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "../../../../global.css";
import "./index.css";
import { Icon, Select, message, Modal, DatePicker } from "antd";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
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
    indexIgpm: -1,
    index: "",
    redirect: false,
    visible: false,
    modalAtualizada: false,
    search: "",
    razaosocial: "",
    cnpj: "",
    codigo: "",
    grupo: "",
    dataAtivacao: "",
    dataRescisao: null,
    status: "STATUS",
    base: "BASE",
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
    allItens: []
  };

  clearState = () => {
    this.setState({
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
      status: "STATUS",
      base: "BASE",
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
      }
    };
    await this.setState({ allItens: (await GetAllItens(query)).data });
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value.toUpperCase()
    });
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

    if (name === "razaosocial" || name === "cnpj") {
      await this.getClientByParams(name, value, fieldErrors);
    }

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
          priceYearly
        } = data;

        this.setState({
          fieldErrors: {
            razaosocial: false,
            cnpj: false,
            codigo: false
          },
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
      priceYearly
    } = this.state;

    let value = {
      status,
      stockBase,
      itens: itens.map(item => {
        if (R.has("id", item)) {
          const { price, address, contractItemId, id: itemId, id } = item;
          return { price, address, contractItemId, itemId, id };
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
    const {
      id = null,
      name: item,
      code: codigoModal,
      itemId,
      address
    } = this.state.itens[index];

    const {
      street: rua,
      neighborhood: bairro,
      zipCode: cep,
      city: cidade,
      state: uf,
      complement: complemento,
      observation: observacoes
    } = id ? address : this.state.itens[index];

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
      index,
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
      index
    } = this.state;

    const copyItens = itens;

    copyItens[index] = {
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

  render() {
    const { state } = this;
    const { fieldErrors } = state;

    return (
      <div className="card-main">
        {this.renderRedirect()}
        <this.ModalIncluir />
        <div className="div-titulo">
          <h1 className="h1-titulo">Contratos</h1>
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
          <DatePicker
            size="large"
            placeholder="DATA ATIVAÇÃO"
            className="data-contratos"
            style={{ margin: "0 25px 0 10px", width: "35%" }}
            name="dataAtivacao"
            value={this.state.dataAtivacao}
            format="DD/MM/YYYY"
            onChange={e => {
              this.setState({ dataAtivacao: e });
            }}
          />
        </div>

        <div className="div-inputs-flex-contratos">
          <DatePicker
            size="large"
            placeholder="DATA RESCISÃO"
            style={{ marginLeft: "25px", width: "35%" }}
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
            style={{ width: "25%", marginLeft: "10px" }}
          >
            <Option value="ATIVO">ATIVO</Option>
            <Option value="DEBITO">EM DÉBITO</Option>
            <Option value="CANCELADO">CANCELADO</Option>
          </Select>
          <Select
            onChange={this.onChangeBase}
            value={this.state.base}
            className="select-contratos"
            size="large"
            style={{ marginLeft: "10px" }}
          >
            <Option value="REALPONTO">REALPONTO</Option>
            <Option value="NOVAREAL">NOVA REALPONTO</Option>
            <Option value="PONTOREAL">PONTOREAL</Option>
          </Select>
          {this.state.contractCode !== "" ? (
            <button
              onClick={this.setRedirect}
              className="button-historico-contratos"
            >
              HISTÓRICO
            </button>
          ) : (
            <button className="button-historico-contratos-disable" disabled>
              HISTÓRICO
            </button>
          )}
        </div>

        <div className="div-main-contratos">
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
                      onClick={() => this.getModal(index)}
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
                      onChange={e => {
                        const { value } = e.target;
                        const {
                          itens,
                          priceMonthly,
                          priceYearly
                          // valorTotal = this.state.valorTotal
                          // ? parseFloat(this.state.valorTotal, 10)
                          // : 0
                        } = this.state;
                        itens[index].price =
                          itens[index].price === undefined
                            ? "0"
                            : itens[index].price;
                        this.setState({
                          itens
                        });

                        // console.log(priceMonthly);
                        // console.log(parseFloat(value.slice(0, 9), 10));
                        // console.log(parseFloat(itens[index].price, 10));
                        // console.log(item.type);
                        // console.log(
                        //   priceMonthly +
                        //     parseFloat(value.slice(0, 9), 10) -
                        //     parseFloat(itens[index].price, 10)
                        // );

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
                              : priceYearly
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
                      value={moment(item.createdAt).format("L")}
                    ></input>
                    <div className="div-block-button-donw">
                      {item.igpms.length !== 0 ? (
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
                    <button
                      className="button-delete"
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
                    >
                      <Icon type="delete" />
                    </button>
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
            ) : (
              <div className="div-noItens-contratos">
                NÃO HÁ NENHUM ITEM NO CONTRATO
              </div>
            )}
          </div>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-incluir" onClick={this.showModal}>
            Incluir
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
