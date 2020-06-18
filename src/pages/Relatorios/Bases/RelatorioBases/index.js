import React, { Component } from "react";
import "./index.css";
import "../../../../global.css";
import { RelatorioBasesService } from "../../../../services/grafic";

class RelatorioBases extends Component {
  state = {
    rows: [],
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
          this.state.rows.map((row) => (
            <div className="div-line-table">
              <label style={{ width: "40%" }}>{row.base}</label>
              <label style={{ width: "10%" }}>{row.quant}</label>
              <label style={{ width: "30%" }}>{row.status}</label>
              <label style={{ width: "20%" }}>
                {row.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
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
        <div
          className="div-titulo"
          // style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h1 className="h1-titulo">Bases</h1>
        </div>

        <this.Table />
      </div>
    );
  }
}

export default RelatorioBases;
