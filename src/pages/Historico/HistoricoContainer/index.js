/* eslint-disable array-callback-return */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as R from "ramda";
import moment from "moment";
import "../../../global.css";
import "./index.css";

import { GetLogsByCode } from "../../../services/contract";
import { setContractCode } from "../../Cadastros/Contratos/ContratosRedux/action";

class HistoricoContainer extends Component {
  state = {
    logs: []
  };

  componentDidMount = async () => {
    const query = {
      filters: {
        contract: {
          specific: {
            code: this.props.contractCode
          }
        }
      }
    };
    const { status, data } = await GetLogsByCode({ query });

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
        </div>

        <div className="history-container-main">
          <div className="history-row-title">
            <div className="history-column-username">
              <strong className="title-history">Usuario</strong>
            </div>
            <div className="history-column-action">
              <strong className="title-history">Acao</strong>
            </div>
            <div className="history-column-date">
              <strong className="title-history">Data/hora</strong>
            </div>
            <div className="history-column-log">
              <strong className="title-history">Log</strong>
            </div>
          </div>
          <div className="div-separate-main">
            <div className="div-separate" />
          </div>
          {this.state.logs.length !== 0 ? (
            this.state.logs.map(item => {
              switch (item.type) {
                case "create":
                  const logCreate = JSON.parse(item.log);
                  return (
                    <div className="history-row">
                      <div className="history-column-username">
                        <label>{item.user.username} </label>
                      </div>
                      <div className="history-column-action">
                        <label>{item.type}</label>
                      </div>
                      <div className="history-column-date">
                        <label>
                          {moment(item.createdAt).format("DD/MM/YYYY, h:mm")}
                        </label>
                      </div>
                      <div className="history-column-log">
                        <label>{logCreate.client.razaosocial} </label>
                        <label>{logCreate.client.cnpj} </label>
                        <label>{logCreate.client.group} </label>
                        <label>{logCreate.client.code} </label>
                        <label>{logCreate.status} </label>
                        <label>{logCreate.type} </label>
                        <label>{logCreate.stockBase} </label>
                      </div>
                    </div>
                  );
                case "addItem":
                  const logAddItem = JSON.parse(item.log);
                  return (
                    <div className="history-row">
                      <div className="history-column-username">
                        <label>{item.user.username} </label>
                      </div>
                      <div className="history-column-action">
                        <label>{item.type}</label>
                      </div>
                      <div className="history-column-date">
                        <label>
                          {moment(item.createdAt).format("DD/MM/YYYY, h:mm")}
                        </label>
                      </div>
                      <div className="history-column-log">
                        <label>{logAddItem.price} </label>
                        <label>{logAddItem.item.name} </label>
                        <label>{logAddItem.item.type} </label>
                        <label>{logAddItem.item.code} </label>
                        <label>{logAddItem.item.description} </label>
                      </div>
                    </div>
                  );
                case "update":
                  const logUpdate = JSON.parse(item.log);
                  return (
                    <div className="history-row">
                      <div className="history-column-username">
                        <label>{item.user.username} </label>
                      </div>
                      <div className="history-column-action">
                        <label>{item.type}</label>
                      </div>
                      <div className="history-column-date">
                        {moment(item.createdAt).format("DD/MM/YYYY, h:mm")}
                      </div>
                      <div className="history-column-log">
                        {R.keys(logUpdate.oldContratc).map(key => {
                          if (R.has(key, logUpdate.newContratc)) {
                            return <label>{logUpdate.oldContratc[key]} </label>;
                          }
                        })}
                        {R.keys(logUpdate.newContratc).map(key => {
                          if (R.has(key, logUpdate.oldContratc)) {
                            return <label>{logUpdate.newContratc[key]} </label>;
                          }
                        })}
                      </div>
                    </div>
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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractCode: state.contractCode
  };
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ setContractCode }, dispach);
}

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(HistoricoContainer);
