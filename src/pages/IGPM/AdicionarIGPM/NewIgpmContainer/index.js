/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { Select, InputNumber, message } from "antd";

import { NewIGPM } from "../../../../services/igpm";
import moment from "moment";

const { Option } = Select;
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

class NewIgpmContainer extends Component {
  state = {
    select: undefined,
    mesAplicacao: undefined,
    valorIgpm: 0,
    anoVigente: parseInt(moment().format("YYYY")),
    descricao: ""
  };

  clearState = () => {
    this.setState({
      select: undefined,
      mesAplicacao: undefined,
      valorIgpm: 0,
      anoVigente: parseInt(moment().format("YYYY")),
      descricao: ""
    });
  };

  newIGPM = async () => {
    const {
      select: type,
      mesAplicacao: month,
      valorIgpm: value,
      descricao: description,
      anoVigente: year
    } = this.state;

    const { status, data } = await NewIGPM({
      type,
      month,
      value,
      description,
      year
    });

    if (status === 200) {
      this.clearState();
      message.success("IGPM aplicado com sucesso");
    } else {
      message.error("Erro ao aplicar IGPM");
    }
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onChangeSelect = value => {
    this.setState({
      select: value
    });
  };

  onChangeMes = value => {
    this.setState({
      mesAplicacao: value
    });
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Adicionar igpm</h1>
        </div>

        <div className="div-line-igpm">
          <Select
            value={this.state.select}
            placeholder="NÃO SELECIONADO"
            className="select-igpm"
            size="large"
            onChange={this.onChangeSelect}
          >
            <Option value="ANUAL">ANUAL</Option>
            <Option value="MENSAL">MENSAL</Option>
          </Select>

          <Select
            placeholder="MÊS APLICAÇÃO"
            value={this.state.mesAplicacao}
            className="select-mes-igpm"
            size="large"
            onChange={this.onChangeMes}
          >
            {meses.map((mes, index) => (
              <Option value={index + 1}>{mes}</Option>
            ))}
          </Select>

          <InputNumber
            className="porcentagem-igpm"
            size="large"
            value={this.state.valorIgpm}
            min={0}
            max={100}
            step={0.5}
            formatter={value => `${value}%`}
            parser={value => value.replace("%", "")}
            onChange={value => this.setState({ valorIgpm: value })}
          />

          <InputNumber
            className="input-igpm-direita"
            size="large"
            value={this.state.anoVigente}
            min={2000}
            onChange={value => this.setState({ anoVigente: value })}
          />
        </div>
        <div className="div-line-0-igpm">
          <textarea
            className="textArea-igpm"
            placeholder="DESCRIÇÃO"
            value={this.state.descricao}
            name="descricao"
            onChange={this.onChange}
            rows="4"
          ></textarea>
        </div>
        <div className="div-buttons-usuario">
          <button className="button-excluir-cliente">Excluir</button>
          <button className="button-salvar-cliente" onClick={this.newIGPM}>
            Aplicar
          </button>
        </div>
      </div>
    );
  }
}

export default NewIgpmContainer;
