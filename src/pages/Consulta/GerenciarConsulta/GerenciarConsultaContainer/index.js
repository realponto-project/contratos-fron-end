import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { masks } from "./validator";
import {
  GetAllContract,
  GetAllContractItem,
  GetLogsByCode,
} from "../../../../services/contract";
import { Select, Spin, Progress, Button, Modal, Tabs, Input } from "antd";
import moment from "moment";
import {
  BellOutlined,
  MailOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import * as R from "ramda";

const { Option } = Select,
  { TabPane } = Tabs;

class GerenciarConsultaContainer extends Component {
  state = {
    avancado: false,
    visible: false,
    loading: false,
    modalStatus: "Dados",
    modalConsulta: false,
    nome: "",
    cnpj: "",
    grupo: "",
    codigo: "",
    itemName: undefined,
    contractCode: "",
    status: "TODOS",
    total: 10,
    count: 0,
    page: 1,
    contracts: [],
    index: -1,
    contractItems: [],
    logs: [],
  };

  componentDidMount = async () => {
    await this.getAllContract();
  };

  openModalConsulta = () => {
    this.setState({
      modalConsulta: true,
    });
  };

  getLogsByCode = async () => {
    const query = {
      filters: {
        contract: {
          specific: {},
        },
      },
      code: this.state.contractCode,
    };
    const { status, data } = await GetLogsByCode(query);

    if (status === 200) this.setState({ logs: data.rows });
  };

  getAllContractItem = async () => {
    const { contractCode, itemName } = this.state,
      query = {
        filters: {
          item: {
            specific: {
              name: itemName,
            },
          },
        },
        contractCode,
        page: this.state.page,
        total: null,
      };

    const { status, data } = await GetAllContractItem(query);

    if (status === 200) await this.setState({ contractItems: data });
  };

  getAllContract = async () => {
    this.setState({
      loading: true,
    });

    const query = {
      filters: {
        client: {
          specific: {
            razaosocial: this.state.nome,
            cnpj: this.state.cnpj.replace(/\D/gi, ""),
          },
        },
        contract: {
          specific: {
            status: this.state.status !== "TODOS" && this.state.status,
            // type: null,
            code: this.state.codigo,
          },
        },
      },
      page: this.state.page,
      total: this.state.total,
    };
    const contracts = await GetAllContract(query);

    this.setState({
      contracts: contracts.data.rows,
      page: contracts.data.page,
      count: contracts.data.count,
      show: contracts.data.show,
      loading: false,
    });
  };

  onChange = async (e) => {
    const { name, value } = masks(e.target.name, e.target.value);
    await this.setState({
      [name]: value,
    });
    await this.getAllContract();
  };

  changePages = async (pages) => {
    await this.setState(
      {
        page: pages,
      },
      () => {
        this.getAllContract();
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

  ContentLog = () => {
    console.log(this.state.logs);

    return (
      <>
        {this.state.logs.map((item) => {
          switch (item.type) {
            case "create":
              const logCreate = JSON.parse(item.log),
                { status, stockBase, client } = logCreate,
                { razaosocial, cnpj, group, code } = client;
              return (
                <tr>
                  <td>
                    <label>{item.user.username} </label>
                  </td>
                  <td>
                    <label>{item.type}</label>
                  </td>
                  <td>
                    <label>
                      {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                    </label>
                  </td>
                  <td>
                    <label>{razaosocial} </label>
                    <label>{cnpj} </label>
                    <label>{group} </label>
                    <label>{code} </label>
                    <label>{status} </label>
                    <label>{stockBase} </label>
                  </td>
                </tr>
              );
            case "addItem":
              const logAddItem = JSON.parse(item.log);
              return (
                <tr>
                  <td>
                    <label>{item.user.username} </label>
                  </td>
                  <td>
                    <label>{item.type}</label>
                  </td>
                  <td>
                    <label>
                      {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                    </label>
                  </td>
                  <td>
                    <label>{logAddItem.price} </label>
                    <label>{logAddItem.item.name} </label>
                    <label>{logAddItem.item.type} </label>
                    <label>{logAddItem.item.code} </label>
                    <label>{logAddItem.item.description} </label>
                  </td>
                </tr>
              );
            case "update":
              const logUpdate = JSON.parse(item.log);
              return (
                <tr>
                  <td>
                    <label>{item.user.username} </label>
                  </td>
                  <td>
                    <label>{item.type}</label>
                  </td>
                  <td>{moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}</td>
                  <td>
                    {R.keys(logUpdate.oldContratc).map((key) => {
                      if (R.has(key, logUpdate.newContratc)) {
                        return <label>{logUpdate.oldContratc[key]} </label>;
                      }
                    })}
                    {R.keys(logUpdate.newContratc).map((key) => {
                      if (R.has(key, logUpdate.oldContratc)) {
                        return <label>{logUpdate.newContratc[key]} </label>;
                      }
                    })}
                  </td>
                </tr>
              );
            case "deletItem":
              const logDeleteItem = JSON.parse(item.log);
              return (
                <tr>
                  <td>
                    <label>{item.user.username} </label>
                  </td>
                  <td>
                    <label>{item.type}</label>
                  </td>
                  <td>{moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}</td>
                  <td>
                    {R.keys(
                      R.omit(
                        ["id", "updatedAt", "itemId", "addressId"],
                        logDeleteItem
                      )
                    ).map((key) => {
                      if (typeof logDeleteItem[key] === "string")
                        return (
                          <label>
                            {key}: {logDeleteItem[key]}
                          </label>
                        );
                      else if (typeof logDeleteItem[key] === "object") {
                        return (
                          <>
                            {R.keys(logDeleteItem[key])
                              .filter(
                                (filterKey) =>
                                  filterKey !== "id" &&
                                  filterKey.indexOf("At") === -1 &&
                                  filterKey.indexOf("Id") === -1
                              )
                              .map((itemKey) => {
                                return (
                                  <label>
                                    {itemKey}: {logDeleteItem[key][itemKey]}
                                  </label>
                                );
                              })}
                          </>
                        );
                      }
                    })}
                  </td>
                </tr>
              );
            case "updateItem":
              const logUpdateItem = JSON.parse(item.log);
              return (
                <tr>
                  <td>
                    <label>{item.user.username} </label>
                  </td>
                  <td>
                    <label>{item.type}</label>
                  </td>
                  <td>{moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}</td>
                  <td>
                    {R.keys(logUpdateItem.oldContractItem).map((key) => {
                      return (
                        <label>
                          {key}: {logUpdateItem.oldContractItem[key]} ----->
                          {logUpdateItem.newContractItem[key]}
                        </label>
                      );
                    })}
                    <strong>
                      {logUpdateItem.item.name} {logUpdateItem.type}
                    </strong>
                  </td>
                </tr>
              );
            case "igpm":
              const logIgpm = JSON.parse(item.log);
              return (
                <tr>
                  <td>
                    <label>{item.user.username} </label>
                  </td>
                  <td>
                    <label>{item.type}</label>
                  </td>
                  <td>{moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}</td>
                  <td>
                    <label>
                      {logIgpm.oldPrice} -----> {logIgpm.newPrice}
                      {", "}
                      <strong>
                        {logIgpm.igpm} %, {logIgpm.item.name} {logIgpm.type}
                      </strong>
                    </label>
                  </td>
                </tr>
              );
            default:
              return (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              );
          }
        })}
      </>
    );
  };

  ModalInfo = () => {
    const { index, contracts } = this.state,
      contract = contracts[index];

    return (
      <Modal
        visible={this.state.visible}
        onOk={this.handleOk}
        width={800}
        onCancel={() =>
          this.setState({
            visible: false,
            contractCode: "",
            itemName: undefined,
          })
        }
      >
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Dados do contrato" key={1}>
            {index > -1 ? (
              <div className="div-main-contentModal">
                <div className="div-row-contentModal">
                  <div
                    className="div-block-contentModal"
                    style={{ width: "45%" }}
                  >
                    <label>data Ativação:</label>
                    {moment(contract.dateActivation).format("LL")}
                  </div>
                  <div
                    className="div-block-contentModal"
                    style={{ width: "45%" }}
                  >
                    <label>Nº Contrato:</label>
                    {contract.code}
                  </div>
                </div>
                <div className="div-row-contentModal">
                  <div
                    className="div-block-contentModal"
                    style={{ width: "100%" }}
                  >
                    <label>ENDEREÇO:</label>
                    {`${contract.client.address.street}, ${contract.client.address.number}, ${contract.client.address.complement} - ${contract.client.address.zipCode}. ${contract.client.address.city}/${contract.client.address.state}. CEP: ${contract.client.address.zipCode}`}
                  </div>
                </div>
                <div className="div-row-contentModal">
                  <div
                    className="div-block-contentModal"
                    style={{ width: "100%" }}
                  >
                    <label>CONTATO:</label>
                    {`${contract.client.contact.name}, tel: ${contract.client.contact.telphone}, cel: ${contract.client.contact.celular}, ${contract.client.contact.email}`}
                  </div>
                </div>
                <div className="div-row-contentModal">
                  <div
                    className="div-block-contentModal"
                    style={{ width: "100%" }}
                  >
                    <label>OBSERVAÇÃO:</label>
                  </div>
                </div>
              </div>
            ) : null}
          </TabPane>
          <TabPane tab="itens" key={2}>
            {index > -1 ? (
              <div className="div-main-contentModal">
                <Input
                  value={this.state.itemName}
                  placeholder="Buscar"
                  style={{ width: "calc(100% - 4px)" }}
                  onChange={async (e) => {
                    await this.setState({ itemName: e.target.value });
                    await this.getAllContractItem();
                  }}
                />
                {this.state.contractItems.map((contractItem) => (
                  <div className="div-card-iten-contentModal">
                    <div className="div-row-contentModal">
                      <strong>{contractItem.item.name}</strong>
                      <p>
                        adicionado em{" "}
                        {moment(contractItem.createdAt).format("LL")}
                      </p>
                    </div>
                    <p>
                      {contractItem.razaosocial} -{" "}
                      {contractItem.cnpj.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
                        "$1.$2.$3/$4-$5"
                      )}
                    </p>
                    {contractItem.address && (
                      <p>
                        {`${contractItem.address.street}, ${contractItem.address.number}, ${contractItem.address.complement} - ${contractItem.address.zipCode}. ${contractItem.address.city}/${contractItem.address.state}. CEP: ${contractItem.address.zipCode}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </TabPane>
          <TabPane tab="historico" key={3}>
            <div className="div-main-contentModal">
              <table>
                <tr>
                  <th style={{ width: "15%" }}>Responsável</th>
                  <th style={{ width: "15%" }}>Ação</th>
                  <th style={{ width: "15%" }}>data</th>
                  <th style={{ width: "55%" }}>Log</th>
                </tr>
                <this.ContentLog />
              </table>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    );
  };
  TableConsulta = () => (
    <div className="div-table">
      <div className="div-main-table">
        <table>
          <tr>
            <th style={{ width: "15%" }}>Nº Contrato</th>
            <th style={{ width: "45%" }}>razão</th>
            <th style={{ width: "15%" }}>cnpj</th>
            <th style={{ width: "15%" }}>status</th>
            <th style={{ width: "10%" }}>açao</th>
          </tr>

          {this.state.contracts.length !== 0 ? (
            this.state.contracts.map((line, index) => (
              <tr>
                <td style={line.dateTermination ? { color: "red" } : null}>
                  {line.code}
                </td>
                <td style={line.dateTermination ? { color: "red" } : null}>
                  {line.client.razaosocial}
                </td>
                <td style={line.dateTermination ? { color: "red" } : null}>
                  {line.client.cnpj.length === 12
                    ? line.client.cnpj.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})/,
                        "$1.$2.$3/$4"
                      )
                    : line.client.cnpj.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
                        "$1.$2.$3/$4-$5"
                      )}
                </td>
                <td style={line.dateTermination ? { color: "red" } : null}>
                  {line.status}
                </td>
                <td>
                  <InfoCircleOutlined
                    className="icon-info"
                    onClick={async () => {
                      await this.setState({
                        visible: true,
                        index: index,
                        contractCode: line.code,
                      });

                      await this.getAllContractItem();
                      await this.getLogsByCode();
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <div className="div-noItens-consulta">
              *** NENHUM CONTRATO ENCONTRADO ***
            </div>
          )}
        </table>
      </div>
    </div>
  );

  render() {
    const { state, onChange } = this;
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Consulta</h1>
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
        <div className="div-table-gerenciar">
          <div className="div-block-search-gerClient">
            <Button
              onClick={() => this.setState({ avancado: !this.state.avancado })}
            >
              {this.state.avancado ? "Ocultar" : "Avançar"}
            </Button>
            {this.state.avancado && (
              <div className="div-inputs-flex">
                <input
                  className="input-codigo-consulta"
                  placeholder="CÓDIGO"
                  onChange={onChange}
                  name="codigo"
                  value={state.codigo}
                ></input>
                <input
                  className="input-nome-consulta"
                  placeholder="RAZÃO SOCIAL / NOME"
                  onChange={onChange}
                  name="nome"
                  value={state.nome}
                ></input>
                <input
                  className="input-cnpj-consulta"
                  placeholder="CNPJ / CPF"
                  onChange={onChange}
                  name="cnpj"
                  value={state.cnpj}
                ></input>

                <Select
                  style={{ width: "15%" }}
                  size="large"
                  placeholder="Status"
                  name="status"
                  value={state.status}
                  onChange={(value) =>
                    this.setState({ status: value }, () =>
                      this.getAllContract()
                    )
                  }
                >
                  {["ATIVO", "DEBITO", "CANCELADO", "TODOS"].map((item) => (
                    <Option value={item}>{item}</Option>
                  ))}
                </Select>
              </div>
            )}
          </div>
          {this.state.loading ? (
            <div className="div-spin">
              <Spin />
            </div>
          ) : (
            <this.TableConsulta />
          )}
          <div className="div-main-pages">
            <this.Pages />
          </div>
        </div>
        <this.ModalInfo />
      </div>
    );
  }
}

export default GerenciarConsultaContainer;
