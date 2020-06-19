import React, { Component } from "react";
import "./index.css";
import "../../../../global.css";
import { RelatorioBasesService } from "../../../../services/grafic";

import { Progress } from "antd";

import { MailOutlined, BellOutlined } from "@ant-design/icons";

class RelatorioBases extends Component {
  state = {
    rows: []
  };

  componentDidMount = async () => {
    const { data } = await RelatorioBasesService();

    await this.setState({ rows: data });
  };

  Table = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <strong style={{ width: "40%" }}>Bases</strong>
          <strong style={{ width: "10%" }}>Qtd</strong>
          <strong style={{ width: "30%" }}>Tipo</strong>
          <strong style={{ width: "20%" }}>PREÇO</strong>
        </div>
        {this.state.rows &&
          this.state.rows.map(row => (
            <div className="div-line-table">
              <label style={{ width: "40%" }}>{row.base}</label>
              <label style={{ width: "10%" }}>{row.quant}</label>
              <label style={{ width: "30%" }}>{row.status}</label>
              <label style={{ width: "20%" }}>
                {row.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </label>
            </div>
          ))}
      </div>
    </div>
  );

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Bases</h1>
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

        <this.Table />
      </div>
    );
  }
}

export default RelatorioBases;
