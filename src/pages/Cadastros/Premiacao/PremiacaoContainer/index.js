import React, { Component } from "react";
import "./index.css";
import { Modal, Input } from "antd";

class PremiacaoContainer extends Component {
  state = {
    modalVisible: false,
    nomeModal: "",
    dataModal: ""
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  openModal = e => {
    this.setState({
      modalVisible: true
    });
  };

  handleOk = e => {
    this.setState({
      modalVisible: false
    });
  };

  Modal = () => {
    return (
      <Modal
        visible={this.state.modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleOk}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <div className="div-block-input-premio" style={{ marginTop: "0" }}>
          <label>Nome</label>
          <Input
            name="nomeModal"
            value={this.state.nomeModal}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
        </div>
        <div className="div-block-input-premio" style={{ marginTop: "0" }}>
          <label>Data</label>
          <Input
            name="dataModal"
            value={this.state.dataModal}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
        </div>
      </Modal>
    );
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-card-item">
          <div className="div-titulo-usuario">
            <h1 className="h1-titulo" style={{ margin: "0" }}>
              Premiacao
            </h1>

            <div className="div-p-premiacao">
              <p
                style={{ fontSize: "30px", margin: "0", cursor: "pointer" }}
                onClick={this.openModal}
              >
                +
              </p>
              <this.Modal />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PremiacaoContainer;
