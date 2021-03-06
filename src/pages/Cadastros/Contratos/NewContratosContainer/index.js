import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "../../../../global.css";
import "./index.css";
import {
  Switch,
  Button,
  Progress,
  Select,
  message,
  Modal,
  DatePicker,
  InputNumber,
  Steps,
} from "antd";

import {
  DownOutlined,
  UpOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  MailOutlined,
  MinusOutlined,
  BellOutlined,
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
  GetContractByParams,
} from "../../../../services/contract";
import { GetAllUsers } from "../../../../services/user";
import moment from "moment";
import { setContractCode } from "../ContratosRedux/action";
import { clearContract } from "../../../Relatorios/Cadastro/cadastroRedux/action";

const { Option } = Select,
  { Step } = Steps;

class NewContratosContainer extends Component {
  state = {
    base: undefined,
    clientId: "",
    item: undefined,
    codigoModal: undefined,
    tipo: undefined,
    dataRescisao: null,
    index: NaN,
    indexIgpm: -1,
    progressModalItem: 0,
    quantidade: 1,
    priceCostModal: undefined,
    priceSaleModal: undefined,
    redirect: false,
    empresaAtual: true,
    divOculta: false,
    modalInfo: false,
    modalAtualizada: false,
    visible: false,
    search: "",
    fine: 0,
    razaosocial: "",
    razaosocialModal: "",
    cnpjModal: "",
    cnpj: undefined,
    codigo: "",
    grupo: "",
    dataAtivacao: "",
    rua: "",
    number: "",
    bairro: "",
    cep: "",
    cidade: "",
    uf: "",
    complemento: "",
    observacoes: "",
    contractCode: "",
    type: "",
    itemId: "",
    priceMonthly: 0,
    priceYearly: 0,
    username: undefined,
    userId: "",
    status: "ATIVO",
    fieldErrors: {
      razaosocial: false,
      cnpj: false,
      cnpjModal: false,
      codigo: false,
      rua: false,
      number: false,
      bairro: false,
      cep: false,
      cidade: false,
      uf: false,
      complemento: false,
      observacoes: false,
    },
    itens: [],
    allItens: [],
    clientList: [],

    count: 0,
    page: 1,
    total: 10,
    userList: [],
  };

  clearState = () => {
    this.setState({
      fine: 0,
      priceMonthly: 0,
      priceYearly: 0,
      visible: false,
      search: "",
      razaosocial: "",
      cnpj: undefined,
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
      number: "",
      bairro: "",
      cep: "",
      cidade: "",
      uf: "",
      complemento: "",
      observacoes: "",
      contractCode: "",
      itemId: "",
      username: undefined,
      userId: "",
      fieldErrors: {
        razaosocial: false,
        cnpjModal: false,
        cnpj: false,
        codigo: false,
        rua: false,
        number: false,
        bairro: false,
        cep: false,
        cidade: false,
        uf: false,
        complemento: false,
        observacoes: false,
      },
      itens: [],
    });
  };

