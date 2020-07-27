/* eslint-disable array-callback-return */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as R from "ramda";
import moment from "moment";
import "../../../global.css";
import "./index.css";
import { Progress } from "antd";
import { BellOutlined, MailOutlined } from "@ant-design/icons";

import { GetLogsByCode } from "../../../services/contract";
import { setContractCode } from "../../Cadastros/Contratos/ContratosRedux/action";

class HistoricoContainer extends Component {
  state = {
    logs: [],
  };

  componentDidMount = async () => {
    const query = {
      filters: {
        contract: {
          specific: {},
        },
        user: {
          specific: {
            // id: "",
          },
        },
      },
      code: this.props.contractCode,
    };
    const { status, data } = await GetLogsByCode(query);

    if (status === 200) this.setState({ logs: data.rows });
  };

  componentWillUnmount = async () => {
    await this.props.setContractCode("");
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Historico</h1>
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

        <div
          className="div-card-item"
          style={{ border: "1px solid #ccc", borderRadius: "10px" }}
        >
          <div className="history-container-main">
            <table style={{ width: "100%" }}>
              <tr>
                <th style={{ width: "15%" }}>Usuario</th>
                <th style={{ width: "15%" }}>acao</th>
                <th style={{ width: "15%" }}>data/hota</th>
                <th style={{ width: "55%" }}>Log</th>
              </tr>
              {this.state.logs.length !== 0 ? (
                this.state.logs.map((item) => {
                  switch (item.type) {
                    case "create":
                      const logCreate = JSON.parse(item.log);
                      return (
                        <tr>
                          <td>{item.user.username}</td>
                          <td>{item.type}</td>
                          <td>
                            {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                          </td>
                          <td>
                            {logCreate.client.razaosocial}
                            {logCreate.client.cnpj}
                            {logCreate.client.group.group}
                            {logCreate.client.code}
                            {logCreate.status}
                            {logCreate.type}
                            {logCreate.stockBase}
                          </td>
                        </tr>
                      );
                    case "addItem":
                      const logAddItem = JSON.parse(item.log);
                      return (
                        <tr>
                          <td>{item.user.username}</td>
                          <td>{item.type}</td>
                          <td>
                            {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                          </td>
                          <td>
                            {logAddItem.price}
                            {logAddItem.item.name}
                            {logAddItem.item.type}
                            {logAddItem.item.code}
                            {logAddItem.item.description}
                          </td>
                        </tr>
                      );
                    case "update":
                      const logUpdate = JSON.parse(item.log);
                      return (
                        <tr>
                          <td>{item.user.username}</td>
                          <td>{item.type}</td>
                          <td>
                            {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                          </td>
                          <td>
                            {R.keys(logUpdate.oldContratc).map((key) => {
                              if (R.has(key, logUpdate.newContratc)) {
                                return (
                                  <label>{logUpdate.oldContratc[key]} </label>
                                );
                              }
                            })}
                            {R.keys(logUpdate.newContratc).map((key) => {
                              if (R.has(key, logUpdate.oldContratc)) {
                                return (
                                  <label>{logUpdate.newContratc[key]} </label>
                                );
                              }
                            })}
                          </td>
                        </tr>
                      );
                    case "deletItem":
                      const logDeleteItem = JSON.parse(item.log);
                      return (
                        <tr>
                          <td>{item.user.username}</td>
                          <td>{item.type}</td>
                          <td>
                            {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                          </td>
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
                                            {itemKey}:{" "}
                                            {logDeleteItem[key][itemKey]}
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
                          <td>
                            {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                          </td>
                          <td>
                            {R.keys(logUpdateItem.oldContractItem).map(
                              (key) => {
                                return (
                                  <label>
                                    {key}: {logUpdateItem.oldContractItem[key]}{" "}
                                    ----->
                                    {logUpdateItem.newContractItem[key]}
                                  </label>
                                );
                              }
                            )}
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
                          <td>
                            {moment(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                          </td>
                          <td></td>
                          <label>
                            {logIgpm.oldPrice} -----> {logIgpm.newPrice}
                            {", "}
                            <strong>
                              {logIgpm.igpm} %, {logIgpm.item.name}{" "}
                              {logIgpm.type}
                            </strong>
                          </label>
                        </tr>
                      );
                    default:
                      return (
                        <div className="history-row">
                          <div className="history-column-username"></div>
                          <div className="history-column-action"></div>
                          <div className="history-column-date"></div>
                          <div className="history-column-log"></div>
                        </div>
                      );
                  }
                })
              ) : (
                <div className="div-noItens-contratos">NÃO HÁ NENHUM LOG</div>
              )}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractCode: state.contractCode,
  };
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ setContractCode }, dispach);
}

export default connect(mapStateToProps, mapDispacthToProps)(HistoricoContainer);
