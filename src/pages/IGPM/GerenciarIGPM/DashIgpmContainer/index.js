import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import moment from "moment";
import { connect } from "react-redux";
import { Howl, Howler } from "howler";

import { GetAllIgpm } from "../../../../services/igpm";
// import { GetAllContractItem } from "../../../../services/contract";
import { DeleteIGPM } from "../../../../services/igpm";

import { Spin, Button, Modal, Icon, Tooltip } from "antd";

import ha from "./sound.mp3";

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
    page: 1,
    contractItems: [],
    igpm: {},
    itemId: ""
  };

  soundPlay = () => {
    const sound = new Howl({
      src: ha,
      html5: true,
      sprite: {
        laser: [15100, 1500]
      }
    });

    sound.play("laser");
    // setTimeout(function() {
    // sound.play("laser");
    // }, 3000);
  };

  componentDidMount = async () => {
    await this.getAllIgpm();
  };

  getAllIgpm = async () => {
    const query = {
      // filters: {
      //   item: {
      //     specific: {
      //       igpm: true
      //     }
      //   }
      // }
    };
    GetAllIgpm(query).then(resp => {
      console.log(resp);
      this.setState({ contractItems: resp.data });
    });
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
          width={700}
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
            <p>
              <strong>TIPO: </strong>
              {igpm.type}
            </p>
            <p>
              <strong>MÊS: </strong>
              {meses[igpm.month - 1]}
            </p>
            <p>
              <strong>VALOR: </strong>
              {igpm.value && igpm.value.toFixed(2)} %
            </p>
            <p>
              <strong>DESCRIÇÃO: </strong>
              {igpm.description}
            </p>
            <p>
              <strong>DDATA QUE FOI APLICADA: </strong>
              {moment(igpm.createdAt).format("LLLL")}
            </p>
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
            CLIQUE EM <strong>"OK"</strong> PARA DELETAR O IGPM REFERENTE AO MẼS
            DE <strong>{meses[igpm.month - 1]}</strong> SOB ANO VIGENTE{" "}
            <strong>{igpm.year}</strong> APLICADO EM CONTRATOS DO TIPO{" "}
            <strong>{igpm.type}</strong>, ATENSÃO AO DELETA-LO TODOS OS
            CONTRATOS QUE FORAM APLICAODO ESTE FATOR DE CORREÇÃO SERÃO
            REAJUSTAODS
          </p>
        </Modal>
      );
    }
  };

  TableIgpm = () => (
    <div className="div-table">
      {this.state.contractItems.length !== 0 ? (
        <div className="div-main-table">
          {this.state.contractItems.map(line => (
            <div className="div-line-table">
              {console.log(line)}
              <label className="label-nome-igpm">{line.razaosocial}</label>
              <label
                className={`label-data-igpm ${this.props.login.user.troll &&
                  "cursor"}`}
                // onClick={() =>
                //   this.setState({
                //     igpm: line.item.igpms[0],
                //     visible: true
                //   })
                // }
                onMouseEnter={
                  // null
                  () => this.soundPlay()
                  // this.props.login.user.troll ? () => this.soundPlay() : null
                }
              >
                {`${line.type} ${line.month}/${line.year}`}
              </label>
              <label className="label-nContrato-igpm">
                {line.contractCode}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="div-main-table">
          <h3 style={{ fontFamily: "Bebas", fontSize: "20px" }}>
            * NADA FOI ENCONTRADO *
          </h3>
        </div>
      )}
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
    console.log(this.state.contractItems);
    Howler.volume(1);
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

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

export default connect(mapStateToProps)(DashIgmpContainer);
