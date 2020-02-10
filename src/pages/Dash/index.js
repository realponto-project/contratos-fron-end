import React, { Component } from "react";
import { Progress } from "antd";

import "./index.css";

class DashPage extends Component {
  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Graficos</h1>
        </div>
        <div className="div-graficos">
          <div className="div-barras-graficos">
            <Progress percent={30} />
            <Progress percent={50} status="active" />
            <Progress percent={70} status="exception" />{" "}
            <Progress percent={100} />
            <Progress percent={50} showInfo={false} />
          </div>
        </div>
      </div>
    );
  }
}

export default DashPage;
