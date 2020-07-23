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
  CloseCircleTwoTone,
  CheckCircleTwoTone,
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
    return (
      <>
        {this.state.logs.map((item) => {
          switch (item.type) {
            case "create":
              const logCreate = JSON.parse(item.log);
              return (
                <div className="div-card-iten-contentModal">
                  <div className="div-row-contentModal">
                    <p>
                      Criado por <strong>{item.user.username}</strong> no dia{" "}
                      {moment(item.createdAt).format("DD/MM/YYYY, [às] HH:mm")}
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    <p>
                      {logCreate.client.razaosocial} -{" "}
                      {logCreate.client.cnpj.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
                        "$1.$2.$3/$4-$5"
                      )}{" "}
                      ({logCreate.client.group.group})
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    <p>
                      <strong>Base de estoque:</strong> {logCreate.stockBase}
                    </p>
                    <p>
                      <strong>status:</strong> {logCreate.status}
                    </p>
                    <p>
                      <strong>multa:</strong>{" "}
                      {logCreate.fine.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    <p>
                      <strong>data de Ativação:</strong>{" "}
                      {moment(logCreate.dateActivation).format()}
                    </p>
                    <p>
                      <strong>data de rescisão:</strong>{" "}
                      {moment(logCreate.dateTermination).format()}
                    </p>
                  </div>
                </div>
              );
            case "addItem":
            case "deletItem":
              const logAddItemOrDeletItem = JSON.parse(item.log);
              return (
                <div className="div-card-iten-contentModal">
                  <div className="div-row-contentModal">
                    <p>
                      Item {item.type === "deletItem" ? "removido" : null}
                      {item.type === "addItem" ? "adicionado" : null} por{" "}
                      <strong>{item.user.username}</strong> no dia{" "}
                      {moment(item.createdAt).format("DD/MM/YYYY, [às] HH:mm")}
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    <p>
                      {logAddItemOrDeletItem.quantidade}x{" "}
                      {logAddItemOrDeletItem.item.name} (
                      {logAddItemOrDeletItem.type}) -{" "}
                      {logAddItemOrDeletItem.item.type}{" "}
                    </p>
                    <p>
                      <strong>Preço venda: </strong>
                      {logAddItemOrDeletItem.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p>
                      <strong>Preço custo: </strong>
                      {logAddItemOrDeletItem.costPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    {logAddItemOrDeletItem.address && (
                      <p>
                        <strong>Endereço: </strong>
                        {`${logAddItemOrDeletItem.address.street}, ${logAddItemOrDeletItem.address.number}, ${logAddItemOrDeletItem.address.complement} - ${logAddItemOrDeletItem.address.zipCode}. ${logAddItemOrDeletItem.address.city}/${logAddItemOrDeletItem.address.state}. CEP: ${logAddItemOrDeletItem.address.zipCode}`}
                      </p>
                    )}
                  </div>
                  <div className="div-row-contentModal">
                    <p>
                      {logAddItemOrDeletItem.razaosocial} -{" "}
                      {logAddItemOrDeletItem.cnpj.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
                        "$1.$2.$3/$4-$5"
                      )}
                    </p>
                    <p>
                      empresa atual:{" "}
                      {logAddItemOrDeletItem.empresaAtual ? (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      ) : (
                        <CloseCircleTwoTone twoToneColor="#f71818" />
                      )}
                    </p>
                  </div>
                </div>
              );

            case "update":
              const logUpdate = JSON.parse(item.log);
              return (
                <div className="div-card-iten-contentModal">
                  <div className="div-row-contentModal">
                    <p>
                      Contrato atualizado por{" "}
                      <strong>{item.user.username}</strong> no dia{" "}
                      {moment(item.createdAt).format("DD/MM/YYYY, [às] HH:mm")}
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    <table style={{ width: "100%" }}>
                      <tr>
                        <th style={{ width: "33%" }}>Coluna</th>
                        <th style={{ width: "33%" }}>de</th>
                        <th style={{ width: "33%" }}>para</th>
                      </tr>
                      {R.keys(logUpdate.oldContratc).map((key) => (
                        <tr>
                          <td>{key}</td>
                          <td>{logUpdate.oldContratc[key]}</td>
                          <td>{logUpdate.newContratc[key]}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              );
            case "updateItem":
              const logUpdateItem = JSON.parse(item.log);

              console.log(logUpdateItem);
              return (
                <div className="div-card-iten-contentModal">
                  <div className="div-row-contentModal">
                    <p>
                      Item atualizado por <strong>{item.user.username}</strong>{" "}
                      no dia{" "}
                      {moment(item.createdAt).format("DD/MM/YYYY, [às] HH:mm")}
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    <table style={{ width: "100%" }}>
                      <tr>
                        <th style={{ width: "33%" }}>Coluna</th>
                        <th style={{ width: "33%" }}>de</th>
                        <th style={{ width: "33%" }}>para</th>
                      </tr>
                      {R.keys(logUpdateItem.oldContractItem).map((key) => (
                        <tr>
                          <td>{key}</td>
                          <td>
                            {typeof logUpdateItem.oldContractItem[key] ===
                            "boolean" ? (
                              <>
                                {logUpdateItem.oldContractItem[key] ? (
                                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                                ) : (
                                  <CloseCircleTwoTone twoToneColor="#f71818" />
                                )}
                              </>
                            ) : (
                              logUpdateItem.oldContractItem[key]
                            )}
                          </td>
                          <td>
                            {typeof logUpdateItem.newContractItem[key] ===
                            "boolean" ? (
                              <>
                                {logUpdateItem.newContractItem[key] ? (
                                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                                ) : (
                                  <CloseCircleTwoTone twoToneColor="#f71818" />
                                )}
                              </>
                            ) : (
                              logUpdateItem.newContractItem[key]
                            )}
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              );
            case "igpm":
              const logIgpm = JSON.parse(item.log);
              return (
                <div className="div-card-iten-contentModal">
                  <div className="div-row-contentModal">
                    <p>
                      Igpm aplicado no dia{" "}
                      {moment(item.createdAt).format("DD/MM/YYYY, [às] HH:mm")}
                    </p>
                  </div>
                  <div className="div-row-contentModal">
                    <table style={{ width: "100%" }}>
                      <tr>
                        <th style={{ width: "40%" }}>item</th>
                        <th style={{ width: "20%" }}>valor</th>
                        <th style={{ width: "15%" }}>igpm (%)</th>
                        <th style={{ width: "20%" }}>valor corrigido</th>
                      </tr>
                      <tr>
                        <td>
                          {logIgpm.item.name} ({logIgpm.type})
                        </td>
                        <td>
                          {(
                            logIgpm.quantidade * logIgpm.oldPrice
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td>{logIgpm.igpm}</td>
                        <td>
                          {(
                            logIgpm.quantidade * logIgpm.newPrice
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              );
            default:
              return null;
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
            <div
              className="div-main-contentModal"
              style={{ overflow: "auto", maxHeight: "400px" }}
            >
              <this.ContentLog />
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