  setRedirect = () => {
    this.props.setContractCode(this.state.codigo);

    this.setState({
      redirect: true,
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to="/logged/history/dash" />;
    }
  };

  getAllUsers = async () => {
    const query = {
      filters: {
        user: {
          specific: {
            award: true,
          },
        },
      },
      total: 500,
    };
    const { status, data } = await GetAllUsers(query);

    if (status === 200) {
      this.setState({ userList: data.rows });
    }
  };

  componentDidMount = async () => {
    await this.getAllUsers();
    const query = {
      filters: {
        item: {
          specific: {
            igpm: false,
          },
        },
      },
      total: 500,
    };
    await this.setState({ allItens: (await GetAllItens(query)).data.rows });

    await this.getAllClient();

    const { code: codigo } = this.props.contractValue;
    await this.setState({ codigo });
    await this.getContractByParams();
    this.props.clearContract();
  };

  onChange = (e) => {
    const { name, value } = masks(e.target.name, e.target.value);
    this.setState({
      [name]: value,
    });
  };

  getAllClient = async (cnpj) => {
    const query = {
      filters: {
        client: {
          specific: {
            cnpj,
          },
        },
      },
      total: 50,
    };
    const { status, data } = await GetAllClient(query);
    if (status === 200) {
      this.setState({ clientList: data.rows });
    }
  };

  getClientByParams = async (name, value, fieldErrors) => {
    const { status, data } = await GetClientByParams({
      where: {
        [name]: name === "cnpj" ? value.replace(/\D/gi, "") : value,
      },
    });
    if (status === 200) {
      if (data) {
        const {
          id: clientId,
          razaosocial,
          cnpj,
          group: { group: grupo },
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
            cnpj: false,
          },
        });
      } else {
        this.setState({
          fieldErrors: { ...fieldErrors, [name]: true },
        });
      }
    }
  };

  getContractByParams = async () => {
    const { codigo: code } = this.state;
    const query = { code, page: this.state.page, total: this.state.total };

    const { status, data } = await GetContractByParams(query);
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
        fine,
        show,
        page,
        count,
      } = data;

      this.setState({
        fieldErrors: {
          razaosocial: false,
          cnpj: false,
          codigo: false,
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
        priceYearly,
        show,
        page,
        count,
      });
    } else {
      this.setState({
        razaosocial: "",
        cnpj: undefined,
        grupo: "",
        dataRescisao: null,
        dataAtivacao: "",
        status: "ATIVO",
        base: undefined,
        clientId: "",
        contractCode: "",
        itens: [],
        priceMonthly: 0,
        priceYearly: 0,
      });
    }
  };

  onBlur = async (e) => {
    const { name, value } = e.target;
    const { fieldErrors } = this.state;

    this.setState({
      fieldErrors: { ...fieldErrors, [name]: validator(name, value) },
    });

    if (name === "codigo") {
      this.setState({ page: 1 });
      await this.getContractByParams();
    }

    if (name === "cep" && !validator(name, value)) {
      const { status, data } = await getAddressByZipCode(value);
      if (status === 200) {
        if (R.has("erro", data)) {
          this.setState({
            fieldErrors: { ...fieldErrors, [name]: true },
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
              uf: false,
            },
          });
        }
      }
    }
  };

  onFocus = (e) => {
    const { name } = e.target;

    const { fieldErrors } = this.state;

    this.setState({ fieldErrors: { ...fieldErrors, [name]: false } });
  };

  removeItem = async (index) => {
    const oldItem = this.state.itens;
    oldItem.splice(index, 1);

    await this.setState({
      itens: oldItem,
    });
  };

  onChangeStatus = (value) => {
    const { status, dataRescisao } = this.state;
    this.setState({
      dataRescisao: status !== "CANCELADO" ? dataRescisao : null,
      status: value,
    });
  };

  onChangeBase = (value) => {
    this.setState({
      base: value,
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
      priceYearly,
      fine,
    } = this.state;

    let value = {
      status,
      fine,
      stockBase,
      itens: itens.map((item) => {
        if (R.has("id", item)) {
          const {
            type,
            quantidade,
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
            observation,
            cnpj,
            razaosocial,
            empresaAtual,
            number,
            userId,
          } = item;
          return {
            type,
            quantidade,
            price,
            cnpj,
            razaosocial,
            empresaAtual,
            address: zipCode
              ? {
                  ...address,
                  zipCode,
                  street,
                  number,
                  neighborhood,
                  city,
                  state,
                  complement,
                  observation,
                }
              : address,
            contractItemId,
            itemId,
            id,
            userId,
          };
        }
        return item;
      }),
      dateActivation,
      dateTermination,
      userId: this.props.login.user.id,
      priceMonthly,
      priceYearly,
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
        R.keys(response.data.errors[0].field).map((key) =>
          this.setState({
            fieldErrors: {
              ...this.state.fieldErrors,
              [key]: response.data.errors[0].field,
            },
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
      itemId: option.key,
      tipo: undefined,
      priceCostModal: undefined,
      priceSaleModal: undefined,
    });
  };

  ContentModalIncluir = () => {
    switch (this.state.progressModalItem) {
      case 0:
        return (
          <>
            <div className="div-line-modal">
              <Select
                style={{
                  width: "100%",
                }}
                size="large"
                showSearch
                placeholder="NÃO SELECIONADO"
                optionFilterProp="children"
                value={this.state.item}
                onChange={this.onChangeSelect}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                getInputElement={() => (
                  <input
                    style={{
                      textTransform: "uppercase",
                    }}
                  />
                )}
              >
                {this.state.allItens.map((value) => (
                  <Option key={value.id} value={value.name} item={value}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="div-line-modal">
              <Select
                style={{ width: "45%" }}
                size="large"
                showSearch
                placeholder="CÓDIGO"
                optionFilterProp="children"
                value={this.state.codigoModal}
                onChange={this.onChangeSelect}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.allItens.map((value) => (
                  <Option key={value.id} value={value.code} item={value}>
                    {value.code}
                  </Option>
                ))}
              </Select>
              <Select
                onChange={(value) => {
                  const { itemId, allItens } = this.state,
                    item = R.find(R.propEq("id", itemId))(allItens);
                  this.setState({
                    tipo: value,
                    priceCostModal:
                      value === "MENSAL"
                        ? item.costPriceMonthly
                        : item.costPriceYearly,
                    priceSaleModal:
                      value === "MENSAL"
                        ? item.costPriceMonthly
                        : item.costPriceYearly,
                  });
                }}
                placeholder="TIPO"
                value={this.state.tipo}
                size="large"
                style={{ width: "50%" }}
              >
                <Option value="MENSAL">MENSAL</Option>
                <Option value="ANUAL">ANUAL</Option>
              </Select>
            </div>
            <div className="div-line-modal">
              <InputNumber
                size="large"
                style={{ width: "20%" }}
                placeholder="quantidade"
                onChange={(value) => this.setState({ quantidade: value })}
                min="1"
                max="99"
                value={this.state.quantidade}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              ></InputNumber>
              <InputNumber
                disabled={!this.state.tipo}
                size="large"
                style={{ width: "35%" }}
                placeholder="venda"
                value={this.state.priceSaleModal}
                onChange={(value) => this.setState({ priceSaleModal: value })}
                step={0.01}
              />
              <InputNumber
                disabled
                size="large"
                style={{ width: "35%" }}
                placeholder="custo"
                value={this.state.priceCostModal}
                step={0.01}
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            {/* <label className="label-title-modal">Endereco</label> */}
            <div className="div-twoInfo-modal">
              <input
                className={`input-cep-modal ${
                  this.state.fieldErrors.cep && "input-error"
                }`}
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
            <div className="div-twoInfo-modal">
              <input
                className="input-cidade-modal"
                placeholder="RUA"
                onChange={this.onChange}
                name="rua"
                value={this.state.rua}
              ></input>
              <input
                className="input-uf-modal"
                placeholder="numero"
                onChange={this.onChange}
                name="number"
                value={this.state.number}
              ></input>
            </div>
            <div className="div-twoInfo-modal">
              <input
                className={`input-cidade-modal ${
                  this.state.fieldErrors.cidade && "input-error"
                }`}
                placeholder="CIDADE"
                onChange={this.onChange}
                name="cidade"
                value={this.state.cidade}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
              ></input>
              <input
                className={`input-uf-modal ${
                  this.state.fieldErrors.uf && "input-error"
                }`}
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
          </>
        );
      case 2:
        return (
          <>
            {/* <label className="label-title-modal">Empresa</label> */}
            <div className="div-twoInfo-modal" style={{ margin: "20px 0" }}>
              <div style={{ display: "flex" }}>
                <Switch
                  checked={this.state.empresaAtual}
                  onChange={(e) => this.setState({ empresaAtual: e })}
                />
                <h3 style={{ marginLeft: "10px" }}>Empresa atual</h3>
              </div>
              <input
                disabled={this.state.empresaAtual}
                className={`input-cnpj-contratos ${
                  !this.state.empresaAtual &&
                  this.state.fieldErrors.cnpjModal &&
                  "input-error"
                }`}
                placeholder="CNPJ / CPF"
                onChange={this.onChange}
                name="cnpjModal"
                value={
                  this.state.empresaAtual
                    ? this.state.cnpj
                    : this.state.cnpjModal
                }
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              ></input>
            </div>
            <input
              disabled={this.state.empresaAtual}
              className={`input-cnpj-contratos ${
                !this.state.empresaAtual &&
                this.state.fieldErrors.razaosocialModal &&
                "input-error"
              }`}
              style={{ width: "100%" }}
              placeholder="razão social"
              onChange={this.onChange}
              name="razaosocialModal"
              value={
                this.state.empresaAtual
                  ? this.state.razaosocial
                  : this.state.razaosocialModal
              }
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            ></input>
            <Select
              style={{ marginTop: "20px", width: "50%" }}
              size="large"
              placeholder="Responsável"
              onChange={(value, prop) =>
                this.setState({ username: value, userId: prop.key })
              }
              value={this.state.username}
            >
              {this.state.userList.map((user) => (
                <Option key={user.id} value={user.username}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </>
        );
      default:
        return null;
    }
  };

  FooterModalIncluir = () => {
    const {
      progressModalItem,
      itemId,
      tipo,
      quantidade,
      empresaAtual,
      razaosocialModal,
      cnpjModal,
    } = this.state;
    switch (progressModalItem) {
      case 0:
        return (
          <Button
            onClick={() =>
              this.setState({ progressModalItem: progressModalItem + 1 })
            }
            type="primary"
            disabled={!itemId || !tipo || !quantidade}
          >
            Proximo
          </Button>
        );
      case 1:
        return (
          <>
            <Button
              onClick={() =>
                this.setState({ progressModalItem: progressModalItem - 1 })
              }
            >
              Anterior
            </Button>
            <Button
              type="primary"
              onClick={() =>
                this.setState({ progressModalItem: progressModalItem + 1 })
              }
            >
              Proximo
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Button
              onClick={() =>
                this.setState({ progressModalItem: progressModalItem - 1 })
              }
            >
              Anterior
            </Button>
            <Button
              onClick={
                this.state.modalAtualizada
                  ? this.handleOkAtualizar
                  : this.handleOk
              }
              type="primary"
              disabled={!empresaAtual && !razaosocialModal && !cnpjModal}
            >
              finalizar
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  ModalIncluir = () => (
    <Modal
      width={700}
      visible={this.state.visible}
      onCancel={() => {
        const {
          tipo,
          priceMonthly,
          priceYearly,
          quantidade,
          priceSaleModal: price,
          index,
          itens,
        } = this.state;
        if (this.state.modalAtualizada) {
          this.setState({
            priceMonthly:
              tipo === "MENSAL"
                ? priceMonthly + itens[index].price * itens[index].quantidade
                : priceMonthly,
            priceYearly:
              tipo === "ANUAL"
                ? priceYearly + itens[index].price * itens[index].quantidade
                : priceYearly,
          });
        }
        this.handleCancel();
      }}
      // cancelText="Cancelar"
      footer={<this.FooterModalIncluir />}
    >
      <div style={{ margin: "20px 0" }}>
        <Steps current={this.state.progressModalItem} type="navigation">
          <Step key={"item"} title={"item"} />
          <Step key={"endereco"} title={"endereco"} />
          <Step key={"empresa"} title={"empresa"} />
        </Steps>
      </div>
      <this.ContentModalIncluir />
    </Modal>
  );

  showModal = (e) => {
    this.setState({
      visible: true,
    });
  };

  getModal = (index) => {
    const {
        id: itemId,
        contractItemId: id,
        contractItem: {
          type: tipo,
          cnpj: cnpjModal,
          razaosocial: razaosocialModal,
          costPrice,
          price: priceSaleModal,
          quantidade,
          empresaAtual,
        },
        name: item,
        code: codigoModal,
        address,
        zipCode,
        typeItem: type,
        username,
        userId,
      } = this.state.itens[index],
      { priceMonthly, priceYearly } = this.state;

    if ((id && address) || zipCode) {
      const {
        street: rua,
        number,
        neighborhood: bairro,
        zipCode: cep,
        city: cidade,
        state: uf,
        complement: complemento,
        observation: observacoes,
      } = id && !zipCode ? address : this.state.itens[index];

      this.setState({
        visible: true,
        itemId,
        item,
        codigoModal,
        rua,
        number,
        bairro,
        cep,
        cidade,
        uf,
        complemento,
        observacoes,
        modalAtualizada: true,
      });
    }

    this.setState({
      index,
      empresaAtual,
      costPrice,
      priceSaleModal,
      quantidade,
      visible: true,
      itemId,
      item,
      codigoModal,
      tipo,
      cnpjModal,
      razaosocialModal,
      modalAtualizada: true,
      progressModalItem: 0,
      type,
      username,
      userId,
      priceMonthly:
        tipo === "MENSAL"
          ? priceMonthly - priceSaleModal * quantidade
          : priceMonthly,
      priceYearly:
        tipo === "ANUAL"
          ? priceYearly - priceSaleModal * quantidade
          : priceYearly,
    });
  };

  handleOkAtualizar = () => {
    const {
      index,
      itemId,
      item: name,
      itens,
      costPrice,
      tipo: type,
      priceSaleModal: price,
      quantidade,
      rua: street,
      number,
      bairro: neighborhood,
      cep: zipCode,
      cidade: city,
      uf: state,
      complemento: complement,
      observacoes: observation,
      empresaAtual,
      cnpjModal,
      razaosocialModal,
      cnpj,
      razaosocial,
      priceMonthly,
      priceYearly,
      userId,
    } = this.state;

    const copyItens = itens;

    copyItens[index] = {
      ...copyItens[index],
      contractItem: { ...copyItens[index].contractItem, price },
      costPrice,
      street,
      number,
      neighborhood,
      zipCode,
      city,
      state,
      complement,
      observation,
      itemId,
      name,
      type,
      price,
      quantidade,
      empresaAtual,
      userId,
      cnpj: empresaAtual ? cnpj : cnpjModal,
      razaosocial: empresaAtual ? razaosocial : razaosocialModal,
    };

    if (
      itemId &&
      type &&
      ((this.state.type === "EQUIPAMENTO" && zipCode && neighborhood) ||
        (this.state.type === "SOFTWARE" &&
          ((zipCode && neighborhood) || !zipCode)))
    ) {
      this.setState({
        itens: copyItens,
        itemId: "",
        item: "NÃO SELECIONADO",
        codigoModal: "CÓDIGO",
        rua: "",
        number: "",
        bairro: "",
        cep: "",
        cidade: "",
        uf: "",
        complemento: "",
        observacoes: "",
        visible: false,
        modalAtualizada: false,
        progressModalItem: 0,
        username: undefined,
        userId: "",
        priceMonthly:
          type === "MENSAL" ? priceMonthly + price * quantidade : priceMonthly,
        priceYearly:
          type === "ANUAL" ? priceYearly + price * quantidade : priceYearly,
      });
    } else {
      message.error("Verifique se não falta nada para ser preenchido.");
    }
  };

  handleOk = () => {
    const {
      rua: street,
      number,
      bairro: neighborhood,
      cep: zipCode,
      cidade: city,
      uf: state,
      complemento: complement,
      observacoes: observation,
      tipo: type,
      cnpj,
      razaosocial,
      priceSaleModal: price,
      codigoModal: code,
      quantidade,
      empresaAtual,
      cnpjModal,
      razaosocialModal,
      itemId,
      item: name,
      itens,
      priceMonthly,
      priceYearly,
      cep,
      bairro,
      userId,
    } = this.state;

    if (
      itemId &&
      type &&
      ((this.state.type === "EQUIPAMENTO" && cep && bairro) ||
        (this.state.type === "SOFTWARE" && ((cep && bairro) || !cep)))
    ) {
      this.setState({
        itens: [
          ...itens,
          {
            code,
            name,
            itemId,
            street,
            number,
            neighborhood,
            zipCode,
            city,
            state,
            complement,
            observation,
            igpms: [],
            type,
            price,
            quantidade,
            empresaAtual,
            userId,
            cnpj: empresaAtual ? cnpj : cnpjModal,
            razaosocial: empresaAtual ? razaosocial : razaosocialModal,
          },
        ],
        priceMonthly:
          type === "MENSAL" ? priceMonthly + price * quantidade : priceMonthly,
        priceYearly:
          type === "ANUAL" ? priceYearly + price * quantidade : priceYearly,
        itemId: "",
        item: undefined,
        codigoModal: undefined,
        tipo: undefined,
        rua: "",
        numer: "",
        bairro: "",
        cep: "",
        quantidade: 1,
        cidade: "",
        uf: "",
        complemento: "",
        observacoes: "",
        visible: false,
        empresaAtual: true,
        cnpjModal: "",
        razaosocialModal: "",
        modalAtualizada: false,
        progressModalItem: 0,
        username: undefined,
        userId: "",
      });
    } else {
      message.error("Verifique se não falta nada para ser preenchido.");
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      item: undefined,
      codigoModal: undefined,
      quantidade: 1,
      tipo: undefined,
      priceSaleModal: undefined,
      rua: "",
      number: "",
      bairro: "",
      cep: "",
      cidade: "",
      uf: "",
      complemento: "",
      observacoes: "",
      contractCode: "",
      itemId: "",
      username: undefined,
      userId: "",
      modalAtualizada: false,
    });
  };

  disabledDate = (current) => {
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
        observation,
        number,
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
            observation,
            number,
          }
        : address;
    }
    return (
      <Modal
        width={700}
        visible={this.state.modalInfo}
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
                      currency: "BRL",
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

  changePages = async (pages) => {
    await this.setState(
      {
        page: pages,
      },
      () => {
        this.getContractByParams();
      }
    );
  };

  Pages = () => (
    <div className="div-pages">
      {Math.ceil(this.state.count / this.state.total) >= 5 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 1 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 4)}
        >
          {this.state.page - 4}
        </button>
      ) : null}
      {Math.ceil(this.state.count / this.state.total) >= 4 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 2 &&
      this.state.page > 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 3)}
        >
          {this.state.page - 3}
        </button>
      ) : null}
      {this.state.page >= 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 2)}
        >
          {this.state.page - 2}
        </button>
      ) : null}
      {this.state.page >= 2 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 1)}
        >
          {this.state.page - 1}
        </button>
      ) : null}
      <button className="button-paginacao-atual" type="primary">
        {this.state.page}
      </button>
      {this.state.page < this.state.count / this.state.total ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 1)}
        >
          {this.state.page + 1}
        </button>
      ) : null}
      {this.state.page + 1 < this.state.count / this.state.total ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 2)}
        >
          {this.state.page + 2}
        </button>
      ) : null}
      {this.state.page + 2 < this.state.count / this.state.total &&
      this.state.page < 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 3)}
        >
          {this.state.page + 3}
        </button>
      ) : null}
      {this.state.page + 3 < this.state.count / this.state.total &&
      this.state.page < 2 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 4)}
        >
          {this.state.page + 4}
        </button>
      ) : null}
    </div>
  );

  render() {
    const { state } = this;
    const { fieldErrors } = state;

    console.log(state);

    return (
      <div className="card-main">
        {this.renderRedirect()}
        <this.ModalIncluir />
        <this.ModalInfo />
        <div className="div-titulo">
          <h1 className="h1-titulo">Contratos</h1>
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

        <div className="div-card-contratos-1">
          <div className="div-inputs-flex">
            <div className="div-cnpj-teste">
              <label>Nº Contrato</label>
              <input
                className={`input-codigo-contratos ${
                  fieldErrors.codigo && "input-error"
                }`}
                placeholder="Nº CONTRATO"
                onChange={this.onChange}
                name="codigo"
                value={this.state.codigo}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              ></input>
            </div>
            <div className="div-cnpj-teste">
              <label>CNPJ</label>
              <Select
                // className={`input-cnpj-contratos ${
                //   fieldErrors.cnpj && "input-error"
                // }`}
                placeholder="cnpj"
                value={this.state.cnpj}
                style={{ width: "100%", margin: "0 10px 20px 0" }}
                onChange={async (id) => {
                  const { clientList } = this.state;
                  const index = R.findIndex(R.propEq("id", id))(clientList);

                  await setTimeout(function () {}, 1000);

                  this.setState({
                    clientId: clientList[index].id,
                    razaosocial: clientList[index].razaosocial,
                    cnpj: clientList[index].cnpj,
                    grupo: clientList[index].group.group,
                  });
                }}
                showSearch
                onSearch={(cnpj) => this.getAllClient(cnpj)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                size="large"
              >
                {this.state.clientList.map((client) => (
                  <Option
                    value={client.id}
                    onMouseEnter={() =>
                      this.setState({
                        razaosocial: client.razaosocial,
                        grupo: client.group.group,
                      })
                    }
                    onMouseLeave={() => {
                      if (this.state.cnpj === "")
                        this.setState({
                          razaosocial: "",
                          grupo: "",
                        });
                    }}
                  >
                    {client.cnpj}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="div-cnpj-teste">
              <label>Razão social</label>
              <input
                className={`input-nome-contratos ${
                  fieldErrors.razaosocial && "input-error"
                }`}
                style={{ textTransform: "uppercase" }}
                placeholder="RAZÃO SOCIAL / NOME"
                onChange={this.onChange}
                name="razaosocial"
                value={this.state.razaosocial}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              ></input>
            </div>
          </div>

          <div className="div-inputs-flex-contratos">
            <div className="div-cnpj-teste">
              <label>Grupo</label>
              <input
                readOnly
                className="input-grupo-contratos"
                placeholder="GRUPO"
                onChange={this.onChange}
                name="grupo"
                value={this.state.grupo}
              ></input>
            </div>
            <div className="div-cnpj-teste">
              <label>Base</label>
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
            </div>
            <div className="div-cnpj-teste">
              <label>Data ativação</label>
              <DatePicker
                size="large"
                placeholder="DATA ATIVAÇÃO"
                className="data-contratos"
                style={{ width: "100%" }}
                name="dataAtivacao"
                value={this.state.dataAtivacao}
                format="DD/MM/YYYY"
                onChange={(e) => {
                  this.setState({ dataAtivacao: e });
                }}
              />
            </div>
          </div>

          {this.state.divOculta && (
            <div>
              <div
                className="div-inputs-flex-contratos"
                style={{ marginTop: "20px" }}
              >
                <div className="div-cnpj-teste">
                  <label>Valor mensal</label>
                  <input
                    readOnly
                    className="input-valor-contratos"
                    placeholder="VALOR MENSAL"
                    value={this.state.priceMonthly.toFixed(2)}
                  ></input>
                </div>
                <div className="div-cnpj-teste">
                  <label>Valor anual</label>
                  <input
                    readOnly
                    className="input-valor-contratos"
                    placeholder="VALOR ANUAL"
                    value={this.state.priceYearly.toFixed(2)}
                  ></input>
                </div>
              </div>
              <div className="div-inputs-flex-contratos">
                <div className="div-cnpj-teste">
                  <label>Data recisão</label>
                  <DatePicker
                    size="large"
                    placeholder="DATA RESCISÃO"
                    style={{ width: "100%" }}
                    name="dataRescisao"
                    value={this.state.dataRescisao}
                    disabledDate={this.disabledDate}
                    format="DD/MM/YYYY"
                    onChange={(e) => {
                      this.setState({ dataRescisao: e });
                    }}
                  />
                </div>
                <div className="div-cnpj-teste">
                  <label>Status</label>
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
                </div>
                <div className="div-block-row">
                  <div className="div-cnpj-teste">
                    <label>Multa</label>
                    <InputNumber
                      placeholder="MULTA"
                      size="large"
                      style={{ marginRight: "5%", width: "100%" }}
                      value={this.state.fine}
                      step={0.01}
                      min={0}
                      onChange={(fine) => this.setState({ fine })}
                    />
                  </div>
                  <button
                    onClick={() =>
                      this.state.contractCode !== "" ? this.setRedirect() : null
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
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
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

        <div className="div-card-contratos-1">
          <div className="div-block-header-contractItem">
            <h2 style={{ fontFamily: "Bebas" }}>Itens</h2>
            <button
              className="button-incluir"
              onClick={this.showModal}
              disabled={!this.state.codigo}
            >
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
                        {(item.price * item.quantidade).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
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
                            ? parseFloat(item.price, 10) * item.quantidade
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
            : null}
          {this.state.itens.length !== 0 && <this.Pages />}
        </div>

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
  return bindActionCreators({ setContractCode, clearContract }, dispach);
}

function mapStateToProps(state) {
  return {
    contractValue: state.contractValue,
    login: state.login,
  };
}

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(NewContratosContainer);
