import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { Select } from "antd";

const { Option } = Select;

class NewIgpmContainer extends Component {
  state = {
    select: "NÃO SELECIONADO",
    mesAplicacao: "",
    valorIgpm: "",
    anoVigente: "",
    descricao: ""
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

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Adicionar igpm</h1>
        </div>

        <div className="div-line-igpm">
          <Select
            defaultValue={this.state.select}
            className="select-igpm"
            size="large"
            onChange={this.onChangeSelect}
          >
            <Option value="ANUAL">ANUAL</Option>
            <Option value="MENSAL">MENSAL</Option>
          </Select>
          <input
            className="input-igpm"
            placeholder="MÊS APLICAÇÃO"
            value={this.state.mesAplicacao}
            name="mesAplicacao"
            onChange={this.onChange}
          ></input>
          <input
            className="input-igpm"
            placeholder="VALOR IGPM"
            value={this.state.valorIgpm}
            name="valorIgpm"
            onChange={this.onChange}
          ></input>
          <input
            className="input-igpm-direita"
            placeholder="ANO VIGENTE"
            value={this.state.anoVigente}
            name="anoVigente"
            onChange={this.onChange}
          ></input>
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
          <button className="button-salvar">Aplicar</button>
          <button className="button-excluir">Excluir</button>
        </div>
      </div>
    );
  }
}

export default NewIgpmContainer;
