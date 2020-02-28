import React, { Component } from "react";
import "../../../../global.css";
import "./index.css";
import { masks } from "./validator";
import { GetAllContract } from "../../../../services/contract";
import { Select, Spin } from "antd";

const { Option } = Select;

class GerenciarConsultaContainer extends Component {
  state = {
    loading: false,
    nome: "",
    cnpj: "",
    grupo: "",
    codigo: "",
    tipo: "TODOS",
    total: 10,
    count: 0,
    page: 1,
    contracts: []
  };

  componentDidMount = async () => {
    await this.getAllContract();
  };

  getAllContract = async () => {
    this.setState({
      loading: true
    });

    const query = {
      filters: {
        client: {
          specific: {
            razaosocial: this.state.nome,
            cnpj: this.state.cnpj.replace(/\D/gi, ""),
            group: this.state.grupo
          }
        },
        contract: {
          specific: {
            type: this.state.tipo !== "TODOS" && this.state.tipo,
            // type: null,
            code: this.state.codigo
          }
        }
      },
      page: this.state.page,
      total: this.state.total
    };
    const contracts = await GetAllContract(query);

    this.setState({
      contracts: contracts.data.rows,
      page: contracts.data.page,
      count: contracts.data.count,
      show: contracts.data.show,
      loading: false
    });
  };

  onChange = async e => {
    const { name, value } = masks(e.target.name, e.target.value);
    await this.setState({
      [name]: value.toUpperCase()
    });
    await this.getAllContract();
  };

  TableConsulta = () => (
    <div className="div-table">
      <div className="div-main-table">
        {this.state.contracts.length !== 0 ? (
          this.state.contracts.map(line => (
            <div className="div-line-table">
              {console.log(line)}
              <label
                className="label-nome-table"
                style={line.dateTermination ? { color: "red" } : null}
              >
                {line.client.razaosocial}
              </label>
              <label
                className="label-cnpj-table"
                style={line.dateTermination ? { color: "red" } : null}
              >
                {line.client.cnpj.length === 12
                  ? line.client.cnpj.replace(
                      /(\d{2})(\d{3})(\d{3})(\d{4})/,
                      "$1.$2.$3/$4"
                    )
                  : line.client.cnpj.replace(
                      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
                      "$1.$2.$3/$4-$5"
                    )}
              </label>
              <label
                className="label-grupo-table"
                style={line.dateTermination ? { color: "red" } : null}
              >
                {line.client.group}
              </label>
              <label
                className="label-codigo-table"
                style={line.dateTermination ? { color: "red" } : null}
              >
                {line.code}
              </label>
              <label
                className="label-tipo-table"
                style={line.dateTermination ? { color: "red" } : null}
              >
                {line.type}
              </label>
            </div>
          ))
        ) : (
          <div className="div-noItens-consulta">
            *** NENHUM CONTRATO ENCONTRADO ***
          </div>
        )}
      </div>
    </div>
  );

  changePages = async pages => {
    await this.setState(
      {
        page: pages
      },
      () => {
        this.getAllContract();
      }
    );
  };

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
    const { state, onChange } = this;
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Consulta</h1>
        </div>
        <div className="div-inputs-flex">
          <input
            className="input-nome-consulta"
            placeholder="RAZÃO SOCIAL / NOME"
            onChange={onChange}
            name="nome"
            value={state.nome}
          ></input>
          <input
            className="input-cnpj-consulta"
            placeholder="CNPJ / CPF"
            onChange={onChange}
            name="cnpj"
            value={state.cnpj}
          ></input>
          <input
            className="input-grupo-consulta"
            placeholder="GRUPO"
            onChange={onChange}
            name="grupo"
            value={state.grupo}
          ></input>
          <input
            className="input-codigo-consulta"
            placeholder="CÓDIGO"
            onChange={onChange}
            name="codigo"
            value={state.codigo}
          ></input>
          <Select
            style={{ marginRight: "25px", marginLeft: "15px", width: "15%" }}
            size="large"
            placeholder="TIPO"
            name="tipo"
            value={state.tipo}
            onChange={value =>
              this.setState({ tipo: value }, () => this.getAllContract())
            }
          >
            <Option value="TODOS">TODOS</Option>
            <Option value="MENSAL">MENSAL</Option>
            <Option value="ANUAL">ANUAL</Option>
          </Select>
        </div>

        {this.state.loading ? (
          <div className="div-spin">
            <Spin />
          </div>
        ) : (
          <this.TableConsulta />
        )}
        <div className="div-main-pages">
          <this.Pages />
        </div>
      </div>
    );
  }
}

export default GerenciarConsultaContainer;
