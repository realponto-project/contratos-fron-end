import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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

    // console.log(data);

    if (status === 200) this.setState({ logs: data.rows });
  };

  componentWillUnmount = async () => {
    await this.props.setContractCode("");
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 className="h1-titulo">Historico</h1>

            {this.state.logs.map(item => {
              // console.log(item.log);
              console.log(JSON.parse(item.log));
              switch (item.type) {
                case "create":
                  const { status, type, stockBase } = JSON.parse(item.log);
                  // console.log(JSON.parse(item.log).);
                  return (
                    <div>
                      <label>{status} </label>
                      <label>{type} </label>
                      <label>{stockBase}</label>
                    </div>
                  );
                default:
                  return <h5>type</h5>;
              }
            })}
          </div>
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

export default connect(mapStateToProps, mapDispacthToProps)(HistoricoContainer);
