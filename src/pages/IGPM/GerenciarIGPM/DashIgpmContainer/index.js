import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import moment from "moment";

import { GetAllContractItem } from "../../../../services/contract";
import { DeleteIGPM } from "../../../../services/igpm";

import { Spin, Button, Modal, Icon, Tooltip } from "antd";

const meses = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO"
];

class DashIgmpContainer extends Component {
  state = {
    visible: false,
    loading: false,
    nome: "",
    data: "",
    nContrato: "",
    total: 10,
    count: 0,
    page: 3,
    contractItems: [],
    igpm: {},
    itemId: ""
  };

  componentDidMount = async () => {
    await this.getAllContractItem();
  };

  getAllContractItem = async () => {
    const query = {
      filters: {
        item: {
          specific: {
            igpm: true
          }
        }
      }
    };
    GetAllContractItem(query).then(resp =>
      this.setState({ contractItems: resp.data })
    );
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  deleteIGPM = () => {
    const { itemId: id } = this.state;
    DeleteIGPM(id);
  };

  handleCancel = () => {
    this.setState({ itemId: "", visible: false });
  };

  ModalConfirmeDelete = () => {
    const { igpm, visible, itemId } = this.state;

    if (itemId === "") {
      return (
        <Modal
          title="IGPM INFO"
          visible={visible}
          onOk={this.deleteIGPM}
          onCancel={this.handleCancel}
          footer={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Tooltip placement="right" title={"deletar"}>
                <Icon
                  style={{
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    color: "red"
                  }}
                  type="delete"
                  onClick={() =>
                    this.setState({ itemId: igpm.itemId, visible: true })
                  }
                />
              </Tooltip>
              <Button type="primary" onClick={this.handleCancel}>
                OK
              </Button>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* <label>{console.log(igpm)}</label> */}
            <p>
              <strong>Tipo: </strong>
              {igpm.type}
            </p>
            <p>
              <strong>Mês: </strong>
              {meses[igpm.month - 1]}
            </p>
            <p>
              <strong>Valor: </strong>
              {igpm.value && igpm.value.toFixed(2)} %
            </p>
            <p>
              <strong>Descrição: </strong>
              {igpm.description}
            </p>
            <p>
              <strong>Data que foi aplicada: </strong>
              {moment(igpm.createdAt).format("LLLL")}
            </p>
            {/* <p>
              Clique em Ok para deletar item, atenão ao deleta-lo todos os
              contratos que foram aplicado este fator de correção serão reajustado
            </p> */}
          </div>
        </Modal>
      );
    } else {
      return (
        <Modal
          title="Confirmar exclusão"
          visible={visible}
          onOk={this.deleteIGPM}
          onCancel={this.handleCancel}
        >
          <p>
            Clique em Ok para deletar IGPM referente a {meses[igpm.month - 1]},
            atenão ao deleta-lo todos os contratos que foram aplicado este fator
            de correção serão reajustado
          </p>
        </Modal>
      );
    }
  };

  TableIgpm = () => (
    <div className="div-table">
      <div className="div-main-table">
        {this.state.contractItems.map(line => (
          <div className="div-line-table">
            {/* {console.log(line)} */}
            <label className="label-nome-igpm">
              {line.contract.client.razaosocial}
            </label>
            <label
              className="label-data-igpm cursor"
              onClick={() =>
                this.setState({
                  igpm: line.item.igpms[0],
                  visible: true
                })
              }
            >
              {line.item.name}
            </label>
            <label className="label-nContrato-igpm">{line.contract.code}</label>
            {/* <Icon
              style={{
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                color: "red"
              }}
              type="delete"
              onClick={() => this.setState({ itemId: line.id, visible: true })}
            /> */}
            {/* <Button
              onClick={() => this.setState({ itemId: line.id, visible: true })}
            ></Button> */}
          </div>
        ))}
      </div>
    </div>
  );

  Pages = () => (
    <div className="div-pages">
      {Math.ceil(this.state.count / this.state.total) >= 5 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 1 ? (
        <button
          className="button-salvar"
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
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 3)}
        >
          {this.state.page - 3}
        </button>
      ) : null}
      {this.state.page >= 3 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 2)}
        >
          {this.state.page - 2}
        </button>
      ) : null}
      {this.state.page >= 2 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 1)}
        >
          {this.state.page - 1}
        </button>
      ) : null}
      <div className="div-teste">{this.state.page}</div>
      {this.state.page < this.state.count / this.state.total ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 1)}
        >
          {this.state.page + 1}
        </button>
      ) : null}
      {this.state.page + 1 < this.state.count / this.state.total ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 2)}
        >
          {this.state.page + 2}
        </button>
      ) : null}
      {this.state.page + 2 < this.state.count / this.state.total &&
      this.state.page < 3 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 3)}
        >
          {this.state.page + 3}
        </button>
      ) : null}
      {this.state.page + 3 < this.state.count / this.state.total &&
      this.state.page < 2 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 4)}
        >
          {this.state.page + 4}
        </button>
      ) : null}
    </div>
  );

  render() {
    console.log(this.state);
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Gerenciar igpm</h1>
        </div>
        <div className="div-inputs-flex">
          <input
            className="input-nome-igpm"
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={this.onChange}
            name="nome"
            value={this.state.nome}
          ></input>
          <input
            className="input-data-igpm"
            placeholder="DATA"
            onChange={this.onChange}
            name="data"
            value={this.state.data}
          ></input>
          <input
            className="input-nContato-igpm"
            placeholder="Nº CONTRATO"
            onChange={this.onChange}
            name="nContrato"
            value={this.state.nContrato}
          ></input>
        </div>

        {this.state.loading ? (
          <div className="div-spin">
            <Spin />
          </div>
        ) : (
          <this.TableIgpm />
        )}
        <div className="div-main-pages">
          <this.Pages />
        </div>
        <this.ModalConfirmeDelete />
      </div>
    );
  }
}

export default DashIgmpContainer;
